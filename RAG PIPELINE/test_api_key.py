#!/usr/bin/env python3
"""
Test script to verify Google API key configuration
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_api_key():
    print("🔍 Testing Google API Key Configuration")
    print("=" * 50)

    # Check if .env file exists
    env_exists = os.path.exists('.env')
    print(f"📁 .env file exists: {env_exists}")

    # Check environment variable
    api_key = os.getenv("GOOGLE_API_KEY")
    print(f"🔑 GOOGLE_API_KEY loaded: {'✅ Yes' if api_key else '❌ No'}")

    if api_key:
        print(f"🔑 API Key length: {len(api_key)} characters")
        print(f"🔑 API Key starts with: {api_key[:10]}...")

        # Basic validation
        if api_key == "your_google_api_key_here":
            print("⚠️  WARNING: API key is still set to placeholder value!")
            return False
        elif len(api_key) < 20:
            print("⚠️  WARNING: API key seems too short!")
            return False
        elif not api_key.startswith(('AIza', 'gsk_')):
            print("⚠️  WARNING: API key doesn't have expected format!")
            return False
        else:
            print("✅ API key format looks correct!")
            return True
    else:
        print("❌ No API key found in environment variables")
        return False

def test_gemini_connection():
    """Test actual connection to Gemini API"""
    try:
        from langchain_google_genai import ChatGoogleGenerativeAI

        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key or api_key == "your_google_api_key_here":
            print("❌ Cannot test connection - no valid API key")
            return False

        print("\n🌐 Testing Gemini API connection...")
        llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0)

        # Simple test message
        response = llm.invoke("Hello, can you respond with 'API test successful'?")

        if response and "API test successful" in response.content.lower():
            print("✅ Gemini API connection successful!")
            return True
        else:
            print("⚠️  Gemini API responded but content unexpected")
            return False

    except Exception as e:
        print(f"❌ Gemini API connection failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 Visual FloatChat - API Key Test")
    print("=" * 50)

    # Test environment loading
    env_ok = test_api_key()

    if env_ok:
        # Test actual API connection
        api_ok = test_gemini_connection()

        if api_ok:
            print("\n🎉 SUCCESS: API key is working correctly!")
            print("Your application should work with AI features enabled.")
        else:
            print("\n❌ FAILURE: API key is loaded but not working.")
            print("Please check your API key validity at: https://makersuite.google.com/app/apikey")
    else:
        print("\n❌ FAILURE: API key not properly configured.")
        print("\n📝 To fix this:")
        print("1. Edit the .env file")
        print("2. Replace 'your_google_api_key_here' with your actual API key")
        print("3. Save the file")
        print("4. Restart the application")
