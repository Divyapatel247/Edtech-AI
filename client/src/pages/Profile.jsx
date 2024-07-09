import { useState } from "react";
import axios from "axios";
export const Profile = () => {
  const [name, setName] = useState(null);

  // Function to handle login
  const handleLogin = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/profile",
        {
          withCredentials: true,
        }
      );
      setName(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };
  const handleLogout = async () => {
    try {
      window.open("http://localhost:3000/api/user/logout", "_self");
      // console.log("logout:", response.data);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div>
      <h1>Profile</h1>
      <p>Profile page</p>
      <button onClick={handleLogin}>get user data</button>
      <h1>{name}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};
