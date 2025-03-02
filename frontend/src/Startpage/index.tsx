import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface Choice {
  name: string;
  health: number;
  wealth: number;
  intelligence: number;
  description: string;
}

interface Session {
  id: number;
  sessionName: string;
  // add additional properties if needed
}

interface SessionsResponse {
  sessions: Session[];
}

export default function Startpage(): JSX.Element {
  const navigate = useNavigate();

  const [selectedDescription, setSelectedDescription] = useState<string>("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showSessions, setShowSessions] = useState<boolean>(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [choices, setChoices] = useState<Choice[]>([]);


  useEffect(() => {
    async function fetchChoices() {
      try {
        const response = await fetch("http://127.0.0.1:5000/init"); // Update with your API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch choices");
        }
        const data = await response.json();
        console.log(data)
        if (Array.isArray(data)) {
          setChoices(data); // Ensure the data is an array
        } else {
          console.error("Invalid data format:", data);
        }
      } catch (error) {
        console.error("Error fetching choices:", error);
      }
    }
    fetchChoices();
  }, []);

  const handleChoice = (choice: Choice): void => {
    setSelectedDescription(choice.description);
    navigate("/game", {
      state: {
        choice: choice.name,
        description: choice.description,
        health: choice.health,
        wealth: choice.wealth,
        intelligence: choice.intelligence
      }
    });
  };

  // Load sessions from flask sqlite
  const loadSessions = async (): Promise<void> => {
    try {
      const response = await fetch("/get_sessions");
      const data: SessionsResponse = await response.json();
      setSessions(data.sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  // Delete a session from the backend
  const deleteSession = async (sessionId: number): Promise<void> => {
    try {
      await fetch(`/delete_session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ session_id: sessionId }) // Pass sessionId in the request body
      });
      // Update the sessions list by filtering out the deleted one
      setSessions(sessions.filter((session) => session.id !== sessionId));
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  // Toggle session modal and load sessions
  const handleLoadGames = (): void => {
    setShowSessions(true);
    loadSessions();
  };


  
  // When a session is selected from the modal
  const handleSessionSelect = (session: Session): void => {
    setSelectedSession(session);
    setShowSessions(false);
  };

  // Start game using the selected session
  const handleStartWithSession = (): void => {
    if (selectedSession) {
      navigate("/game", { state: { session: selectedSession } });
    } else {
      alert("Please select a session first!");
    }
  };

  return (
    <div className="p-6 text-center">
      <title>Welcome to the Night City</title>
      <h1 className="text-2xl mb-4">Welcome to Night City</h1>
      <h2 className="text-2xl mb-4">Please choose your role</h2>

      <div className="button-container">
        {choices.map((choice, index) => (
          <button
            key={index}
            className="block w-full p-3 my-2 bg-blue-500 text-white rounded"
            onClick={() => handleChoice(choice)}
          >
            {choice.name}
          </button>
        ))}
      </div>

      <br />
      <br />


      {/* Load Games Button
      <button
        className="mt-4 p-3 bg-green-500 text-white rounded"
        onClick={handleLoadGames}
      >
        Load Games
      </button> */}

      {/* If a session is selected, display its info and a button to start the game */}
      {selectedSession && (
        <div className="mt-2">
          <p>Selected Session: {selectedSession.sessionName}</p>
          <button
            className="p-3 bg-blue-500 text-white rounded"
            onClick={handleStartWithSession}
          >
            Start Game with Selected Session
          </button>

        </div>
      )}



      {/* Session Modal */}
      {
        showSessions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded max-w-md w-full">
              <h3 className="text-xl mb-4">Select a Session</h3>
              {sessions.length > 0 ? (
                sessions.map((session) => (
                  <div key={session.id} className="flex justify-between items-center mb-2 border-b pb-2">
                    <button
                      className="text-blue-500"
                      onClick={() => handleSessionSelect(session)}
                    >
                      {session.sessionName}
                    </button>
                    <button
                      className="text-red-500 ml-2"
                      onClick={() => deleteSession(session.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <p>No sessions available.</p>
              )}
              <button
                className="mt-4 p-3 bg-gray-500 text-white rounded"
                onClick={() => setShowSessions(false)}
              >
                Close
              </button>
            </div>

          </div>
        )
      }
    </div >
  );
}