import { Link } from "react-router-dom";

const UnderConstruction = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-4">
      <img
        src="https://cdn-icons-png.flaticon.com/512/564/564619.png"
        alt="Under Construction"
        className="w-32 h-32 mb-4"
      />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Under Construction
      </h1>
      <p className="text-lg text-gray-600 mb-4">
        This page is currently under development. Please check back later!
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default UnderConstruction;
