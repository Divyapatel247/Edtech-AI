import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export const Profile = () => {
  const { isAuthenticated, setIsAuthenticated, loading } =
    useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  const handleLogout = () => {
    axios
      .get("http://localhost:3000/api/user/logout", { withCredentials: true })
      .then(() => {
        setIsAuthenticated(false);
        navigate("/login");
      })
      .catch((error) => {
        console.error("Logout failed", error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Profile Page</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

// import { useContext, useState } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// export const Profile = () => {
//   const [name, setName] = useState(null);
//   const { setIsAuthenticated, isAuthenticated } = useContext(AuthContext);

//   // Function to handle login
//   const handleLogin = async () => {
//     try {
//       const response = await axios.get(
//         "http://localhost:3000/api/user/profile",
//         {
//           withCredentials: true,
//         }
//       );
//       setName(response.data);
//       console.log(response.data);
//       // setIsAuthenticated(true);
//       console.log(isAuthenticated);
//     } catch (error) {
//       console.error("Error logging in:", error);
//     }
//   };
//   const handleLogout = async () => {
//     try {
//       setIsAuthenticated(false);
//       console.log(isAuthenticated);
//       window.open("http://localhost:3000/api/user/logout", "_self");
//       // console.log("logout:", response.data);
//     } catch (error) {
//       console.error("Error logging in:", error);
//     }
//   };

//   return (
//     <div>
//       <h1>Profile</h1>
//       <h1>{isAuthenticated}</h1>
//       <p>Profile page</p>
//       <button onClick={handleLogin}>get user data</button>
//       <h1>{name}</h1>

//       <button onClick={handleLogout}>Logout</button>
//     </div>
//   );
// };
