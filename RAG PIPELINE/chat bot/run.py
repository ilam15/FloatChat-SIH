#!/usr/bin/env python3
"""
Oceanographic Chatbot Launcher
Simple launcher script for the oceanographic data chatbot
"""

import subprocess
import sys
import os

def main():
    """Launch the oceanographic chatbot"""
    print("🌊 Starting Oceanographic Data Chatbot...")
    print("Loading chatbot application...")

    try:
        # Run the chatbot
        result = subprocess.run([sys.executable, "simple_chatbot.py"],
                              cwd=os.path.dirname(os.path.abspath(__file__)))
        return result.returncode
    except KeyboardInterrupt:
        print("\n👋 Chatbot stopped by user.")
        return 0
    except Exception as e:
        print(f"❌ Error starting chatbot: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
