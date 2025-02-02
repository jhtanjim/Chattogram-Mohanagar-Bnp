import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/Home/Home/Home";
import SignIn from "../(auth)/signIn/signIn";
import SignUp from "../(auth)/signUp/signUp";
import DashBoard from "../pages/dashBoard/dashBoard/dashBoard";
import MyProfile from "../pages/dashBoard/myprofile/myprofile";
import ProfileCard from "../pages/dashBoard/profileCard/profileCard";
import ApproveList from "../pages/dashBoard/approveList/approveList";
import Elections from "../pages/dashBoard/elections/elections";
import ElectionDetail from "../pages/dashBoard/elections/electionDetail";
import MessageSend from "../pages/dashBoard/messageSend/messageSend";
import CandiDate from "../pages/dashBoard/candiDate/candiDate";
import About from "../pages/Shared/about/about";
import NoticeBoard from "../pages/Shared/noticeBoard/noticeBoard";
import Video from "../pages/Shared/video/video";
import UnderConstruction from "../Components/UnderConstruction/UnderConstruction";
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
        path: "/about",
        element: <About />,
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
      {
        path: "/elections",
        element: <Elections />,
      },
      {
        path: "/elections/:id",
        element: <ElectionDetail />,
      },
      {
        path: "/messageSend",
        element: <MessageSend />,
      },
      {
        path: "/candiDate",
        element: <CandiDate />,
      },
      {
        path: "/noticeBoard",
        element: <NoticeBoard />,
      },
      {
        path: "/video",
        element: <Video />,
      },
      // Wildcard Route for Undefined Paths

      { path: "*", element: <UnderConstruction /> },
    ],
  },
]);
