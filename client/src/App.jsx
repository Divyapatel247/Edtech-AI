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
import PrivateRoute from "../PrivateRoute";

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
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/newcourse",
        element: (
          <PrivateRoute>
            <NewCourse />
          </PrivateRoute>
        ),
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
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  return (
    <div className="bg-slate-800 h-screen">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
