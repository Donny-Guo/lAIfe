import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Startpage() {
    const navigate = useNavigate();
    
    const [selectedDescription, setSelectedDescription] = useState("");

    const choices = [
        { name: "Nomad", description: "Drifter from the Badlands, resourceful and independent." },
        { name: "Street Kid", description: "Grew up in Night City's streets, connected to gangs and fixers." },
        { name: "Corporate", description: "High-ranking agent in the ruthless corporate world." }
    ];

    const handleChoice = (choice) => {
        setSelectedDescription(choice.description); 
        navigate("/game", { state: { choice: choice.name, description: choice.description } });
    };

    return (
        <div className="p-6 text-center">
            <title>Welcome to the Night City</title>
            <h1 className="text-2xl mb-4">Welcome to Night City</h1>
            <h2 className="text-2xl mb-4">Please choose your role</h2>
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
    );
}
