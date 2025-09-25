from flask import Flask, request, jsonify
from flask_cors import CORS
from simple_chatbot import OceanographicChatbot
import threading

app = Flask(__name__)
CORS(app)
chatbot = OceanographicChatbot()

# Load chatbot data immediately (not in background thread to avoid issues)
chatbot.load_data()

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message', '')
    if not user_input:
        return jsonify({'error': 'No message provided'}), 400

    response = chatbot.process_query(user_input)
    return jsonify({'response': response})

@app.route('/')
def index():
    return """
    <html>
    <head><title>Oceanographic Chatbot</title></head>
    <body>
        <h1>Oceanographic Chatbot</h1>
        <form id="chat-form">
            <input type="text" id="user-input" placeholder="Ask a question..." size="50"/>
            <button type="submit">Send</button>
        </form>
        <div id="chat-log"></div>
        <script>
            const form = document.getElementById('chat-form');
            const input = document.getElementById('user-input');
            const chatLog = document.getElementById('chat-log');

            form.onsubmit = async (e) => {
                e.preventDefault();
                const message = input.value;
                if (!message) return;
                chatLog.innerHTML += `<div><b>You:</b> ${message}</div>`;
                input.value = '';
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({message})
                });
                const data = await response.json();
                chatLog.innerHTML += `<div><b>Bot:</b> ${data.response}</div>`;
                chatLog.scrollTop = chatLog.scrollHeight;
            };
        </script>
    </body>
    </html>
    """

if __name__ == '__main__':
    try:
        print("[CHATBOT] Starting Chatbot API on port 5001")
        app.run(host="0.0.0.0", port=5001, debug=True, use_reloader=False)
    except KeyboardInterrupt:
        print("\n[INFO] Chatbot API stopped by user")
        sys.exit(0)
    except Exception as e:
        print(f"[ERROR] Error starting Chatbot API: {e}")
        sys.exit(1)
