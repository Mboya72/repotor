import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [tweets, setTweets] = useState([]);
  const [content, setContent] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/tweets").then((response) => {
      setTweets(response.data);
    });
  }, []);

  const postTweet = async () => {
    if (!user) {
      alert("Please log in first");
      return;
    }
    await axios.post("http://localhost:5000/tweets", {
      content,
      user_id: user.id,
    });
    setContent("");
    axios.get("http://localhost:5000/tweets").then((response) => {
      setTweets(response.data);
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Repotor</h1>
      <div className="mb-4">
        <textarea
          className="w-full p-2 border rounded"
          placeholder="What's happening?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          onClick={postTweet}
        >
          Tweet
        </button>
      </div>
      <div>
        {tweets.map((tweet) => (
          <div key={tweet.id} className="border p-2 mb-2 rounded">
            <p className="font-bold">@{tweet.user}</p>
            <p>{tweet.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
