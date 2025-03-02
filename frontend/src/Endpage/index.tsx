import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./endpage.css";

export default function Endpage() {
    const location = useLocation();
    const history = location.state.history;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [story, setStory] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchStory = async () => {
            setLoading(true);
            setError(null);
            try {
                const storyResponse = await fetch("http://127.0.0.1:5000/generate_story", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ history }),
                });

                if (!storyResponse.ok) throw new Error("Failed to load story.");

                const storyData = await storyResponse.json();

                setStory(storyData.story);
                setImageUrl(storyData.image_url);

            } catch (err) {
                setError("Could not load story. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchStory();
    }, [history]);

    return (
        <div className="endpage-container">
            <title>Your LAIfe Summary</title>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && (
                <div className="endpage-content">
                    {imageUrl && (
                        <div className="image-container">
                            <img src={imageUrl} alt="Generated Story Scene" className="story-image" />
                        </div>
                    )}


                    {story && (
                        <div className="story-container">
                            <h2>Your LAIfe Summary</h2>
                            <p>{story}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

