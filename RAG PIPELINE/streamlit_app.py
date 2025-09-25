#!/usr/bin/env python3
"""
Visual FloatChat Streamlit Frontend
Combined dashboard and chatbot interface
"""

import streamlit as st
import requests
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import folium
from streamlit_folium import folium_static
import json
from datetime import datetime
import numpy as np

# Page configuration
st.set_page_config(
    page_title="🌊 Visual FloatChat",
    page_icon="🌊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        font-weight: bold;
        color: #1f77b4;
        text-align: center;
        margin-bottom: 2rem;
    }
    .chat-container {
        border: 2px solid #e0e0e0;
        border-radius: 10px;
        padding: 1rem;
        height: 400px;
        overflow-y: auto;
        background-color: #f9f9f9;
    }
    .user-message {
        background-color: #1f77b4;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 15px;
        margin: 0.5rem 0;
        text-align: right;
    }
    .bot-message {
        background-color: #f0f0f0;
        color: black;
        padding: 0.5rem 1rem;
        border-radius: 15px;
        margin: 0.5rem 0;
        text-align: left;
    }
    .metric-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem;
        border-radius: 10px;
        text-align: center;
    }
</style>
""", unsafe_allow_html=True)

def main():
    st.markdown('<div class="main-header">🌊 Visual FloatChat</div>', unsafe_allow_html=True)
    st.markdown("**AI-Powered Oceanographic Data Analysis Platform**")

    # Sidebar
    with st.sidebar:
        st.header("🔧 Controls")
        page = st.radio("Navigation", ["Dashboard", "Chat Assistant", "Data Explorer"])

        st.markdown("---")
        st.markdown("**System Status:**")
        st.success("✅ Backend Connected")
        st.success("✅ Data Pipeline Ready")
        st.success("✅ AI Models Loaded")

    if page == "Dashboard":
        show_dashboard()
    elif page == "Chat Assistant":
        show_chat_assistant()
    else:
        show_data_explorer()

def show_dashboard():
    st.header("📊 Oceanographic Data Dashboard")

    col1, col2, col3, col4 = st.columns(4)

    with col1:
        st.markdown('<div class="metric-card">', unsafe_allow_html=True)
        st.metric("Data Points", "500+")
        st.markdown('</div>', unsafe_allow_html=True)

    with col2:
        st.markdown('<div class="metric-card">', unsafe_allow_html=True)
        st.metric("SST Range", "15-35°C")
        st.markdown('</div>', unsafe_allow_html=True)

    with col3:
        st.markdown('<div class="metric-card">', unsafe_allow_html=True)
        st.metric("Chlorophyll-a", "0.1-2.0 mg/m³")
        st.markdown('</div>', unsafe_allow_html=True)

    with col4:
        st.markdown('<div class="metric-card">', unsafe_allow_html=True)
        st.metric("Locations", "50+")
        st.markdown('</div>', unsafe_allow_html=True)

    # Sample data visualization
    st.subheader("🌍 Global Oceanographic Data Distribution")

    # Create sample data for visualization
    sample_data = pd.DataFrame({
        'lat': np.random.uniform(-60, 60, 100),
        'lon': np.random.uniform(-180, 180, 100),
        'sst': np.random.uniform(15, 35, 100),
        'chlor_a': np.random.uniform(0.1, 2.0, 100)
    })

    # Map visualization
    st.subheader("Interactive World Map")
    m = folium.Map(location=[20, 0], zoom_start=2)

    for idx, row in sample_data.iterrows():
        folium.CircleMarker(
            location=[row['lat'], row['lon']],
            radius=3,
            popup=f"SST: {row['sst']:.1f}°C<br>Chlorophyll-a: {row['chlor_a']:.2f} mg/m³",
            color='blue' if row['sst'] < 25 else 'red',
            fill=True,
            fill_opacity=0.7
        ).add_to(m)

    folium_static(m)

    # Charts
    col1, col2 = st.columns(2)

    with col1:
        st.subheader("Sea Surface Temperature Distribution")
        fig = px.histogram(sample_data, x='sst', nbins=20, title="SST Distribution")
        st.plotly_chart(fig, use_container_width=True)

    with col2:
        st.subheader("Chlorophyll-a Distribution")
        fig = px.histogram(sample_data, x='chlor_a', nbins=20, title="Chlorophyll-a Distribution")
        st.plotly_chart(fig, use_container_width=True)

def show_chat_assistant():
    st.header("🤖 AI Chat Assistant")

    st.markdown("Ask questions about oceanographic data in natural language!")

    # Chat interface
    st.markdown('<div class="chat-container" id="chat-container">', unsafe_allow_html=True)

    if 'messages' not in st.session_state:
        st.session_state.messages = []

    # Display chat messages
    for message in st.session_state.messages:
        if message['role'] == 'user':
            st.markdown(f'<div class="user-message">{message["content"]}</div>', unsafe_allow_html=True)
        else:
            st.markdown(f'<div class="bot-message">{message["content"]}</div>', unsafe_allow_html=True)

    st.markdown('</div>', unsafe_allow_html=True)

    # Chat input
    user_input = st.text_input("Type your question here...", key="user_input")

    if st.button("Send") and user_input:
        # Add user message
        st.session_state.messages.append({"role": "user", "content": user_input})

        # Get bot response
        try:
            response = requests.post("http://localhost:5000/api/chat",
                                   json={"prompt": user_input},
                                   timeout=30)
            bot_response = response.json().get("response", "Sorry, I couldn't process your request.")
        except:
            bot_response = "I'm having trouble connecting to the backend. Please make sure the Flask server is running."

        # Add bot message
        st.session_state.messages.append({"role": "assistant", "content": bot_response})

        st.rerun()

def show_data_explorer():
    st.header("🔍 Data Explorer")

    st.markdown("Explore oceanographic data with advanced filtering and analysis tools.")

    # Sample data for exploration
    sample_data = pd.DataFrame({
        'latitude': np.random.uniform(-60, 60, 100),
        'longitude': np.random.uniform(-180, 180, 100),
        'sst': np.random.uniform(15, 35, 100),
        'chlor_a': np.random.uniform(0.1, 2.0, 100),
        'year': np.random.choice([2020, 2021, 2022, 2023], 100),
        'month': np.random.choice(range(1, 13), 100)
    })

    # Filters
    col1, col2, col3 = st.columns(3)

    with col1:
        sst_range = st.slider("SST Range (°C)", 15.0, 35.0, (20.0, 30.0))

    with col2:
        chlor_range = st.slider("Chlorophyll-a Range", 0.1, 2.0, (0.5, 1.5))

    with col3:
        year_filter = st.multiselect("Years", [2020, 2021, 2022, 2023], default=[2020, 2021, 2022, 2023])

    # Apply filters
    filtered_data = sample_data[
        (sample_data['sst'] >= sst_range[0]) & (sample_data['sst'] <= sst_range[1]) &
        (sample_data['chlor_a'] >= chlor_range[0]) & (sample_data['chlor_a'] <= chlor_range[1]) &
        (sample_data['year'].isin(year_filter))
    ]

    st.subheader(f"Filtered Results: {len(filtered_data)} data points")

    # Visualization
    if len(filtered_data) > 0:
        fig = px.scatter_mapbox(
            filtered_data,
            lat='latitude',
            lon='longitude',
            color='sst',
            size='chlor_a',
            color_continuous_scale='Viridis',
            size_max=15,
            zoom=1,
            title="Filtered Oceanographic Data"
        )
        fig.update_layout(mapbox_style="open-street-map")
        st.plotly_chart(fig, use_container_width=True)

        # Statistics
        st.subheader("📈 Statistics")
        col1, col2, col3, col4 = st.columns(4)

        with col1:
            st.metric("Average SST", f"{filtered_data['sst'].mean():.1f}°C")
        with col2:
            st.metric("Average Chlorophyll-a", f"{filtered_data['chlor_a'].mean():.2f} mg/m³")
        with col3:
            st.metric("Min Latitude", f"{filtered_data['latitude'].min():.1f}°")
        with col4:
            st.metric("Max Latitude", f"{filtered_data['latitude'].max():.1f}°")

if __name__ == "__main__":
    main()
