from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from groq import Groq

app = Flask(__name__)
CORS(app)
load_dotenv()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
CORS(app)

load_dotenv()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    # Call your Groq/llama3 logic here
    # This is a placeholder, replace with your actual logic
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": user_message}]
    )
    bot_reply = response.choices[0].message.content
    return jsonify({'reply': bot_reply})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
