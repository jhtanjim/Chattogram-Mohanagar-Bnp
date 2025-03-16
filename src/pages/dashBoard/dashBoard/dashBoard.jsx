import { FaIdCard, FaUser } from "react-icons/fa";
import { MdHowToVote, MdMessage, MdOutlineApproval } from "react-icons/md";
import { AiFillLike, AiOutlineMessage } from "react-icons/ai";
import { useUserData } from "../../../hooks/useUserData";
import { Link } from "react-router-dom";
import { FaPeopleGroup, FaPerson } from "react-icons/fa6";

import UniversalLoading from "../../../Components/UniversalLoading";

const DashBoard = () => {
  const {
    userData,
    loading,
    error,
    isVerifier,
    isThanaVerifier,
    isGeneralUser,
  } = useUserData();

  // Use the new beautiful loading component
  if (loading) return <UniversalLoading 
  text="Loading Dashboard..." 

/>
;
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-xl text-red-500">{error}</p>
      </div>
    </div>
  );

  // Show waiting screen if user is not verified
  if (!userData?.isApproved) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-50 to-green-100">
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Approval Pending
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Please wait for your local leader and admin approval...
          </p>
          <div className="animate-pulse">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-24 w-24 mx-auto text-green-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // Show dashboard if user is verified
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-center text-4xl font-bold mb-12 text-gray-800">
          Welcome, {userData?.fullName || "User"}!
        </h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Link
            to="/myProfile"
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center"
          >
            <FaUser className="text-6xl mx-auto text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">প্রোফাইল</h2>
          </Link>

          {isGeneralUser && (
            <>
              {/* ID Card */}
              <Link  to="/profileCard" className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center">
                <FaIdCard className="text-6xl mx-auto text-green-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">আইডি কার্ড</h2>
              </Link>

              {/* Notice Board */}
              <Link
                to="/noticeBoard"
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center"
              >
                <MdMessage className="text-6xl mx-auto text-green-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">বিজ্ঞপ্তি দেখুন</h2>
              </Link>

              {/* Elections */}
              <Link
                to="/elections"
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center"
              >
                <AiFillLike className="text-6xl mx-auto text-green-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">ভোট দিন</h2>
              </Link>

              {/* Candidate */}
              <Link
                to="/candiDate"
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center"
              >
                <MdHowToVote className="text-6xl mx-auto text-green-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">প্রার্থী হন</h2>
              </Link>

              {/* Election Result */}
              <Link
                to="/electionResult"
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center"
              >
                <MdHowToVote className="text-6xl mx-auto text-green-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">Election Result</h2>
              </Link>
            </>
          )}

          {/* Message Send for Verifiers */}
          {(isVerifier || isThanaVerifier) && (
            <Link
              to="/messageSend"
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center"
            >
              <AiOutlineMessage className="text-6xl mx-auto text-green-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800">বার্তা পাঠান</h2>
            </Link>
          )}

          {/* Approve List for Verifiers */}
          {(isVerifier || isThanaVerifier) && (
            <Link
              to="/approveList"
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center"
            >
              <MdOutlineApproval className="text-6xl mx-auto text-green-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800">সদস্য অনুমোদন</h2>
            </Link>
          )}

          {/* About Us */}
          <Link
            to="/about"
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center"
          >
            <FaPeopleGroup className="text-6xl mx-auto text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">আমাদের সম্পর্কে</h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;

/*** */






// import { FaIdCard, FaUser } from "react-icons/fa";
// import { MdHowToVote, MdMessage, MdOutlineApproval } from "react-icons/md";
// import { AiFillLike, AiOutlineMessage } from "react-icons/ai";
// import { useUserData } from "../../../hooks/useUserData";
// import { Link } from "react-router-dom";
// import { FaPeopleGroup, FaPerson } from "react-icons/fa6";

// const DashBoard = () => {
//   const {
//     userData,
//     loading,
//     error,
//     isVerifier,
//     isThanaVerifier,
//     isGeneralUser,
//   } = useUserData();
//   console.log(userData);
//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   // Show waiting screen if user is not verified
//   if (!userData?.isApproved) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center p-4">
//         <h2 className="text-2xl font-semibold text-center text-gray-800">
//           Please wait for your local leader and admin approval...
//         </h2>
//       </div>
//     );
//   }

//   // Show dashboard if user is verified
//   return (
//     <div className="my-40">
//       <h1 className="text-center text-4xl font-bold mb-8">
//         Welcome, {userData?.fullName || "User"}!
//       </h1>
//       <div className="grid lg:grid-cols-3">
//         {/* card 1 */}
//         <Link
//           to="/myProfile"
//           className="border bg-[#DCFCE7]/50 p-4 py-8 text-center"
//         >
//           <FaUser className="text-6xl mx-auto" />
//           <h1 className="text-4xl font-bold">প্রোফাইল</h1>
//         </Link>

//         {isGeneralUser && (
//           <>
//             <p className="border bg-[#DCFCE7]/50 p-4 py-8 text-center">
//               <FaIdCard className="text-6xl mx-auto" />
//               <h1 className="text-4xl font-bold">আইডি কার্ড</h1>
//             </p>
//             <Link
//               to="/noticeBoard"
//               className="border bg-[#DCFCE7]/50 p-4 py-8 text-center"
//             >
//               <MdMessage className="text-6xl mx-auto" />
//               <h1 className="text-4xl font-bold">বিজ্ঞপ্তি দেখুন</h1>
//             </Link>
//             <Link
//               to="/elections"
//               className="border bg-[#DCFCE7]/50 p-4 py-8 text-center"
//             >
//               <AiFillLike className="text-6xl mx-auto" />
//               <h1 className="text-4xl font-bold">ভোট দিন</h1>
//             </Link>
//             <Link
//               to="/candiDate"
//               className="border bg-[#DCFCE7]/50 p-4 py-8 text-center"
//             >
//               <MdHowToVote className="text-6xl mx-auto" />
//               <h1 className="text-4xl font-bold">প্রার্থী হন</h1>
//             </Link>
//             <Link
//               to="/electionResult"
//               className="border bg-[#DCFCE7]/50 p-4 py-8 text-center"
//             >
//               <MdHowToVote className="text-6xl mx-auto" />
//               <h1 className="text-4xl font-bold">electionResult</h1>
//             </Link>
//           </>
//         )}

//         {(isVerifier || isThanaVerifier) && (
//           <Link
//             to="/messageSend"
//             className="border bg-[#DCFCE7]/50 p-4 py-8 text-center"
//           >
//             <AiOutlineMessage className="text-6xl mx-auto" />
//             <h1 className="text-4xl font-bold">বার্তা পাঠান</h1>
//           </Link>
//         )}

//         {/* card 7: Conditional Rendering */}
//         {(isVerifier || isThanaVerifier) && (
//           <Link
//             to="/approveList"
//             className="border bg-[#DCFCE7]/50 p-4 py-8 text-center"
//           >
//             <MdOutlineApproval className="text-6xl mx-auto" />
//             <h1 className="text-4xl font-bold">সদস্য অনুমোদন</h1>
//           </Link>
//         )}
//         <Link
//           to="/about"
//           className="border bg-[#DCFCE7]/50 p-4 py-8 text-center"
//         >
//           <FaPeopleGroup className="text-6xl mx-auto" />
//           <h1 className="text-4xl font-bold">আমাদের সম্পর্কে</h1>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default DashBoard;
