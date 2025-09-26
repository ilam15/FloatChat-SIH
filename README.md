# FloatChat-SIH

## Overview

FloatChat-SIH is an innovative web application developed for the Smart India Hackathon (SIH), designed to revolutionize the way users interact with oceanographic data. By integrating AI-powered chatbots, interactive maps, and advanced analytics, the platform enables intuitive querying, visualization, and analysis of marine environmental data, supporting informed decision-making for researchers, policymakers, and maritime industries.

## Problem Statement

Accessing and analyzing vast oceanographic datasets (e.g., sea surface temperature, buoy data) is often cumbersome, requiring specialized tools and expertise. Traditional methods lack real-time interactivity and AI-driven insights, hindering timely responses to marine challenges like climate change, pollution, and navigation safety.

## Solution

FloatChat-SIH addresses this by providing a user-friendly interface that combines:
- **AI Chatbot**: Powered by Retrieval-Augmented Generation (RAG) for natural language queries on ocean data.
- **Interactive Maps**: Real-time visualization of buoy locations and environmental metrics using Leaflet.
- **Analytics Dashboard**: Filtering and charting capabilities for data-driven insights.
- **Authentication**: Secure user access and session management.

The backend leverages ChromaDB for vector storage, sentence transformers for embeddings, and Flask for API services, ensuring scalable and efficient data processing.

## Features

- **AI-Powered Chatbot**: Query oceanographic data in natural language, with responses grounded in real datasets.
- **Map Visualization**: Interactive maps displaying buoy data, SST, and other metrics.
- **Analytics & Filtering**: Custom filters and charts for data exploration using Recharts.
- **User Authentication**: Secure login and role-based access.
- **Data Pipeline**: ETL processes for bronze, silver, and gold data layers, integrating NetCDF and Parquet files.
- **Multi-Service Architecture**: Frontend (React) and backend (Flask, Streamlit) running concurrently.

## Tech Stack

### Frontend
- React 19.1.1
- React Router DOM
- Leaflet & React-Leaflet for maps
- TailwindCSS for styling
- Framer Motion for animations
- Recharts for data visualization

### Backend
- Flask for API services
- ChromaDB for vector database
- Sentence Transformers for embeddings
- Pandas, NumPy for data processing
- NetCDF4 for ocean data handling
- Streamlit for dashboards

### Data Engineering
- ETL pipelines with bronze/silver/gold layers
- PostgreSQL integration
- Parquet and CSV data formats

## Installation

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- Git

### Clone the Repository
```bash
git clone <repository-url>
cd FloatChat-SIH
```

### Frontend Setup
```bash
cd FloatChat
npm install
npm start
```
This starts the React app on `http://localhost:3000`.

### Backend Setup
1. Install Python dependencies:
   ```bash
   cd RAG\ PIPELINE/chat\ bot
   pip install -r requirements.txt
   ```

2. Run individual services or use the batch script:
   ```bash
   # From root directory
   run_all.bat
   ```
   This launches:
   - Chatbot API (`app.py`)
   - Analytical GenAI API (`AnalyticalGenAI/app.py`)
   - Streamlit Dashboard (`run.py`)
   - React Frontend

## Usage

1. Ensure all services are running via `run_all.bat`.
2. Access the application at `http://localhost:3000`.
3. Log in using the authentication system.
4. Navigate to the Chatbot for AI queries, Map View for visualizations, or Analytics for data insights.
5. Interact with the chatbot by typing queries like "What is the SST at buoy X?".

## Project Structure

```
FloatChat-SIH/
├── FloatChat/                 # React Frontend
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── assets/            # Data files (buoys.json, etc.)
│   │   └── App.js             # Main app component
│   └── package.json
├── RAG PIPELINE/              # Backend and Data Pipeline
│   ├── chat bot/              # Flask chatbot service
│   ├── AnalyticalGenAI/       # GenAI analytics service
│   ├── DataEngineering/       # ETL scripts and notebooks
│   ├── chroma_db/             # Vector database
│   └── streamlit_app.py       # Streamlit dashboard
├── run_all.bat                # Batch script to run all services
└── README.md                  # This file
```

## Team

- **Ilamsaravanbalaji Pa.**: Project Lead, Frontend Integration
- **Jaianish J.**: Chatbot Development
- **Swetha B.**: Authentication and Backend
- **Sharan Adithiya K.**: Analytics and Data Filtering

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit changes (`git commit -m 'Add AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Smart India Hackathon for the opportunity.
- Open-source libraries: React, Flask, ChromaDB, etc.
- Data sources: Oceanographic datasets (NetCDF, buoy data).
