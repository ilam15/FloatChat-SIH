from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
import json
from dotenv import load_dotenv
from datetime import datetime

from Database.db_connection import User, Base, engine, get_db
from sqlalchemy.orm import Session


# --- LangChain / RAG Imports ---
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.memory import ConversationBufferMemory
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.schema import Document
import pandas as pd
import numpy as np
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
from langchain.tools import Tool
from langchain.agents import initialize_agent, AgentType
from langchain_core.messages import HumanMessage

# --- Flask App ---
app = Flask(__name__)
CORS(app)  # allow frontend calls

# Create tables (optional - skip if DB connection fails)
try:
    Base.metadata.create_all(bind=engine)
    print("[DB] Tables created successfully")
except Exception as db_error:
    print(f"[DB] Warning: Could not create tables - {db_error}")
    print("[DB] Server will start without database functionality. User endpoints may fail.")

# --- API KEY ---
# Load environment variables from .env file
load_dotenv()

# Load from environment variable
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError(
        "[ERROR] GOOGLE_API_KEY not found in environment variables!\n"
        "Please add your Google API key to the .env file:\n"
        "GOOGLE_API_KEY='your_actual_api_key_here'\n"
        "Get your API key from: https://makersuite.google.com/app/apikey"
    )

# Validate API key format
if GOOGLE_API_KEY == "your_google_api_key_here":
    raise ValueError(
        "[ERROR] GOOGLE_API_KEY is still set to placeholder value!\n"
        "Please replace 'your_google_api_key_here' with your actual API key in the .env file."
    )

if len(GOOGLE_API_KEY) < 20:
    raise ValueError(
        f"[ERROR] GOOGLE_API_KEY seems too short ({len(GOOGLE_API_KEY)} characters). "
        "Please check your API key in the .env file."
    )

os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

# --- LLM Setup ---
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0)
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True, k=5)

# ---------------- SIMPLE RAG CHAIN ----------------
class SimpleRagChain:
    def __init__(self, retriever, df):
        self.retriever = retriever
        self.df = df  # keep raw data
        # Column descriptions
        self.column_desc = {
            "lat": "Latitude",
            "lon": "Longitude",
            "year": "Year",
            "month": "Month",
            "sst": "Sea Surface Temperature (SST, °C)",
            "poc": "Particulate Organic Carbon (POC, mg/m³)",
            "pic": "Particulate Inorganic Carbon (PIC, mg/m³)",
            "aot_862": "Aerosol Optical Thickness (AOT_862)",
            "chlor_a": "Chlorophyll-a (mg/m³)",
            "Kd_490": "Water Turbidity / Clarity (Kd_490, m⁻¹)",
        }

    def find_nearest(self, lat, lon, top_k=3):
        """Find top-k nearest locations using raw lat/lon"""
        self.df["distance"] = self.df.apply(
            lambda row: geodesic((lat, lon), (float(row["lat"]), float(row["lon"]))).km,
            axis=1,
        )
        nearest = self.df.nsmallest(top_k, "distance")
        results = []
        for _, row in nearest.iterrows():
            result = {desc: row[col] for col, desc in self.column_desc.items() if col in row}
            result["Distance from query (km)"] = f"{row['distance']:.2f}"
            results.append(result)
        return {"answer": results}

    def format_nearest_human_readable(self, lat, lon, top_k=3):
        """Return a human-readable string for nearest points"""
        data = self.find_nearest(lat, lon, top_k)["answer"]
        lines = [f"[OCEAN] Oceanographic data near ({lat}, {lon}):"]
        for i, res in enumerate(data, 1):
            lines.append(f"\n[DATA] Result {i}:")
            for k, v in res.items():
                lines.append(f"   - {k}: {v}")
        return "\n".join(lines)

