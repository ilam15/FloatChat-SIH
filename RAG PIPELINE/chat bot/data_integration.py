import os
import pandas as pd
import numpy as np
from datetime import datetime
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
import chromadb
from sentence_transformers import SentenceTransformer
import logging

class DataIntegration:
    def __init__(self):
        self.geolocator = Nominatim(user_agent="oceanographic_chatbot")
        self.chroma_client = chromadb.PersistentClient(path="../chroma_db_enhanced")
        self.collection = self.chroma_client.get_or_create_collection(name="oceanographic_data")
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
        self.setup_logging()

    def setup_logging(self):
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)

    def load_processed_data(self):
        """Load data from the Gold layer"""
        gold_layer_path = "../DataEngineering/Gold_Data"

        try:
            # Find the most recent merged gold data
            if os.path.exists(gold_layer_path):
                for root, dirs, files in os.walk(gold_layer_path):
                    for file in files:
                        if file.startswith("merged_gold") and file.endswith(".parquet"):
                            file_path = os.path.join(root, file)
                            self.logger.info(f"Loading processed data from: {file_path}")

                            df = pd.read_parquet(file_path)

                            # Store in ChromaDB for vector search
                            self.store_in_chromadb(df)

                            return df

            self.logger.warning("No processed data found, using fallback data")
            return self.create_fallback_data()

        except Exception as e:
            self.logger.error(f"Error loading processed data: {str(e)}")
            return self.create_fallback_data()

    def create_fallback_data(self):
        """Create fallback data if processed data is not available"""
        np.random.seed(42)

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
                    actual_lat = lat + np.random.normal(0, 0.1)
                    actual_lon = lon + np.random.normal(0, 0.1)

                    data.append({
                        'lat': round(actual_lat, 4),
                        'lon': round(actual_lon, 4),
                        'year': year,
                        'month': month,
                        'sst': round(20 + np.random.normal(8, 3), 1),
                        'chlor_a': round(0.2 + np.random.exponential(1.0), 2),
                        'location': city
                    })

        return pd.DataFrame(data)

    def store_in_chromadb(self, df):
        """Store dataframe in ChromaDB for vector search"""
        try:
            # Prepare documents for embedding
            documents = []
            metadatas = []
            ids = []

            for idx, row in df.iterrows():
                # Create descriptive text for each data point
                doc = f"""
                Oceanographic measurement at coordinates ({row['lat']}, {row['lon']}):
                - Sea Surface Temperature: {row['sst']}°C
                - Chlorophyll-a: {row['chlor_a']} mg/m³
                - Date: {row['year']}-{str(row['month']).zfill(2)}
                """

                documents.append(doc)
                metadatas.append({
                    'lat': str(row['lat']),
                    'lon': str(row['lon']),
                    'year': str(row['year']),
                    'month': str(row['month']),
                    'sst': str(row['sst']),
                    'chlor_a': str(row['chlor_a'])
                })
                ids.append(f"data_{idx}")

            # Generate embeddings
            embeddings = self.embedder.encode(documents).tolist()

            # Store in ChromaDB
            self.collection.upsert(
                documents=documents,
                metadatas=metadatas,
                embeddings=embeddings,
                ids=ids
            )

            self.logger.info(f"Stored {len(documents)} records in ChromaDB")

        except Exception as e:
            self.logger.error(f"Error storing data in ChromaDB: {str(e)}")

    def find_nearest_locations(self, lat, lon, top_k=5):
        """Find nearest oceanographic measurement locations"""
        try:
            # Query ChromaDB for similar documents
            query_text = f"Oceanographic data near coordinates ({lat}, {lon})"
            query_embedding = self.embedder.encode([query_text]).tolist()

            results = self.collection.query(
                query_embeddings=query_embedding,
                n_results=top_k
            )

            # Parse results
            nearest_data = []
            for i in range(len(results['documents'][0])):
                metadata = results['metadatas'][0][i]
                nearest_data.append({
                    'lat': metadata['lat'],
                    'lon': metadata['lon'],
                    'year': metadata['year'],
                    'month': metadata['month'],
                    'sst': metadata['sst'],
                    'chlor_a': metadata['chlor_a'],
                    'distance': geodesic((lat, lon), (float(metadata['lat']), float(metadata['lon']))).km
                })

            return nearest_data

        except Exception as e:
            self.logger.error(f"Error in vector search: {str(e)}")
            return []

    def get_city_coordinates(self, city_name):
        """Get coordinates for a city name"""
        try:
            location = self.geolocator.geocode(city_name)
            if location:
                return location.latitude, location.longitude
            else:
                return None, None
        except Exception as e:
            self.logger.error(f"Error getting coordinates: {str(e)}")
            return None, None

    def get_data_statistics(self, df):
        """Get statistics from the dataframe"""
        try:
            stats = {
                'total_records': len(df),
                'unique_locations': len(df[['lat', 'lon']].drop_duplicates()),
                'date_range': f"{df['year'].min()}-{df['year'].max()}",
                'sst_stats': {
                    'mean': round(df['sst'].mean(), 2),
                    'min': round(df['sst'].min(), 2),
                    'max': round(df['sst'].max(), 2),
                    'std': round(df['sst'].std(), 2)
                },
                'chlor_stats': {
                    'mean': round(df['chlor_a'].mean(), 2),
                    'min': round(df['chlor_a'].min(), 2),
                    'max': round(df['chlor_a'].max(), 2),
                    'std': round(df['chlor_a'].std(), 2)
                }
            }
            return stats
        except Exception as e:
            self.logger.error(f"Error calculating statistics: {str(e)}")
            return None
