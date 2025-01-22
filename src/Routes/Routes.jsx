import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/Home/Home/Home";
import SignIn from "../(auth)/signIn/signIn";
import SignUp from "../(auth)/signUp/signUp";
import DashBoard from "../pages/dashBoard/dashBoard/dashBoard";
import MyProfile from "../pages/dashBoard/myprofile/myprofile";
import ProfileCard from "../pages/dashBoard/profileCard/profileCard";
import ApproveList from "../pages/dashBoard/approveList/approveList";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/signIn",
        element: <SignIn />,
      },
      {
        path: "/signUp",
        element: <SignUp />,
      },
      {
        path: "/dashBoard",
        element: <DashBoard />,
      },
      {
        path: "/myprofile",
        element: <MyProfile />,
      },
      {
        path: "/profileCard",
        element: <ProfileCard />,
      },
      {
        path: "/approveList",
        element: <ApproveList />,
      },
    ],
  },
]);
