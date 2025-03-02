import { useNavigate } from "react-router-dom";
// import { useState } from "react";

export default function Startpage() {
    const navigate = useNavigate();

    const choices = [
        { name: "Nomad", health: 100, wealth: 20, intelligence: 60, description: "You wander the outskirts of Night City, forever on the move. You’ve cut ties with most urban life, sticking to open highways and desert roads. You’re independent, resourceful, and trust only a select few. Your speech is laconic, punctuated by wry observations and the occasional wisecrack. You’re not one for corporate politics or big-city drama; you’d rather rely on your own skills and the close-knit group of fellow nomads you call family. The rugged life taught you survival and skepticism. Your dialogue exudes a sense of freedom, self-reliance, and subtle defiance.." },
        { name: "Street Kid", health: 70, wealth: 30, intelligence: 40, description: "You grew up on the tough streets of Night City. You’re brash, streetwise, and fiercely loyal to your chosen family. You speak in casual, sometimes vulgar slang, never shying from cursing or blunt threats when necessary. Trust is hard-earned and easily broken in your world. You’ve survived by hustling, improvising, and reading people in seconds. Deep down, you crave respect but refuse to beg for it. Your dialogue reflects a gritty, raw view of Night City’s underbelly—bold, in-your-face, and unapologetic." },
        { name: "Corporate", health: 20, wealth: 60, intelligence: 70, description: "You are a high-ranking employee in a ruthless megacorporation, operating in the gritty world of Cyberpunk 2077. You speak with cold precision and calculated politeness. Every interaction is a potential corporate transaction or power play. You constantly seek to protect and advance the corporation’s interests—even at the expense of others. Your language is filled with corporate jargon, and you maintain a veneer of professionalism regardless of the moral implications. In short, you are the epitome of a loyal company operative, always mindful of public image, profit, and leverage." }
    ];

    const handleChoice = (choice) => {
        setSelectedDescription(choice.description); 
        navigate("/game", { state: { choice: choice.name, description: choice.description, health: choice.health, wealth: choice.wealth, intelligence: choice.intelligence } });
    };
    // const [selectedDescription, setSelectedDescription] = useState("");

    // const choices = [
    //     { name: "Nomad", description: "Drifter from the Badlands, resourceful and independent." },
    //     { name: "Street Kid", description: "Grew up in Night City's streets, connected to gangs and fixers." },
    //     { name: "Corporate", description: "High-ranking agent in the ruthless corporate world." }
    // ];

    // const handleChoice = (choice) => {
    //     setSelectedDescription(choice.description); 
    //     navigate("/game", { state: { choice: choice.name, description: choice.description } });
    // };
    

    return (
        <div className="p-6 text-center">
            <title>Welcome to lAIfe</title>
            <h1 className="text-2xl mb-4">Welcome to lAIfe</h1>
            <button
                className="block w-full p-3 my-2 bg-blue-500 text-white rounded"
                onClick={() => navigate("/init")}
            >
                Start
            </button>
        </div>
    );
}
