import { Outlet } from "react-router-dom";
import Navbar from "../Components/navbar/navbar";
import Footer from "../Components/footer/footer";

const Main = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Main;
