from flask import Flask, request, jsonify, send_file
import sqlite3
import os
import shutil
import numpy as np
from groq import Groq
# from crewai import Agent, Task, Crew

# with open('groq_api', 'r') as f:
#     _api_key_ = f.read().strip()

# client = Groq(
#     api_key = _api_key_
# )

client = Groq(
    api_key = os.environ.get("GROQ_API_KEY")
)


# agent1 = Agent(
#     role="Narrator",
#     goal="You are a life game simulator, you will give me different choices in different status of my life, and will generate me new status and new choice. Initial status will be given at the beginning.",
#     memory=True,
#     backstory="An expert AI researcher specializing in structured data analysis.",
#     llm=lambda prompt: query_groq("llama3-8b", prompt)  # Using Groq's LLaMA-3 8B model
# )

# agent2 = Agent(
#     role="Predictor",
#     goal="You will be given a description of the life story of a person and their decisions, you need to estimate the possibility of their death. The possibility of their death should increase as time goes by.",
#     memory=True,
#     backstory="A professional AI writer skilled in summarizing complex content.",
#     llm=lambda prompt: query_groq("mixtral-8x7b", prompt)  # Using Groq's Mixtral model
# )


app = Flask(__name__)
media_path = "./deepseek_media"
from flask_cors import CORS
CORS(app)

# @app.route("/chat", methods=["POST"])
# def chat():
#     # Get JSON data from the request
#     data = request.get_json()
#     user_input = data.get("user_input")
    
#     # Return an error if no input is provided
#     if not user_input:
#         return jsonify({"error": "No user input provided"}), 400

#     # Send the user input to the llama model
#     chat_completion = client.chat.completions.create(
#         messages=[
#             {
#                 "role": "system",
#                 "content":"",
#             },
#             {
#                 "role": "user",
#                 "content": user_input,
#             }
#         ],
#         model="llama-3.3-70b-versatile",
#     )
    
#     # Return the response from the model as JSON
#     assistant_response = chat_completion.choices[0].message.content
#     return jsonify({"response": assistant_response})

