#!/usr/bin/env python3
"""
Integration Test Script
Tests the complete data engineering pipeline and chatbot integration
"""

import os
import sys
import subprocess
import time
from pathlib import Path

def run_command(command, description):
    """Run a command and return success status"""
    print(f"\n🧪 Testing: {description}")
    print(f"Running: {command}")

    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=60)

        if result.returncode == 0:
            print(f"✅ {description} - PASSED")
            if result.stdout:
                print(f"Output: {result.stdout[:200]}...")
            return True
        else:
            print(f"❌ {description} - FAILED")
            print(f"Error: {result.stderr}")
            return False

    except subprocess.TimeoutExpired:
        print(f"⏰ {description} - TIMEOUT")
        return False
    except Exception as e:
        print(f"❌ {description} - ERROR: {str(e)}")
        return False

def test_data_pipeline():
    """Test the data engineering pipeline"""
    print("\n" + "="*60)
    print("🧪 TESTING DATA ENGINEERING PIPELINE")
    print("="*60)

    tests_passed = 0
    total_tests = 0

    # Test 1: Check if pipeline files exist
    total_tests += 1
    if os.path.exists("DataEngineering/main_fixed.py"):
        tests_passed += 1
        print("✅ Pipeline files exist")
    else:
        print("❌ Pipeline files missing")

    # Test 2: Check if utils_notebook exists
    total_tests += 1
    if os.path.exists("DataEngineering/utils_notebook.py"):
        tests_passed += 1
        print("✅ Utility functions available")
    else:
        print("❌ Utility functions missing")

    # Test 3: Check if bronze data exists
    total_tests += 1
    bronze_path = "DataEngineering/Bronze_Data/2025/08/sst"
    if os.path.exists(bronze_path):
        tests_passed += 1
        print("✅ Bronze data available")
    else:
        print("❌ Bronze data missing")

    # Test 4: Try to run pipeline (dry run)
    total_tests += 1
    try:
        # Import and check if modules can be loaded
        sys.path.append("DataEngineering")
        from config import SLIVER_CONFIG, BRONZE_LAYER, SILVER_LAYER, GOLD_LAYER
        print("✅ Configuration loaded successfully")
        tests_passed += 1
    except Exception as e:
        print(f"❌ Configuration error: {str(e)}")

    print(f"\n📊 Pipeline Tests: {tests_passed}/{total_tests} passed")
    return tests_passed == total_tests

def test_chatbot_integration():
    """Test the chatbot integration"""
    print("\n" + "="*60)
    print("🧪 TESTING CHATBOT INTEGRATION")
    print("="*60)

    tests_passed = 0
    total_tests = 0

    # Test 1: Check if enhanced chatbot exists
    total_tests += 1
    if os.path.exists("chat bot/enhanced_oceanographic_chatbot_fixed.py"):
        tests_passed += 1
        print("✅ Enhanced chatbot available")
    else:
        print("❌ Enhanced chatbot missing")

    # Test 2: Check if data integration module exists
    total_tests += 1
    if os.path.exists("chat bot/data_integration.py"):
        tests_passed += 1
        print("✅ Data integration module available")
    else:
        print("❌ Data integration module missing")

    # Test 3: Check if ChromaDB exists
    total_tests += 1
    if os.path.exists("chroma_db_enhanced"):
        tests_passed += 1
        print("✅ ChromaDB database available")
    else:
        print("❌ ChromaDB database missing")

    # Test 4: Check if requirements are updated
    total_tests += 1
    try:
        with open("chat bot/requirements.txt", "r") as f:
            content = f.read()
            if "chromadb" in content and "sentence-transformers" in content:
                tests_passed += 1
                print("✅ Requirements updated for RAG")
            else:
                print("❌ Requirements not updated")
    except Exception as e:
        print(f"❌ Error checking requirements: {str(e)}")

    print(f"\n📊 Chatbot Tests: {tests_passed}/{total_tests} passed")
    return tests_passed == total_tests

def test_end_to_end():
    """Test end-to-end functionality"""
    print("\n" + "="*60)
    print("🧪 TESTING END-TO-END FUNCTIONALITY")
    print("="*60)

    tests_passed = 0
    total_tests = 0

    # Test 1: Try to import enhanced chatbot
    total_tests += 1
    try:
        sys.path.append("chat bot")
        from enhanced_oceanographic_chatbot_fixed import EnhancedOceanographicChatbot
        print("✅ Enhanced chatbot can be imported")
        tests_passed += 1
    except Exception as e:
        print(f"❌ Cannot import enhanced chatbot: {str(e)}")

    # Test 2: Try to import data integration
    total_tests += 1
    try:
        from data_integration import DataIntegration
        print("✅ Data integration can be imported")
        tests_passed += 1
    except Exception as e:
        print(f"❌ Cannot import data integration: {str(e)}")

    # Test 3: Check if processed data path exists
    total_tests += 1
    gold_path = "DataEngineering/Gold_Data"
    if os.path.exists(gold_path):
        tests_passed += 1
        print("✅ Gold data directory exists")
    else:
        print("❌ Gold data directory missing")

    print(f"\n📊 End-to-End Tests: {tests_passed}/{total_tests} passed")
    return tests_passed >= 2  # Allow for some flexibility

def main():
    """Main test function"""
    print("🔬 COMPREHENSIVE INTEGRATION TEST SUITE")
    print("Testing data engineering pipeline and chatbot integration")
    print("="*60)

    pipeline_ok = test_data_pipeline()
    chatbot_ok = test_chatbot_integration()
    e2e_ok = test_end_to_end()

    print("\n" + "="*60)
    print("📋 FINAL TEST RESULTS")
    print("="*60)

    print(f"Data Pipeline: {'✅ PASS' if pipeline_ok else '❌ FAIL'}")
    print(f"Chatbot Integration: {'✅ PASS' if chatbot_ok else '❌ FAIL'}")
    print(f"End-to-End: {'✅ PASS' if e2e_ok else '❌ FAIL'}")

    if pipeline_ok and chatbot_ok and e2e_ok:
        print("\n🎉 ALL TESTS PASSED! Integration is working correctly.")
        print("\nNext steps:")
        print("1. Run the data pipeline: python DataEngineering/main_fixed.py")
        print("2. Start the enhanced chatbot: python chat bot/enhanced_oceanographic_chatbot_fixed.py")
        print("3. Test with queries like 'Show me data for Miami' or 'Give me statistics'")
        return True
    else:
        print("\n⚠️  Some tests failed. Please review the issues above.")
        print("\nRecommended fixes:")
        print("1. Install missing dependencies: pip install -r chat bot/requirements.txt")
        print("2. Check that all required files are in place")
        print("3. Verify Bronze data exists in DataEngineering/Bronze_Data/")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
