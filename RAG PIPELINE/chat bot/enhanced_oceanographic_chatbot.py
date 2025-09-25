#!/usr/bin/env python3
"""
Enhanced Oceanographic Data Chatbot with RAG Integration
A comprehensive chatbot that uses processed data and vector search
"""

import os
import sys
import pandas as pd
import time
from datetime import datetime
from data_integration import DataIntegration

class EnhancedOceanographicChatbot:
    def __init__(self):
        self.data_integration = DataIntegration()
        self.df = None
        self.is_running = False
        self.load_data()

    def load_data(self):
        """Load processed oceanographic data"""
        print("Loading enhanced oceanographic data...")

        try:
            self.df = self.data_integration.load_processed_data()

            if self.df is not None and not self.df.empty:
                print(f"✅ Data loaded successfully! {len(self.df)} records available.")
                print(f"📊 Data covers {len(self.df[['lat', 'lon']].drop_duplicates())} unique locations")
                print(f"📅 Date range: {self.df['year'].min()}-{self.df['year'].max()}")
                return True
            else:
                print("⚠️  Using fallback data due to processing issues")
                return True

        except Exception as e:
            print(f"❌ Error loading data: {str(e)}")
            return False

    def process_query(self, user_input):
        """Process user query and return response"""
        user_input = user_input.lower().strip()

        # Handle greetings
        greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"]
        if user_input in greetings:
            return self.get_greeting_response()

        # Handle help requests
        if any(word in user_input for word in ["help", "what can you do", "commands", "features"]):
            return self.get_help_response()

        # Handle city queries
        cities = ["miami", "new york", "nyc", "los angeles", "boston", "seattle"]
        if any(city in user_input for city in cities):
            city_name = next(city for city in cities if city in user_input)
            return self.handle_city_query(city_name)

        # Handle coordinate queries
        if "," in user_input and any(char.isdigit() for char in user_input):
            return self.handle_coordinate_query(user_input)

        # Handle data requests
        if any(word in user_input for word in ["data", "information", "measurements", "sst", "temperature", "chlorophyll"]):
            return self.get_data_info_response()

        # Handle statistics requests
        if any(word in user_input for word in ["stats", "statistics", "summary", "overview"]):
            return self.get_statistics_response()

        # Handle RAG queries (natural language)
        if any(word in user_input for word in ["ocean", "sea", "water", "marine", "temperature", "chlorophyll"]):
            return self.handle_rag_query(user_input)

        # Default response
        return self.get_default_response()

    def get_greeting_response(self):
        """Get greeting response"""
        return """
🌊 Welcome to the Enhanced Oceanographic Data Assistant! 🌊

I can help you explore comprehensive oceanographic data including:
• Sea Surface Temperature (SST) measurements
• Chlorophyll-a concentrations
• Water quality parameters
• Location-based analysis with vector search
• Real-time data integration

Try asking me:
• "Show me data for Miami"
• "What are the SST values at 25.7617,-80.1918"
• "Give me ocean statistics"
• "Tell me about water quality near New York"
• "Help" for more options
"""

    def get_help_response(self):
        """Get help response"""
        return """
🌊 Enhanced Oceanographic Chatbot - Help Guide 🌊

Available Commands:
• "Hi", "Hello" - Start a conversation
• "Help" - Show this help guide
• "Show data for [city]" - Get data for a specific city
• "Data at [lat,lon]" - Get data for coordinates
• "Statistics" - Show data summary
• "Tell me about [topic]" - Natural language queries
• "Exit", "Quit", "Bye" - Exit the chatbot

Supported Cities:
• Miami, New York, Los Angeles
• Boston, Seattle

Example Queries:
• "Show me SST data for Miami"
• "What is the ocean data at 25.7617,-80.1918"
• "Tell me about water quality in Boston"
• "Give me statistics for chlorophyll levels"

Type "exit" to quit the chatbot.
"""

    def handle_city_query(self, city_name):
        """Handle city-based queries"""
        print(f"🔍 Searching for {city_name.title()} data...")

        lat, lon = self.data_integration.get_city_coordinates(city_name)
        if lat is None or lon is None:
            return f"❌ Could not find coordinates for {city_name.title()}."

        nearest_data = self.data_integration.find_nearest_locations(lat, lon, top_k=5)

        if not nearest_data:
            return f"❌ No oceanographic data found near {city_name.title()}."

        # Format the response
        response = f"🌊 Oceanographic Data near {city_name.title()} ({lat".4f"}, {lon".4f"}):\n"

        for i, data in enumerate(nearest_data, 1):
            response += f"""
📍 Location {i}:
   📍 Coordinates: ({data['lat']}, {data['lon']})
   📅 Date: {data['year']}-{str(data['month']).zfill(2)}
   🌡️ SST: {data['sst']}°C
   🌿 Chlorophyll-a: {data['chlor_a']} mg/m³
   📏 Distance: {data['distance']".2f"} km
"""

        return response

    def handle_coordinate_query(self, coord_input):
        """Handle coordinate-based queries"""
        try:
            lat, lon = map(float, coord_input.split(","))
            print(f"🔍 Searching for data at coordinates {lat}, {lon}...")

            nearest_data = self.data_integration.find_nearest_locations(lat, lon, top_k=5)

            if not nearest_data:
                return "❌ No oceanographic data found near these coordinates."

            response = f"🌊 Oceanographic Data near coordinates ({lat}, {lon}):\n"

            for i, data in enumerate(nearest_data, 1):
                response += f"""
📍 Location {i}:
   📍 Coordinates: ({data['lat']}, {data['lon']})
   📅 Date: {data['year']}-{str(data['month']).zfill(2)}
   🌡️ SST: {data['sst']}°C
   🌿 Chlorophyll-a: {data['chlor_a']} mg/m³
   📏 Distance: {data['distance']".2f"} km
"""

            return response

        except ValueError:
            return "❌ Invalid coordinate format. Please use: latitude,longitude (e.g., 25.7617,-80.1918)"

    def handle_rag_query(self, user_input):
        """Handle natural language queries using RAG"""
        try:
            print(f"🤖 Processing natural language query: {user_input}")

            # Use vector search to find relevant data
            query_embedding = self.data_integration.embedder.encode([user_input]).tolist()

            results = self.data_integration.collection.query(
                query_embeddings=query_embedding,
                n_results=3
            )

            if results['documents'][0]:
                response = f"🌊 Based on your query '{user_input}', here are relevant oceanographic insights:\n"

                for i, doc in enumerate(results['documents'][0], 1):
                    response += f"""
📊 Insight {i}:
{doc}
"""

                return response
            else:
                return "🤔 I couldn't find specific data matching your query. Try asking about specific locations or measurements."

        except Exception as e:
            return f"❌ Error processing query: {str(e)}"

    def get_data_info_response(self):
        """Get data information response"""
        if self.df is None:
            return "❌ No data loaded."

        info = f"""
🌊 Oceanographic Data Information:

📈 Dataset Overview:
• Total Records: {len(self.df)","}
• Unique Locations: {len(self.df[['lat', 'lon']].drop_duplicates())","}
• Date Range: {self.df['year'].min()}-{self.df['year'].max()}

🔬 Available Measurements:
• Sea Surface Temperature (SST)
• Chlorophyll-a concentration
• Geographic coordinates
• Temporal data

📊 Data Coverage:
• SST Range: {self.df['sst'].min()".1f"}°C - {self.df['sst'].max()".1f"}°C
• Chlorophyll Range: {self.df['chlor_a'].min()".2f"} - {self.df['chlor_a'].max()".2f"} mg/m³
"""

        return info

    def get_statistics_response(self):
        """Get statistics response"""
        if self.df is None:
            return "❌ No data loaded."

        try:
            stats = self.data_integration.get_data_statistics(self.df)

            if stats:
                response = f"""
🌊 Oceanographic Data Statistics:

📈 SST Statistics:
• Mean: {stats['sst_stats']['mean']}°C
• Min: {stats['sst_stats']['min']}°C
• Max: {stats['sst_stats']['max']}°C
• Std Dev: {stats['sst_stats']['std']}°C

🌿 Chlorophyll Statistics:
• Mean: {stats['chlor_stats']['mean']} mg/m³
• Min: {stats['chlor_stats']['min']} mg/m³
• Max: {stats['chlor_stats']['max']} mg/m³
• Std Dev: {stats['chlor_stats']['std']} mg/m³

📊 Data Summary:
• Total Records: {stats['total_records']","}
• Date Range: {stats['date_range']}
• Unique Locations: {stats['unique_locations']","}
"""

                return response
            else:
                return "❌ Error calculating statistics."

        except Exception as e:
            return f"❌ Error calculating statistics: {str(e)}"

    def get_default_response(self):
        """Get default response for unrecognized queries"""
        return """
🤔 I didn't understand that query.

I can help you with:
• Oceanographic data queries
• City-based searches (Miami, New York, etc.)
• Coordinate-based searches (lat,lon)
• Natural language queries about ocean data
• Data statistics and summaries

Try asking:
• "Show me data for Miami"
• "What are the SST values at 25.7617,-80.1918"
• "Tell me about water quality in Boston"
• "Give me statistics"
• "Help" for more options
"""

    def display_welcome(self):
        """Display welcome message"""
        os.system('cls' if os.name == 'nt' else 'clear')

        welcome_text = """
🌊 ENHANCED OCEANOGRAPHIC DATA CHATBOT 🌊

🤖 Advanced AI-Powered Oceanographic Data Assistant

This enhanced chatbot provides:
• Real-time processed oceanographic data
• Vector-based semantic search (RAG)
• Natural language query processing
• Comprehensive data analysis
• Location-based insights

Getting Started:
• Type "help" to see all available commands
• Type "exit" to quit
• Ask questions in natural language!

Ready to explore ocean data? Let's begin!
"""
        print(welcome_text)

    def run(self):
        """Run the chatbot"""
        self.display_welcome()

        if not self.load_data():
            print("Failed to load data. Exiting...")
            return

        self.is_running = True
        print("\n🤖 Enhanced Chatbot is ready! Type 'help' for commands or 'exit' to quit.\n")

        try:
            while self.is_running:
                try:
                    # Get user input
                    user_input = input("You: ").strip()

                    if not user_input:
                        continue

                    # Handle exit commands
                    if user_input.lower() in ["exit", "quit", "bye", "goodbye"]:
                        print("\n🌊 Thank you for using the Enhanced Oceanographic Chatbot!")
                        break

                    # Process the query
                    print("\n🤖 Assistant: ")
                    response = self.process_query(user_input)
                    print(response)

                    # Add a small delay for better UX
                    time.sleep(0.5)

                except KeyboardInterrupt:
                    print("\n\n🌊 Thank you for using the Enhanced Oceanographic Chatbot!")
                    break
                except Exception as e:
                    print(f"❌ Error processing your request: {str(e)}")

        except Exception as e:
            print(f"❌ Unexpected error: {str(e)}")
        finally:
            self.is_running = False

def main():
    """Main function"""
    chatbot = EnhancedOceanographicChatbot()
    chatbot.run()

if __name__ == "__main__":
    main()