@app.route("/generate_question", methods=["POST"])
def generate_question():
    data = request.get_json()
    context = data.get("context", "")
    # system_prompt = data.get("sys_pmt", "")
    curStage = data.get("curStage", "")
    curParameters = json.dumps(data.get("params",""))
    # Construct a prompt for the question-generating robot
    prompt = (
        f"current life stage: {curStage}\n"
        f"Context: {context}\n"
        f"params: {curParameters}\n"
        "Please list each answer on a new line."
    )

    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content":"""You are a playful life-simulator guide. Based on the user’s life experiences and the context provided, craft a concise, engaging question that reflects their 
                                current life stage and parameters. This question must incorporate:
                                A reference to at least one significant past experience or relationship from the user’s context (e.g., a childhood friend).
                                A large-scale, externally driven event that significantly affects the user’s life but isn’t directly caused by them (e.g., war).
                                For instance: ‘Your childhood best friend proposes marriage, but a war breaks out and threatens your community.’
                                Ensure the question encourages thoughtful consideration of how personal choices intersect with broader circumstances outside the user’s control.\n""",
                },
                {
                    "role": "user", 
                    "content": prompt
                }
            ],
            model="llama-3.3-70b-versatile",  # Change to the appropriate model if needed
        )
        question = chat_completion.choices[0].message.content.strip()
        # print(f"Generated question: {question}")  # For debugging/logging
        return jsonify({"question": question})
    except Exception as e:
        print(f"Error generating question: {str(e)}")
        return jsonify({"error": "Failed to generate question"}), 500

@app.route("/generate_choices", methods=["POST"])
def generate_choices():
    data = request.get_json()
    question = data.get("question")
    context = data.get("context", "")
    # system_prompt = data.get("sys_pmt", "")
    curStage = data.get("curStage", "")
    curParameters = json.dumps(data.get("params",""))
    if not question:
        return jsonify({"error": "No question provided"}), 400

    # Construct a prompt for the choices-generating robot.
    # The prompt asks for 4 distinct answer choices.
    prompt = (
        f"Current Life Stage: {curStage}\n"
        f"Context: {context}\n"
        f"Question: \"{question}\"\n"
        f"Parameters (Health, Wealth, Intelligence): {curParameters}\n"
        "Provide exactly four answer choices. Each choice should be on a new line, formatted as follows:\n"
        "[Choice Text] | Effects: [Health Effect], [Wealth Effect], [Intelligence Effect]\n"
        "Effect values should be integers between -2 and 2."
    )
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content":f"You are a playful life-simulator guide. Based on the user’s life context and question, generate exactly four life-changing choices for their current life stage. For each choice, include a potential effect value (ranging from -2 to 2) on the relevant parameters. Keep the tone imaginative and fun, but ensure the choices align with the context and parameters provided.:\n",
                },
                {
                    "role": "user", 
                    "content": prompt
                }
            ],
            model="llama-3.3-70b-versatile",
        )
        response_text = chat_completion.choices[0].message.content.strip()
        print(f"Generated choices raw response:\n{response_text}")  # Debug output

        # Extracting choices and effects
        choices = []
        effects = []

        for line in response_text.split("\n"):
            line = line.strip()
            if line and "|" in line:  
                try:
                    choice_text, effects_text = line.split("|")
                    choice_text = choice_text.strip()
                    effects_values = [int(x) for x in effects_text.replace("Effects:", "").strip().split(",")]

                    if len(effects_values) == 3:  
                        choices.append(choice_text)
                        effects.append(effects_values)
                except Exception as e:
                    print(f"Error parsing line: {line}, Error: {e}")

        # Ensure having exactly 4 valid choices
        if len(choices) < 4:
            return jsonify({"error": "Not enough valid choices generated", "raw_output": response_text}), 500

        return jsonify({"choices": choices[:4], "effects": effects[:4]})

    except Exception as e:
        print(f"Error generating choices: {str(e)}")
        return jsonify({"error": "Failed to generate choices"}), 500
    
@app.route("/generate_summary", methods=["POST"])
def generate_summary():
    data = request.get_json()
    history = data.get("history", [])
    wealth = data.get("wealth", 0)
    health = data.get("health", 0)
    intelligence = data.get("intelligence", 0)
    lifeStory = ', '.join(history)
    prompt = (
        f"Current Life Stage: {curStage}\n"
        f"Context: {context}\n"
        f"Question: \"{question}\"\n"
        f"Parameters (Health, Wealth, Intelligence): {curParameters}\n"
        "Provide exactly four answer choices. Each choice should be on a new line, formatted as follows:\n"
        "[Choice Text] | Effects: [Health Effect], [Wealth Effect], [Intelligence Effect]\n"
        "Effect values should be integers between -2 and 2."
    )

# initialize three parameters of the character and family background
@app.route("/init", methods=["GET"])
def init_status():
    try:
        health, money, wisdom = np.random.randint(low=1, high=21, size=3, dtype=int)
        bg_prompt = ("Generate 5 different family background (what is the family look like) for me"
                    "when a child is born in America. You need to include the following aspects: "
                    "Parental Resources and Wellbeing, Parental Health, Family Structure, Parental Education,"
                    "Parental Age, Socioeconomic Status, Cultural and Ethnic Background, Religious Background,"
                    "Extended Family, Home Environment, Parental Relationships. Describe each background in"
                    "an autobiographical manner in a few sentences and separated by a new line. No extra words needed.")
        while True:
            # ask llm to generate 5 distinct family background
            chat_completion = client.chat.completions.create(
                    messages=[{"role": "user", "content": bg_prompt}],
                    model="llama-3.3-70b-versatile",
                    timeout=20
                )
            response_text = chat_completion.choices[0].message.content.strip()
            if len(response_text) > 10:
                # print(f"response_text: {response_text}")
                break

        backgrounds = response_text.split("\n")
        while True:
            selected_background = backgrounds[np.random.randint(low=0, high=len(backgrounds), dtype=int)]
            if selected_background: break
        print(f"selected_background: {selected_background}")
        return jsonify({"selected_background": selected_background,
                        "health": int(health),
                        "money": int(money),
                        "wisdom": int(wisdom)})
    except Exception as e:
        # Log the error
        print(f"Error in /init: {str(e)}")
        # Return a proper error response
        return jsonify({"error": "Failed to generate data"}), 500

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
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            background TEXT,
            health INTEGER,
            wealth INTEGER,
            intelligence INTEGER,
            image_path TEXT
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

@app.route("/get_sessions", methods=["GET"])
def get_sessions():
    conn = sqlite3.connect("chat.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, session_name FROM chat_sessions ORDER BY id DESC")
    sessions = [{"session_id": row[0], "session_name": row[1]} for row in cursor.fetchall()]
    conn.close()
    return jsonify(sessions)

@app.route("/delete_session", methods=["POST"])
def delete_session():
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