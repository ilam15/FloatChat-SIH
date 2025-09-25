import streamlit as st
from chat.bot.oceanographic_chatbot_fixed import OceanographicChatbot

st.set_page_config(page_title="Oceanographic Chatbot", page_icon="🌊")

st.title("🌊 Oceanographic Data Chatbot")

if "chatbot" not in st.session_state:
    st.session_state.chatbot = OceanographicChatbot()
    st.session_state.chatbot.load_data()

if "chat_history" not in st.session_state:
    st.session_state.chat_history = []

def submit():
    user_input = st.session_state.user_input.strip()
    if user_input:
        st.session_state.chat_history.append({"role": "user", "content": user_input})
        response = st.session_state.chatbot.process_query(user_input)
        st.session_state.chat_history.append({"role": "bot", "content": response})
        st.session_state.user_input = ""

st.text_input("Ask me about oceanographic data:", key="user_input", on_change=submit)

for chat in st.session_state.chat_history:
    if chat["role"] == "user":
        st.markdown(f"**You:** {chat['content']}")
    else:
        st.markdown(f"**Bot:** {chat['content']}")
