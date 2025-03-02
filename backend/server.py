from flask import Flask, request, jsonify, send_file
import sqlite3
import base64
import os
import shutil
from groq import Groq
from crewai import Agent, Task, Crew

# with open('groq_api', 'r') as f:
#     _api_key_ = f.read().strip()

# client = Groq(
#     api_key = _api_key_
# )

client = Groq(
    api_key = os.environ.get("GROQ_API_KEY")
)


agent1 = Agent(
    role="Narrator",
    goal="You are a life game simulator, you will give me different choices in different status of my life, and will generate me new status and new choice. Initial status will be given at the beginning.",
    memory=True,
    backstory="An expert AI researcher specializing in structured data analysis.",
    llm=lambda prompt: query_groq("llama3-8b", prompt)  # Using Groq's LLaMA-3 8B model
)

agent2 = Agent(
    role="Predictor",
    goal="You will be given a description of the life story of a person and their decisions, you need to estimate the possibility of their death. The possibility of their death should increase as time goes by.",
    memory=True,
    backstory="A professional AI writer skilled in summarizing complex content.",
    llm=lambda prompt: query_groq("mixtral-8x7b", prompt)  # Using Groq's Mixtral model
)


app = Flask(__name__)
media_path = "./deepseek_media"
from flask_cors import CORS
CORS(app)

@app.route("/chat", methods=["POST"])
def chat():
    # Get JSON data from the request
    data = request.get_json()
    user_input = data.get("user_input")
    
    # Return an error if no input is provided
    if not user_input:
        return jsonify({"error": "No user input provided"}), 400

    # Send the user input to the llama model
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content":"",
            },
            {
                "role": "user",
                "content": user_input,
            }
        ],
        model="llama-3.3-70b-versatile",
    )
    
    # Return the response from the model as JSON
    assistant_response = chat_completion.choices[0].message.content
    return jsonify({"response": assistant_response})

@app.route("/generate_question", methods=["POST"])
def generate_question():
    data = request.get_json()
    context = data.get("context", "")
    system_prompt = data.get("sys_pmt", "")
    # Construct a prompt for the question-generating robot
    prompt = f"Based on the following context, generate an engaging and clear question:\nContext: {context}"
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                "role": "system",
                "content":"",
                },
                {"role": "user", "content": prompt}
                ],
            model="llama-3.3-70b-versatile",  # Change to the appropriate model if needed
        )
        question = chat_completion.choices[0].message.content.strip()
        print(f"Generated question: {question}")  # For debugging/logging
        return jsonify({"question": question})
    except Exception as e:
        print(f"Error generating question: {str(e)}")
        return jsonify({"error": "Failed to generate question"}), 500
    

    

@app.route("/generate_choices", methods=["POST"])
def generate_choices():
    data = request.get_json()
    question = data.get("question")
    context = data.get("context", "")
    system_prompt = data.get("sys_pmt", "")
    if not question:
        return jsonify({"error": "No question provided"}), 400

    # Construct a prompt for the choices-generating robot.
    # The prompt asks for 4 distinct answer choices.
    prompt = (
        f"Generate 4 distinct answer choices for the following question:\n"
        f"Question: '{question}'\n"
        f"Context: {context}\n"
        "Please list each answer on a new line."
    )
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                "role": "system",
                "content":"",
                },
                {"role": "user", "content": prompt}
                ],
            model="llama-3.3-70b-versatile",
        )
        response_text = chat_completion.choices[0].message.content.strip()
        print(f"Generated choices raw response: {response_text}")  # Debug output

        # Process the returned text to extract individual choices.
        lines = response_text.split("\n")
        choices = []
        for line in lines:
            line = line.strip()
            # Remove any numbering or bullet formatting if present
            if line and (line[0].isdigit() or line.startswith("-")):
                if "." in line:
                    line = line.split(".", 1)[-1].strip()
                elif "-" in line:
                    line = line.split("-", 1)[-1].strip()
            if line:
                choices.append(line)
        # Fallback: if not enough choices, try splitting by comma.
        if len(choices) < 4:
            choices = [choice.strip() for choice in response_text.split(",") if choice.strip()]
        return jsonify({"choices": choices[:4]})
    except Exception as e:
        print(f"Error generating choices: {str(e)}")
        return jsonify({"error": "Failed to generate choices"}), 500




