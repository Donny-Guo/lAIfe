import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Gamepage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [step, setStep] = useState(0); 
    const [question, setQuestion] = useState<string | null>("I am at the age of 0-3yrs old.");
    // const [question, setQuestion] = useState<string | null>(location.state?.description || "Welcome to your journey!");
    const [choices, setChoices] = useState<string[]>(["Start"]);
    const [history, setHistory] = useState<string[]>(location.state?.description ? [location.state?.description] : []);
    // const [history, setHistory] = useState<string[]>(location.state?.choice ? [location.state.choice] : []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (step > 0) {
            const fetchQuestionAndChoices = async () => {
                setLoading(true);
                setError(null);
                try {
                    const context = history.join(" ") || "";
                    console.log(context)
                    const questionResponse = await fetch("http://127.0.0.1:5000/generate_question", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ sys_pmt: sys_pmt+"\n"+base_sys_pmt, context }),
                    });
                    if (!questionResponse.ok) throw new Error("Failed to load question.");
                    const questionData = await questionResponse.json();
                    setQuestion(questionData.question);

                    const choicesResponse = await fetch("http://127.0.0.1:5000/generate_choices", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ question: questionData.question, context, sys_pmt: sys_pmt+"\n"+base_sys_pmt, }),
                    });
                    if (!choicesResponse.ok) throw new Error("Failed to load choices.");
                    const choicesData = await choicesResponse.json();
                    // const saveResponse = await fetch("http://127.0.0.1:5000/save_chat", {
                    //     method: "Post",
                    //     headers: {"Content-Type": "application/json"},
                    //     body: JSON.stringify({question: questionData.question, choices: choicesData.choices})
                    // })
                    setChoices(choicesData.choices);
                } catch (err) {
                    setError("Could not load question. Please try again.");
                } finally {
                    setLoading(false);
                }
            };

            fetchQuestionAndChoices();
        }
    }, [step]);

    useEffect(() => {
        if (error) navigate("/end", { state: { history } });
    }, [error, navigate, history]);

    const handleChoice = async (choice: string, index: number) => {

        if (step === 0) {
            setStep(1);
        } else {
            const choiceData = {
                question: question,
                selection: index, // Store selected choice index (1-based)
                // option_choice: choice,  // Store selected choice text
                choices: choices // Store all choices
            };
            // const saveResponse = await fetch("http://127.0.0.1:5000/save_chat", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(choiceData),
            // }); 
            // if (!saveResponse.ok) throw new Error("Failed to save.");

            setHistory(prevHistory => [...prevHistory, choice]); // Store choice index (1-based)
            setStep(prevStep => prevStep + 1);
        }
    };

    return (
        <div className="p-6 flex flex-col justify-center items-center h-screen">
            {loading ? (
                <p className="text-xl font-semibold">Loading...</p>
            ) : error ? (
                <p className="text-xl text-red-500">{error}</p>
            ) : (
                <>
                    <h1 className="text-2xl font-semibold mb-6">{question}</h1>
                    {choices.map((choice, index) => (
                        <button
                            key={index}
                            className="w-64 p-3 my-2 bg-green-500 text-white rounded text-lg"
                            onClick={() => handleChoice(choice, index)}
                        >
                            {index}. {choice}
                        </button>
                    ))}
                </>
            )}
        </div>
    );
}
