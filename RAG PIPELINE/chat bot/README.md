# 🌊 Oceanographic Data Chatbot

A comprehensive command-line chatbot for querying oceanographic data including Sea Surface Temperature (SST), chlorophyll concentrations, and other marine measurements.

## Features

- **Interactive Chat Interface**: Natural language processing for oceanographic queries
- **City-Based Queries**: Get data for major coastal cities (Miami, New York, Los Angeles, etc.)
- **Coordinate-Based Queries**: Query data using latitude and longitude coordinates
- **Data Statistics**: View comprehensive statistics and summaries
- **Real Oceanographic Data**: Access to actual SST and chlorophyll measurements
- **Sample Data Generation**: Creates realistic sample data if no data file is found

## Installation

1. Navigate to the chatbot directory:
   ```bash
   cd "chat bot"
   ```

2. Install dependencies:
   ```bash
   pip install pandas numpy geopy
   ```

3. Run the chatbot:
   ```bash
   python simple_chatbot.py
   ```

## Usage

### Starting the Chatbot

```bash
python simple_chatbot.py
```

### Available Commands

- **Greetings**: "Hi", "Hello", "Hey" - Start a conversation
- **Help**: "Help", "What can you do" - Show help guide
- **City Queries**: "Show me data for Miami", "SST data for New York"
- **Coordinate Queries**: "Data at 25.7617,-80.1918"
- **Statistics**: "Statistics", "Give me statistics"
- **Exit**: "Exit", "Quit", "Bye" - Exit the chatbot

### Supported Cities

- Miami, Florida
- New York City, New York
- Los Angeles, California
- Boston, Massachusetts
- Seattle, Washington

### Example Queries

1. **Get started**:
   ```
   You: Hi
   ```

2. **City-based query**:
   ```
   You: Show me SST data for Miami
   ```

3. **Coordinate-based query**:
   ```
   You: What is the ocean data at 25.7617,-80.1918
   ```

4. **Statistics request**:
   ```
   You: Give me statistics
   ```

5. **Help request**:
   ```
   You: Help
   ```

## Data Sources

The chatbot can load data from:
1. **Existing data files**: Looks for `dummy_ocean_data.parquet` in parent directories
2. **Sample data generation**: Creates realistic oceanographic data if no file is found

## Data Measurements

- **Sea Surface Temperature (SST)**: Ocean surface temperature in °C
- **Chlorophyll-a**: Concentration of chlorophyll-a in mg/m³
- **Geographic coordinates**: Latitude and longitude
- **Temporal data**: Year and month of measurements
- **Distance calculations**: Distance from query location in kilometers

## Technical Details

- **Language**: Python 3.6+
- **Dependencies**: pandas, numpy, geopy
- **Geocoding**: Uses Nominatim for city coordinate lookup
- **Distance calculation**: Uses geodesic distance for accuracy
- **Data format**: Pandas DataFrame for efficient data processing

## File Structure

```
chat bot/
├── simple_chatbot.py    # Main chatbot application
├── requirements.txt     # Python dependencies
└── README.md           # This documentation
```

## Error Handling

The chatbot includes comprehensive error handling for:
- Missing data files
- Invalid coordinates
- Network connectivity issues
- Geocoding failures
- Data processing errors

## Sample Output

```
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

Chatbot is ready! Type 'help' for commands or 'exit' to quit.

You: Show me data for Miami

Assistant:
Searching for Miami data...

Oceanographic Data near Miami, 25.7617, -80.1918:

Location 1:
   Coordinates: (25.7617, -80.1918)
   Date: 2023-08
   SST: 28.5°C
   Chlorophyll-a: 0.23 mg/m³
   Distance: 0.00 km

Location 2:
   Coordinates: (25.7743, -80.1937)
   Date: 2023-08
   SST: 28.7°C
   Chlorophyll-a: 0.25 mg/m³
   Distance: 1.45 km
```

## Contributing

To extend the chatbot:
1. Add new data sources in the `load_data()` method
2. Extend query processing in the `process_query()` method
3. Add new response handlers for specific query types
4. Enhance the data visualization capabilities

## License

This project is open source and available under the MIT License.
