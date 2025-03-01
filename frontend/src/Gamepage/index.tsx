import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Gamepage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [step, setStep] = useState(1);
    const [choices, setChoices] = useState<string[]>([]);
    const [history, setHistory] = useState<string[]>(location.state.choice ? [location.state.choice] : []);

    useEffect(() => {
        setChoices([
            `Choice A${step}`,
            `Choice B${step}`,
            `Choice C${step}`,
            `Choice D${step}`,
        ]);
    }, [step]);

    useEffect(() => {
        if (step > 5) {
            navigate("/end", { state: { history } });
        }
    }, [step, navigate, history]);

    const handleChoice = (choice: string) => {
        setHistory(prevHistory => [...prevHistory, choice]);
        setStep(prevStep => prevStep + 1);
    };

    return (
        <div className="p-6 text-center">
            <h1 className="text-xl mb-4">Step {step}</h1>
            {choices.map((choice, index) => (
                <button
                    key={index}
                    className="block w-full p-3 my-2 bg-green-500 text-white rounded"
                    onClick={() => handleChoice(choice)}
                >
                    {choice}
                </button>
            ))}
        </div>
    );
}