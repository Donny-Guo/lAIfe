import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Gamepage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [step, setStep] = useState(0); 
    // let sys_pmt = location.state.description;
    // const base_sys_pmt = "there should be 3 stages in my life, finish story within these stages";
    const [question, setQuestion] = useState<string | null>(location.state?.description || "Welcome to your journey!");
    const [choices, setChoices] = useState<string[]>(["Start"]);
    const [history, setHistory] = useState<string[]>(location.state?.description ? [location.state.description] : []);
// <!--     const [question, setQuestion] = useState<string | null>("I am at the age of 0-3yrs old.");
//     // const [question, setQuestion] = useState<string | null>(location.state?.description || "Welcome to your journey!");
//     const [choices, setChoices] = useState<string[]>(["Start"]);
//     const [history, setHistory] = useState<string[]>(location.state?.description ? [location.state?.description] : []);
    // const [history, setHistory] = useState<string[]>(location.state?.choice ? [location.state.choice] : []); -->
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [health, setHealth] = useState<number>(location.state?.health || "33");
    const [wealth, setWealth] = useState<number>(location.state?.wealth || "33");
    const [paramsDiff, setParamsDiff] = useState<number[][]>([])  // array, value corresponding to [health, wealth, intelligence]
    const [intelligence, setIntelligence] = useState<number>(location.state?.intelligence || "33");
    const lifeStages = [
        "0 month - 3 yr",
        "3yr - 6yr",
        "6yr - 12yr: primary schooler",
        "12yr - 18yr: high schooler",
        "18yr - 22yr: College student",
        "22yr - 25 yr: Master/Doctoral student",
        "25yr - 35yr: child or not",
        "35yr - 50yr: parenthood",
        "50yr - 65yr: grandchild or not",
        "Young-old (65–74 years): Retirement",
        "Middle-old (75–84 years)",
        "Old-old (85+ years): death"
    ];
    

    useEffect(() => {
        if (step > 0) {
            let curStage = lifeStages[step - 1];
            const fetchQuestionAndChoices = async () => {
                setLoading(true);
                setError(null);
                try {
                    const context = history.join(" ") || "";
                    console.log(context)
                    const questionResponse = await fetch("http://127.0.0.1:5000/generate_question", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({  context, curStage, health, wealth, intelligence  }),
                    });
                    if (!questionResponse.ok) throw new Error("Failed to load question.");
                    const questionData = await questionResponse.json();
                    setQuestion(questionData.question);

                    const choicesResponse = await fetch("http://127.0.0.1:5000/generate_choices", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ question: questionData.question, context, curStage, health, wealth, intelligence }),
                    });
                    if (!choicesResponse.ok) throw new Error("Failed to load choices.");
                    const choicesData = await choicesResponse.json();
                    // const saveResponse = await fetch("http://127.0.0.1:5000/save_chat", {
                    //     method: "Post",
                    //     headers: {"Content-Type": "application/json"},
                    //     body: JSON.stringify({question: questionData.question, choices: choicesData.choices})
                    // })
                    setChoices(choicesData.choices);
                    setParamsDiff(choicesData.effects);
                    
                } catch (err) {
                    setError("Could not load question. Please try again.");
                } finally {
                    setLoading(false);
                }
            };

            fetchQuestionAndChoices();
        }
    }, [step]);

    // useEffect(() => {
    //     if (error) navigate("/end", { state: { history } });
    // }, [error, navigate, history]);
    useEffect(() => {
        if (step > lifeStages.length) {  
            navigate("/end", { state: { history, health, wealth, intelligence } });
            return;
        }
    }, [step, navigate, history, health, wealth, intelligence]);


    const handleChoice = async (choice: string, index: number) => {

        if (step === 0) {
            setStep(1);
        } else {
            const choiceData = {
                question: question,
                selection: index, // Store selected choice index 0-based
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
            setHealth(health => health + paramsDiff[index][0])
            setWealth(wealth => wealth + paramsDiff[index][1])
            setIntelligence(intelligence => intelligence + paramsDiff[index][2])
        }
    };

    return (
        <div className="p-6 flex flex-col justify-center items-center h-screen">
            <title>LAIfe in Progress</title>
            {loading ? (
                <p className="text-xl font-semibold">Loading...</p>
            ) : error ? (
                <p className="text-xl text-red-500">{error}</p>
            ) : (
                <>
                    <tbody className="text-red-500">
                        <tr>
                            <td>
                                ❤️ Health: {health}
                            </td>

                            <td>
                                💰 Wealth: {wealth}
                            </td>

                            <td>
                                🧠 Intelligence: {intelligence}
                            </td>
                        </tr>
                    </tbody>
                    {/* <p className="text-yellow-500">💰 Wealth: {wealth}</p>
                        <p className="text-blue-500">🧠 Intelligence: {intelligence}</p> */}

                    <p className="text-2xl font-semibold mb-6">{question}</p>

                    <div className="mb-6 flex gap-4 text-lg font-semibold">

                    </div>
                    <div className="button-container">
                        {choices.map((choice, index) => (
                            <button
                                key={index}
                                className="w-64 p-3 my-2 bg-green-500 text-white rounded text-lg"
                                onClick={() => handleChoice(choice, index)}
                            >
                                {index}. {choice}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
