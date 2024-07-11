import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
// import Footer from "./components/Footer/Footer";
// import "./App.scss";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";
import Navbar from "./components/Navbar";
import { NewCourse } from "./pages/NewCourse";
import Videos from "./pages/Videos";
import Video from "./pages/Video";

const Layout = () => {
  return (
    <div className="app">
      <Navbar />
      <Outlet />
      {/* <Footer/> */}
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/newcourse",
        element: <NewCourse />,
      },
      {
        path: "/videos",
        element: <Videos />,
      },
      {
        path: "/video",
        element: <Video />,
      },
    ],
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
