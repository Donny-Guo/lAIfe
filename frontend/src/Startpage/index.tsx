import { useNavigate } from "react-router-dom";

export default function Startpage() {
    const navigate = useNavigate();

    const choices = ["Nomad", "Street Kid", "Corporate"];

    return (
        <div className="p-6 text-center">
            <h1 className="text-2xl mb-4">Welcome to Night City</h1>
            <h2 className="text-2xl mb-4">Please choose your role</h2>
            {choices.map((choice, index) => (
                <button
                    key={index}
                    className="block w-full p-3 my-2 bg-blue-500 text-white rounded"
                    onClick={() => navigate("/game", { state: { choice } })}
                >
                    {choice}
                </button>
            ))}
        </div>
    );

}