import pandas as pd
from sqlalchemy import create_engine

# === CONFIGURATION ===

# Path to your CSV file
csv_file_path = "C:\Users\ilams\OneDrive\Desktop\Sample RAG\FloatChat-AI-main\AnalyticalGenAI\sample_gold_layer.csv"

# PostgreSQL connection details
connection_string = 'postgresql://storagesql_user:NOz3XohA7l2MlOrsSwou7Cy9QpX4mznl@dpg-d3b91d56ubrc739i3ra0-a/storagesql'
table_name = 'sample_gold_layer'  # Target table name in PostgreSQL

# === READ CSV ===

try:
    df = pd.read_csv(csv_file_path)
    print(f"CSV file '{csv_file_path}' read successfully.")
except Exception as e:
    print(f"Error reading CSV: {e}")
    exit(1)

# === CONNECT TO POSTGRES ===

try:
    engine = create_engine(connection_string)
    with engine.connect() as conn:
        # === WRITE TO DATABASE ===
        df.to_sql(table_name, conn, if_exists='replace', index=False)
        print(f"Data written to table '{table_name}' in database 'storagesql'.")
except Exception as e:
    print(f"Error writing to PostgreSQL: {e}")
