import axios from "axios";
import { useEffect } from "react";

export const Home = () => {
  const call = async () => {
    const keys = await axios.get("http://localhost:3000/api/db/videos", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(keys.data);
  };
  useEffect(() => {
    call();
  }, []);

  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to our website!</p>
      <h3></h3>
    </div>
  );
};
