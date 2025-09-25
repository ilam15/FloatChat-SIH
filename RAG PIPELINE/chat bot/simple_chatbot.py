#!/usr/bin/env python3
"""
Simple Oceanographic Data Chatbot
A basic command-line chatbot for querying oceanographic data
"""

import pandas as pd
import numpy as np
import os
import sys
from datetime import datetime
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
import time
import google.generativeai as genai
from dotenv import load_dotenv

class OceanographicChatbot:
    def __init__(self):
        self.df = None
        self.geolocator = Nominatim(user_agent="oceanographic_chatbot")
        self.is_running = False
        self.model = None
        self._setup_gemini()

    def _setup_gemini(self):
        """Setup Google Gemini API"""
        try:
            load_dotenv()
            api_key = os.getenv('GOOGLE_API_KEY')
            if not api_key:
                print("Warning: GOOGLE_API_KEY not found in environment variables. LLM features will be disabled.")
                self.model = None
                return

            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
            print("Google Gemini API configured successfully.")
        except Exception as e:
            print(f"Error setting up Gemini API: {e}")
            self.model = None

    def load_data(self):
        """Load oceanographic data"""
        print("Loading oceanographic data...")

        try:
            # Try to find data in the parent directory
            parent_paths = [
                "../AnalyticalGenAI/dummy_ocean_data.parquet",
                "dummy_ocean_data.parquet"
            ]

            for path in parent_paths:
                if os.path.exists(path):
                    self.df = pd.read_parquet(path).astype(str)
                    break

            if self.df is None:
                # Create sample data if no data file is found
                print("No data file found, creating sample data...")
                self.create_sample_data()

            print("Data loaded successfully! " + str(len(self.df)) + " records available.")
            return True

        except Exception as e:
            print("Error loading data: " + str(e))
            return False

    def create_sample_data(self):
        """Create sample oceanographic data"""
        np.random.seed(42)

        # Create sample locations around major coastal cities
        cities = [
            ("Miami", 25.7617, -80.1918),
            ("New York", 40.7128, -74.0060),
            ("Los Angeles", 34.0522, -118.2437),
            ("Boston", 42.3601, -71.0589),
            ("Seattle", 47.6062, -122.3321),
        ]

        data = []
        for city, lat, lon in cities:
            for year in [2022, 2023, 2024]:
                for month in range(1, 13):
                    # Add some variation around the base coordinates
                    actual_lat = lat + np.random.normal(0, 0.1)
                    actual_lon = lon + np.random.normal(0, 0.1)

                    # Generate realistic oceanographic measurements
                    data.append({
                        'lat': str(round(actual_lat, 4)),
                        'lon': str(round(actual_lon, 4)),
                        'year': str(year),
                        'month': str(month),
                        'sst': str(round(20 + np.random.normal(8, 3), 1)),  # SST between 15-30°C
                        'chlor_a': str(round(0.2 + np.random.exponential(1.0), 2)),  # Chlorophyll
                    })

        self.df = pd.DataFrame(data)

    def find_nearest_locations(self, lat, lon, top_k=5):
        """Find nearest oceanographic measurement locations"""
        if self.df is None:
            return []

        # Calculate distances
        self.df = self.df.copy()
        self.df["distance"] = self.df.apply(
            lambda row: geodesic((lat, lon), (float(row["lat"]), float(row["lon"]))).km,
            axis=1,
        )

        # Get nearest locations
        nearest = self.df.nsmallest(top_k, "distance")
        return nearest.to_dict('records')

    def get_city_coordinates(self, city_name):
        """Get coordinates for a city name"""
        try:
            location = self.geolocator.geocode(city_name)
            if location:
                return location.latitude, location.longitude
            else:
                return None, None
        except Exception as e:
            print("Error getting coordinates: " + str(e))
            return None, None

    def process_query(self, user_input):
        """Process user query and return response using LLM"""
        if self.model is None:
            # Fallback to rule-based if LLM not available
            return self._process_query_rule_based(user_input)

        try:
            # Prepare data context for the LLM
            data_context = self._prepare_data_context()

            # Create system prompt
            system_prompt = f"""
You are an Oceanographic Data Assistant. You have access to oceanographic data including Sea Surface Temperature (SST) and Chlorophyll-a concentrations.

Data Context:
{data_context}

Instructions:
- Answer questions about oceanographic data naturally and helpfully
- When asked about specific locations, provide relevant data points
- Explain oceanographic concepts when asked
- Be conversational but informative
- If data is not available for a specific query, say so politely
- Format responses clearly, especially when showing data
- Keep responses concise but comprehensive

Available data includes measurements from various coastal locations around major US cities.
"""

            # Generate response using Gemini
            response = self.model.generate_content(f"{system_prompt}\n\nUser Query: {user_input}")
            return response.text.strip()

        except Exception as e:
            print(f"Error with LLM: {e}")
            # Fallback to rule-based
            return self._process_query_rule_based(user_input)

    def _prepare_data_context(self):
        """Prepare data context for LLM"""
        if self.df is None:
            return "No data loaded."

        # Get sample data points for context
        sample_data = self.df.head(20).to_dict('records')

        context = f"""
Dataset Overview:
- Total Records: {len(self.df)}
- Date Range: {self.df['year'].min()} - {self.df['year'].max()}
- Locations: {len(self.df[['lat', 'lon']].drop_duplicates())} unique locations

Sample Data Points:
"""

        for i, data in enumerate(sample_data[:10], 1):
            context += f"""
{i}. Location: ({data['lat']}, {data['lon']}) | Date: {data['year']}-{data['month']} | SST: {data['sst']}°C | Chlorophyll-a: {data['chlor_a']} mg/m³
"""

        # Add statistics
        try:
            sst_values = pd.to_numeric(self.df['sst'], errors='coerce')
            chlor_values = pd.to_numeric(self.df['chlor_a'], errors='coerce')

            context += f"""

Statistics Summary:
- SST Range: {sst_values.min():.1f}°C - {sst_values.max():.1f}°C (Mean: {sst_values.mean():.1f}°C)
- Chlorophyll-a Range: {chlor_values.min():.2f} - {chlor_values.max():.2f} mg/m³ (Mean: {chlor_values.mean():.2f} mg/m³)
"""
        except:
            pass

        return context

    def _process_query_rule_based(self, user_input):
        """Fallback rule-based processing"""
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

        # Default response
        return self.get_default_response()

    def get_greeting_response(self):
        """Get greeting response"""
        return """
Hello! I'm your Oceanographic Data Assistant!

I can help you explore oceanographic data including:
• Sea Surface Temperature (SST)
• Chlorophyll-a concentrations
• Water quality measurements
• Location-based queries

Try asking me:
• "Show me data for Miami"
• "What are the SST values at 25.7617,-80.1918"
• "Give me statistics"
• "Help" for more options
"""

    def get_help_response(self):
        """Get help response"""
        return """
Oceanographic Chatbot - Help Guide

Available Commands:
• "Hi", "Hello" - Start a conversation
• "Help" - Show this help guide
• "Show data for [city]" - Get data for a specific city
• "Data at [lat,lon]" - Get data for coordinates
• "Statistics" - Show data summary
• "Exit", "Quit", "Bye" - Exit the chatbot

Supported Cities:
• Miami, New York, Los Angeles
• Boston, Seattle

Example Queries:
• "Show me SST data for Miami"
• "What is the ocean data at 25.7617,-80.1918"
• "Give me statistics for New York"

Type "exit" to quit the chatbot.
"""

    def handle_city_query(self, city_name):
        """Handle city-based queries"""
        print("Searching for " + city_name.title() + " data...")

        lat, lon = self.get_city_coordinates(city_name)
        if lat is None or lon is None:
            return "Could not find coordinates for " + city_name.title() + "."

        nearest_data = self.find_nearest_locations(lat, lon, top_k=5)

        if not nearest_data:
            return "No oceanographic data found near " + city_name.title() + "."

        # Format the response
        response = "Oceanographic Data near " + city_name.title() + ", " + str(round(lat, 4)) + ", " + str(round(lon, 4)) + ":\n"

        for i, data in enumerate(nearest_data, 1):
            response += """
Location """ + str(i) + """:
   Coordinates: (""" + data['lat'] + ", " + data['lon'] + """)
   Date: """ + data['year'] + "-" + data['month'].zfill(2) + """
   SST: """ + data['sst'] + """°C
   Chlorophyll-a: """ + data['chlor_a'] + """ mg/m³
   Distance: """ + str(round(data['distance'], 2)) + """ km
"""

        return response

    def handle_coordinate_query(self, coord_input):
        """Handle coordinate-based queries"""
        try:
            lat, lon = map(float, coord_input.split(","))
            print("Searching for data at coordinates " + str(lat) + ", " + str(lon) + "...")

            nearest_data = self.find_nearest_locations(lat, lon, top_k=5)

            if not nearest_data:
                return "No oceanographic data found near these coordinates."

            response = "Oceanographic Data near coordinates (" + str(lat) + ", " + str(lon) + "):\n"

            for i, data in enumerate(nearest_data, 1):
                response += """
Location """ + str(i) + """:
   Coordinates: (""" + data['lat'] + ", " + data['lon'] + """)
   Date: """ + data['year'] + "-" + data['month'].zfill(2) + """
   SST: """ + data['sst'] + """°C
   Chlorophyll-a: """ + data['chlor_a'] + """ mg/m³
   Distance: """ + str(round(data['distance'], 2)) + """ km
"""

            return response

        except ValueError:
            return "Invalid coordinate format. Please use: latitude,longitude (e.g., 25.7617,-80.1918)"

    def get_data_info_response(self):
        """Get data information response"""
        if self.df is None:
            return "No data loaded."

        info = """
Oceanographic Data Information:

Dataset Overview:
• Total Records: """ + str(len(self.df)) + """
• Date Range: """ + self.df['year'].min() + "-" + self.df['year'].max() + """
• Location Range: """ + str(len(self.df[['lat', 'lon']].drop_duplicates())) + """ unique locations

Available Measurements:
• Sea Surface Temperature (SST)
• Chlorophyll-a concentration

Data Statistics:
• SST Range: """ + self.df['sst'].min() + """°C - """ + self.df['sst'].max() + """°C
• Chlorophyll Range: """ + self.df['chlor_a'].min() + " - " + self.df['chlor_a'].max() + """ mg/m³
"""

        return info

    def get_statistics_response(self):
        """Get statistics response"""
        if self.df is None:
            return "No data loaded."

        try:
            # Calculate basic statistics
            sst_values = pd.to_numeric(self.df['sst'], errors='coerce')
            chlor_values = pd.to_numeric(self.df['chlor_a'], errors='coerce')

            response = """
Oceanographic Data Statistics:

SST Statistics:
• Mean: """ + str(round(sst_values.mean(), 2)) + """°C
• Min: """ + str(round(sst_values.min(), 2)) + """°C
• Max: """ + str(round(sst_values.max(), 2)) + """°C
• Std Dev: """ + str(round(sst_values.std(), 2)) + """°C

Chlorophyll Statistics:
• Mean: """ + str(round(chlor_values.mean(), 2)) + """ mg/m³
• Min: """ + str(round(chlor_values.min(), 2)) + """ mg/m³
• Max: """ + str(round(chlor_values.max(), 2)) + """ mg/m³
• Std Dev: """ + str(round(chlor_values.std(), 2)) + """ mg/m³

Data Summary:
• Total Records: """ + str(len(self.df)) + """
• Date Range: """ + self.df['year'].min() + " - " + self.df['year'].max() + """
• Unique Locations: """ + str(len(self.df[['lat', 'lon']].drop_duplicates())) + """
"""

            return response

        except Exception as e:
            return "Error calculating statistics: " + str(e)

    def get_default_response(self):
        """Get default response for unrecognized queries"""
        return """
I didn't understand that query.

I can help you with:
• Oceanographic data queries
• City-based searches (Miami, New York, etc.)
• Coordinate-based searches (lat,lon)
• Data statistics and summaries

Try asking:
• "Show me data for Miami"
• "What are the SST values at 25.7617,-80.1918"
• "Give me statistics"
• "Help" for more options
"""

    def display_welcome(self):
        """Display welcome message"""
        os.system('cls' if os.name == 'nt' else 'clear')

        welcome_text = """
🌊 OCEANOGRAPHIC DATA CHATBOT 🌊

Welcome to your Oceanographic Data Assistant!

This chatbot provides access to comprehensive oceanographic data including:
• Sea Surface Temperature (SST)
• Chlorophyll-a concentrations
• Water quality measurements
• Location-based analysis

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
        print("\nChatbot is ready! Type 'help' for commands or 'exit' to quit.\n")

        try:
            while self.is_running:
                try:
                    # Get user input
                    user_input = input("You: ").strip()

                    if not user_input:
                        continue

                    # Handle exit commands
                    if user_input.lower() in ["exit", "quit", "bye", "goodbye"]:
                        print("\nThank you for using the Oceanographic Chatbot!")
                        break

                    # Process the query
                    print("\nAssistant: ")
                    response = self.process_query(user_input)
                    print(response)

                    # Add a small delay for better UX
                    time.sleep(0.5)

                except KeyboardInterrupt:
                    print("\n\nThank you for using the Oceanographic Chatbot!")
                    break
                except Exception as e:
                    print("Error processing your request: " + str(e))

        except Exception as e:
            print("Unexpected error: " + str(e))
        finally:
            self.is_running = False

def main():
    """Main function"""
    chatbot = OceanographicChatbot()
    chatbot.run()

if __name__ == "__main__":
    main()
