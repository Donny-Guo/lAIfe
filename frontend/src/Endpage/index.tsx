import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Endpage() {
    const location = useLocation();
    const navigate = useNavigate();

    // Retrieve game stats from state
    const history = location.state?.history || [];
    const health = location.state?.health || 0;
    const wealth = location.state?.wealth || 0;
    const intelligence = location.state?.intelligence || 0;

    // State to store the image URL from the backend
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await fetch("http://10.0.0.182:5000/generate_summary_image", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ history, health, wealth, intelligence }),
                });

                if (!response.ok) throw new Error("Failed to load image.");

                const imageBlob = await response.blob();  // Convert response to blob
                const imageObjectURL = URL.createObjectURL(imageBlob); // Create a URL for blob
                setImageUrl(imageObjectURL);
            } catch (err) {

                console.log("img not shown, but everything is fine!");
                /* setError("Could not load image. Please try again."); */
            }
        };

        fetchImage();
    }, [history, health, wealth, intelligence]);

    return (
        <div
            className="flex flex-col justify-center items-center h-screen text-white"
            style={{
                backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "100vw",
                height: "100vh"
            }}
        >

            <title>Your Life Story</title>

            {error ? (
                <p className="text-xl text-red-500">{error}</p>
            ) : (
                <>
                    <h1 className="text-3xl font-bold mb-6 bg-black bg-opacity-50 p-4 rounded-lg">
                        Your Life Story
                    </h1>
                    <button
                        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg text-lg"
                        onClick={() => navigate("/")}
                    >
                        Play Again
                    </button>
                </>
            )}
        </div>
    );
}
