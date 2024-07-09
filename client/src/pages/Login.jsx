// import axios from "axios";

export const Login = () => {
  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.get("http://localhost:3000/api/auth/google");
  //     // {
  //     //   // headers: {
  //     //   //   "Access-Control-Allow-Origin": "*",
  //     //   //   "Access-Control-Allow-Credentials": true,
  //     //   //   "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  //     //   //   "Access-Control-Allow-Headers":
  //     //   //     "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  //     //   // },
  //     // },
  //     // {
  //     //   withCredentials: false,
  //     // }
  //     console.log(response.data);
  //     window.location.href = response.data.redirectUrl;
  //   } catch (error) {
  //     console.error("Error logging in:", error);
  //   }
  // };
  const handleLogin = () => {
    const res = window.open("http://localhost:3000/api/auth/google", "_self");
    console.log(res);
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};