# ---------------- VECTORSTORE BUILDER ----------------
def build_vectorstore(parquet_path, persist_directory="./chroma_db", batch_size=1000):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
    
    df = pd.read_parquet(parquet_path).astype(str)

    if os.path.exists(persist_directory) and os.listdir(persist_directory):
        vectorstore = Chroma(persist_directory=persist_directory, embedding_function=embeddings)
        return SimpleRagChain(vectorstore.as_retriever(search_kwargs={"k": 5}), df)

    vectorstore = Chroma(embedding_function=embeddings, persist_directory=persist_directory)
    
    for batch in np.array_split(df, len(df)//batch_size + 1):
        docs = [
            Document(
                page_content=(
                    f"Location: ({row['lat']}, {row['lon']}), "
                    f"Year: {row['year']}, Month: {row['month']}, "
                    f"SST: {row['sst']}°C, POC: {row['poc']}, PIC: {row['pic']}, "
                    f"AOT_862: {row['aot_862']}, Chlor_a: {row['chlor_a']}, "
                    f"Kd_490: {row['Kd_490']}"
                ),
                metadata=row.to_dict()
            )
            for _, row in batch.iterrows()
        ]
        vectorstore.add_documents(docs)
        vectorstore.persist()

    return SimpleRagChain(vectorstore.as_retriever(search_kwargs={"k": 5}), df)

# ---------------- TOOLS ----------------
def _tool1_impl(user_input: str) -> str:
    prompt = f"""
    Extract the city name only from the user query.
    If user provided lat/lon, return "COORDINATES".
    If nothing, return "UNKNOWN".
    Query: {user_input}
    """
    response = llm([HumanMessage(content=prompt)])
    return response.content.strip()

def _tool2_impl(city_name: str):
    geolocator = Nominatim(user_agent="rag_location_app")
    location = geolocator.geocode(city_name)
    if not location:
        return f"[ERROR] Could not find coordinates for {city_name}."
    return rag_chain.format_nearest_human_readable(location.latitude, location.longitude, top_k=3)

def _tool3_impl(coords: str):
    try:
        lat, lon = map(float, coords.split(","))
        return rag_chain.format_nearest_human_readable(lat, lon, top_k=3)
    except Exception as e:
        return f"[ERROR] Invalid coordinates: {str(e)}"

tool1 = Tool(name="extract_city", func=_tool1_impl, description="Extract city from query")
tool2 = Tool(name="city_to_results", func=_tool2_impl, description="Get oceanographic data for a city")
tool3 = Tool(name="coords_to_results", func=_tool3_impl, description="Get oceanographic data for coordinates")

agent_executor = initialize_agent(
    tools=[tool1, tool2, tool3],
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    memory=memory,
    verbose=True,
    handle_parsing_errors=True,
)

# ---------------- AGENT RUNNER ----------------
def run_with_agent(user_input: str):
    greetings = ["hi", "hello", "hey", "good morning", "good evening"]
    if user_input.lower().strip() in greetings:
        return "[INFO] Hi there! How can I help you with SST or oceanographic data today?"

    try:
        return agent_executor.run(input=user_input)
    except Exception as e:
        return f"[ERROR] Agent Error: {e}"

# ---------------- USER API ENDPOINTS ----------------

@app.route("/api/users", methods=["GET"])
def get_users():
    db: Session = next(get_db())
    try:
        users = db.query(User).all()
        return jsonify([
            {
                "id": user.id,
                "email": user.email,
                "created_at": user.created_at,
                "updated_at": user.updated_at
            }
            for user in users
        ])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@app.route("/api/users/<int:user_id>", methods=["GET"])
def get_user_by_id(user_id: int):
    db: Session = next(get_db())
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            return jsonify({
                "id": user.id,
                "email": user.email,
                "created_at": user.created_at,
                "updated_at": user.updated_at
            })
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@app.route("/api/users/search", methods=["POST"])
def get_user_by_email():
    data = request.get_json()
    email = data.get("email")
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    db: Session = next(get_db())
    try:
        user = db.query(User).filter(User.email == email).first()
        if user:
            return jsonify({
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "phone": user.phone,
                "username": user.username,
                "user_type": user.user_type,
                "institution": user.institution,
                "account_type": user.account_type,
                "preferences": json.loads(user.preferences) if user.preferences else {},
                "created_at": user.created_at,
                "updated_at": user.updated_at
            })
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@app.route("/api/users", methods=["POST"])
def create_user():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    
    db: Session = next(get_db())
    try:
        # Check if user exists
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            return jsonify({"error": "User already exists"}), 409
        
        new_user = User(
            name=data.get("name", ""),
            email=email,
            password=password,
            phone=data.get("phone", ""),
            username=data.get("username", email.split('@')[0]),
            user_type=data.get("userType", "general"),
            institution=data.get("institution", ""),
            account_type=data.get("accountType", "Basic"),
            preferences=json.dumps(data.get("preferences", {"theme": "light", "notifications": True, "language": "english"}))
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return jsonify({
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "phone": new_user.phone,
            "username": new_user.username,
            "user_type": new_user.user_type,
            "institution": new_user.institution,
            "account_type": new_user.account_type,
            "preferences": json.loads(new_user.preferences),
            "created_at": new_user.created_at,
            "updated_at": new_user.updated_at
        }), 201
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@app.route("/api/login", methods=["POST"])
def login_user():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    
    db: Session = next(get_db())
    try:
        user = db.query(User).filter(User.email == email).first()
        if user and user.password == password:
            return jsonify({
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "phone": user.phone,
                "username": user.username,
                "user_type": user.user_type,
                "institution": user.institution,
                "account_type": user.account_type,
                "preferences": json.loads(user.preferences) if user.preferences else {},
                "created_at": user.created_at,
                "updated_at": user.updated_at
            })
        return jsonify({"error": "Invalid email or password"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@app.route("/api/users/<int:user_id>", methods=["PUT"])
def update_user(user_id: int):
    data = request.get_json()
    db: Session = next(get_db())
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        if "email" in data:
            user.email = data["email"]
        if "password" in data:
            user.password = data["password"]
        user.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(user)
        
        return jsonify({
            "id": user.id,
            "email": user.email,
            "created_at": user.created_at,
            "updated_at": user.updated_at
        })
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@app.route("/api/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id: int):
    db: Session = next(get_db())
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        db.delete(user)
        db.commit()
        
        return jsonify({"success": True})
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

# ---------------- INITIALIZE VECTORSTORE ----------------
rag_chain = build_vectorstore("RAG PIPELINE/dummy_ocean_data.parquet")

# ---------------- API ENDPOINT ----------------
@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_prompt = data.get("prompt", "")
    response = run_with_agent(user_prompt)
    return jsonify({"response": response})

# ---------------- MAIN ----------------
if __name__ == "__main__":
    import socket
    import sys

    def find_free_port(start_port=5000):
        """Find a free port starting from start_port"""
        for port in range(start_port, start_port + 10):
            try:
                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                    s.bind(('', port))
                    return port
            except OSError:
                continue
        return start_port  # fallback to original port

    try:
        port = find_free_port(5000)
        print(f"[OCEAN] Starting AnalyticalGenAI API on port {port}")
        app.run(host="0.0.0.0", port=port, debug=True, use_reloader=False)
    except KeyboardInterrupt:
        print("\n[INFO] AnalyticalGenAI API stopped by user")
        sys.exit(0)
    except Exception as e:
        print(f"[ERROR] Error starting AnalyticalGenAI API: {e}")
        sys.exit(1)