def delete_folder(folder_path):
    if os.path.exists(folder_path) and os.path.isdir(folder_path):
        shutil.rmtree(folder_path)
        print(f"Deleted folder: {folder_path}")

def init_db():
    conn = sqlite3.connect("chat.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS chat_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_name TEXT NOT NULL,
            user_id TEXT NOT NULL,  -- Can be a UUID if needed
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    # choices are array in json
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS chat_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id INTEGER NOT NULL,
            question TEXT NOT NULL,
            choices TEXT NOT NULL,  
            selection INTEGER,
            image_base64 TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES chat_sessions(id)
        )
    """)
    conn.commit()
    conn.close()
    os.makedirs(media_path, exist_ok = True)
init_db()

@app.route("/")
def index():
    return render_template("index.html")  # Serve the HTML page

import uuid

@app.route("/create_session", methods = ["post"])
def create_session():
    data = request.json
    session_name = data.get("session_name")
    user_id = data.get("user_id", str(uuid.uuid4()))

    conn = sqlite3.connect("chat.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO chat_sessions (session_name, user_id) VALUES (?, ?)", (session_name, user_id))
    conn.commit()
    session_id = cursor.lastrowid
    conn.close()
    folder_path = os.path.join(media_path, str(session_id))
    os.makedirs(folder_path, exist_ok=True)
    return jsonify({"session_id": session_id, "user_id": user_id})

@app.route("/get_session", methods=["GET"])
def get_sessions():
    conn = sqlite3.connect("chat.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, session_name FROM chat_sessions ORDER BY id DESC")
    sessions = [{"session_id": row[0], "session_name": row[1]} for row in cursor.fetchall()]
    conn.close()
    return jsonify(sessions)

@app.route("/delete_session", methods=["POST"])
def delete_sessions():
    conn = sqlite3.connect("chat.db")
    data = request.json
    session_id = data.get("session_id")
    if not session_id:
        return jsonify()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM chat_history where session_id = ? ", (session_id,))

        cursor.execute("DELETE FROM chat_sessions where id = ?", (session_id,))
        conn.commit()
        folder_path = os.path.join(media_path, str(session_id))
        delete_folder(folder_path)
        return jsonify({"message": f"Session {session_id} deleted successfully!"})
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


import json
# Save chat message
@app.route("/save_chat", methods=["POST"])
def save_chat():
    data = request.json
    session_id = data.get("session_id")
    question = data.get("question")
    choices = json.dumps(data.get("choices"))
    selection = data.get("selection")
    images = data.get("images", "")
    print(images)

    conn = sqlite3.connect("chat.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO chat_history (session_id, question, choices, selection, image_base64) VALUES (?, ?, ?, ?, ?)",
                   (session_id, question, choices, selection, images))
    conn.commit()
    conn.close()
    print(images)
    return jsonify({"message": "Chat saved!"})

# Load last 10 messages
@app.route("/load_chat/<int:session_id>", methods=["GET"])
def load_chat(session_id):
    conn = sqlite3.connect("chat.db")
    cursor = conn.cursor()
    cursor.execute("SELECT question, choices, selection, image_base64 FROM chat_history WHERE session_id = ? ORDER BY id ASC LIMIT 10", (session_id,))
    chat_data = cursor.fetchall()
    
    history = []
    for row in chat_data:
        history.append({"question": row[0], "choices": row[1], "selection": row[2]})       # User message
    # if history:
    #     session_name = history[0]["content"][:20]  # Trim to 20 characters
    #     cursor.execute("UPDATE chat_sessions SET session_name = ? WHERE session_id = ?", (session_name, session_id))
    conn.close()
    return jsonify(history[::-1])
  



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)



    ## to do list
# 