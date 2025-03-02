// import React, { useState, useEffect } from 'react';
// import { useNavigate } from "react-router-dom";

// interface DataItem {
//     health: number;
//     money: number;
//     wisdom: number;
//     selected_background: string;
// }

// const DataFetcher: React.FC = () => {
//     const navigate = useNavigate();

//     // Start with default values
//     const [data, setData] = useState<DataItem>({
//         health: 10,
//         money: 10,
//         wisdom: 10,
//         selected_background: "Loading background information...",
//     });
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         console.log("Component mounted, starting fetch");

//         const fetchData = async () => {
//             try {
//                 // Log before fetch
//                 console.log("Fetching data...");

//                 // Make the GET request
//                 const response = await fetch("http://127.0.0.1:5000/init", {
//                     method: "GET",
//                     headers: {
//                         "Accept": "application/json"
//                     }
//                 });

//                 // Log response status
//                 console.log("Response status:", response.status);

//                 // Check if the response is OK
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! Status: ${response.status}`);
//                 }

//                 // Parse JSON and log it
//                 const jsonData = await response.json();
//                 console.log("Received data:", jsonData);

//                 // Update state with response data
//                 setData(jsonData);
//                 console.log("Data state updated");

//                 // Clear any error state
//                 setError(null);
//             } catch (err) {
//                 // Handle errors
//                 console.error('Error fetching data:', err);
//                 setError(`Failed to fetch data: ${err.message}`);
//             } finally {
//                 // Always set loading to false when done
//                 setLoading(false);
//                 console.log("Loading set to false");
//             }
//         };

//         // Call the fetch function
//         fetchData();

//         // No cleanup needed for this simple case
//     }, []); // Empty dependency array for single execution

//     console.log("Current state:", { loading, error, dataReceived: !!data });

//     // Always render something, with clear loading and error states
//     return (
//         <div className="data-fetcher-container">
//             <h1>I am borned!</h1>

//             {/* Always show the loading state */}
//             {loading && <p>Loading data from server...</p>}

//             {/* Always show errors if they exist */}
//             {error && (
//                 <div className="error-message">
//                     <p>Error: {error}</p>
//                     <button onClick={() => window.location.reload()}>
//                         Try Again
//                     </button>
//                 </div>
//             )}

//             {!loading && !error && (
//                 <div className="data-list">
//                     <h2>My Family background:</h2>
//                     <p>{data.selected_background}</p>
//                     <h2>My three parameters:</h2>
//                     <ul>
//                         <p>Health: {data.health}</p>
//                         <p>money: {data.money}</p>
//                         <p>wisdom: {data.wisdom}</p>
//                     </ul>
//                     <button onClick={() => navigate("/game")}>
//                         Continue
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default DataFetcher;

import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

// Define a type for our data
interface DataItem {
    health: number;
    money: number;
    wisdom: number;
    selected_background: string;
}

const DataFetcher: React.FC = () => {
    const navigate = useNavigate();
    // State to store the fetched data
    const [data, setData] = useState<DataItem>({
        health: 10,
        money: 10,
        wisdom: 10,
        selected_background: `I was born to a big, loud, and loving family \
                            with parents who are both in their 40s, my mom is 
                            a stay-at-home mom and my dad is a successful businessman, 
                            they both have a master's degree and are in good health, 
                            we live in a big house in an affluent neighborhood, my parents 
                            are both from India and we practice Hinduism, we have a big 
                            extended family with lots of cousins, aunts, and uncles, my 
                            parents have a strong and supportive relationship, and they 
                            prioritize my education and wellbeing above all else, our home 
                            is always filled with the smell of traditional Indian food and 
                            the sound of laughter and music.`,
    });
    // State to track loading status
    const [loading, setLoading] = useState<boolean>(false);
    // State to handle any errors
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Function to fetch data
        const fetchData = async () => {
            try {
                setLoading(true);
                // Make the GET request using fetch
                const response = await fetch("http://127.0.0.1:5000/init", 
                                            {method: "GET",
                                            // Add a timeout for the fetch request
                                            signal: AbortSignal.timeout(20000)
                                            });

                // Check if the response is OK (status 200-299)
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                // Parse the JSON response
                const jsonData = await response.json();
                console.log(jsonData.selected_background);
                // Update state with the response data
                setData(jsonData);
                setError(null);
            } catch (err) {
                // Handle any errors
                setError('Failed to fetch data. Please try again later.');
                console.error('Error fetching data:', err);
            } finally {
                // Set loading to false regardless of outcome
                setLoading(false);
            }
        };

        // Call the fetch function
        fetchData();
    }, []); // Empty dependency array means this effect runs once on mount

    return (
        <div className="data-fetcher-container">
            <h1>I am borned!</h1>

            {loading && <p>Loading data...</p>}

            {error && <p className="error-message">{error}</p>}

            {!loading && !error && (
                <div className="data-list">
                    <h2>My Family background:</h2>
                    <p>{data.selected_background}</p>
                    <h2>My three parameters:</h2>
                    <ul>
                        <p>Health: {data.health}</p>
                        <p>money: {data.money}</p>
                        <p>wisdom: {data.wisdom}</p>
                    </ul>
                    <button onClick={() => navigate("/game", { state: { description: data.selected_background } })}>
                        Continue
                    </button>
                </div>
                
            )}
        </div>
    );
};

export default DataFetcher;
