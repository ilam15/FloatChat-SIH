#!/usr/bin/env python3
"""
Visual FloatChat Main Launcher
Main entry point for the Visual FloatChat application
"""

import subprocess
import sys
import os
import time
import threading
from pathlib import Path

def check_dependencies():
    """Check if required dependencies are installed"""
    required_modules = [
        'streamlit', 'flask', 'langchain', 'pandas', 'numpy',
        'plotly', 'folium', 'chromadb', 'geopy'
    ]

    missing_modules = []
    for module in required_modules:
        try:
            __import__(module)
            print(f"✅ {module}")
        except ImportError:
            missing_modules.append(module)
            print(f"❌ {module}")

    if missing_modules:
        print(f"\n⚠️  Missing dependencies: {', '.join(missing_modules)}")
        print("Installing missing dependencies...")
        subprocess.run([sys.executable, "-m", "pip", "install"] + missing_modules, check=True)
        print("✅ Dependencies installed successfully!")

def start_dashboard():
    """Start the dashboard component"""
    print("📊 Starting Dashboard Component...")
    try:
        dashboard_dir = "AnalyticalGenAI"
        result = subprocess.run([sys.executable, "app.py"], cwd=dashboard_dir,
                              capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Dashboard started successfully")
        else:
            print(f"⚠️ Dashboard exited with code {result.returncode}")
            if result.stdout:
                print(f"Dashboard output: {result.stdout}")
            if result.stderr:
                print(f"Dashboard error: {result.stderr}")
    except Exception as e:
        print(f"❌ Error starting dashboard: {e}")

def start_chatbot():
    """Start the chatbot component"""
    print("🤖 Starting Chatbot Component...")
    try:
        chatbot_dir = "chat bot"
        result = subprocess.run([sys.executable, "app.py"], cwd=chatbot_dir,
                              capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Chatbot started successfully")
        else:
            print(f"⚠️ Chatbot exited with code {result.returncode}")
            if result.stdout:
                print(f"Chatbot output: {result.stdout}")
            if result.stderr:
                print(f"Chatbot error: {result.stderr}")
    except Exception as e:
        print(f"❌ Error starting chatbot: {e}")

def main():
    """Main launcher function"""
    print("🌊 Visual FloatChat - AI-Powered Ocean Data Analysis")
    print("=" * 60)

    # Check and install dependencies
    check_dependencies()

    print("\n🚀 Starting Visual FloatChat Application...")
    print("This will launch both the Dashboard and Chatbot components.")

    # Start dashboard in background thread
    dashboard_thread = threading.Thread(target=start_dashboard, daemon=True)
    dashboard_thread.start()

    # Give dashboard time to start
    time.sleep(3)

    # Start chatbot
    start_chatbot()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n👋 Shutting down Visual FloatChat...")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Fatal error: {e}")
        sys.exit(1)
