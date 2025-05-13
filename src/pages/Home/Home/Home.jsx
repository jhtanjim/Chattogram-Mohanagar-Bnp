import { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause, FaApple, FaAndroid } from "react-icons/fa";

import { FaSearch } from "react-icons/fa";
import Video from "../../Shared/video/video";
import audio from "../../../assets/song/prothom_bangladesh.mp3";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import PressRelease from "../../Shared/pressRelease/pressRelease";
import khaledazia from "../../../../src/assets/khaledajia.jpg"
import tareqzia from "../../../../src/assets/TAREQZIa.jpg"
import ziaURRAHMAN  from "../../../../src/assets/ziaURRAHMAN.jpg"
import { useUserData } from "../../../hooks/useUserData"; 
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import Dofa from "../../Shared/Dofa/Dofa";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(""); // Manage search input
  const [searchResults, setSearchResults] = useState([]); // Manage search results
  const [isPlaying, setIsPlaying] = useState(true);
  const [autoplayAttempted, setAutoplayAttempted] = useState(false);
  const audioRef = useRef(null);
  
  const { userData, loading, refetch } = useUserData(); // Add refetch method
  const { isAuthenticated } = useAuth(); // Get isAuthenticated from useAuth

  // Add useEffect to re-fetch user data when authentication changes
  useEffect(() => {
    refetch(); 
  }, [isAuthenticated, refetch]);

  // Rest of the component remains the same as in the original code

  // Optional: Function to handle app download (since it was referenced but not implemented)
 // Update the handleAppDownload function in your Home component
// const handleAppDownload = (platform) => {
//   if (platform === "android") {
//     // Direct link to download from Google Drive
//     const downloadLink = "https://drive.google.com/uc?export=download&id=1oEZaRF2hkvkZRDAGTu2AwodGC8c1rv8r";
    
//     // Create an anchor element
//     const a = document.createElement('a');
//     a.href = downloadLink;
//     a.download = "bnp-app.apk"; // Suggested name for the downloaded file
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
    
//     console.log("Downloading Android app");
//   } else if (platform === "ios") {
//     // iOS download logic (if you have an iOS version)
//     console.log("iOS app download not available yet");
//     // You could show a notification or alert here
//     alert("iOS app is coming soon!");
//   }
// };
  // Play music when component mounts

  // Add this useEffect to your component
  useEffect(() => {
    // Add event listener for user interaction
    const handleUserInteraction = () => {
      if (audioRef.current && !audioRef.current.playing) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            // Remove event listeners after successful play
            document.removeEventListener("click", handleUserInteraction);
            document.removeEventListener("touchstart", handleUserInteraction);
            document.removeEventListener("keydown", handleUserInteraction);
          })
          .catch((error) => {
            console.log("Play failed:", error);
          });
      }
    };

    // Add event listeners for user interaction
    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("touchstart", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);

    // Try to play immediately (this will likely fail due to browser policies)
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.log("Autoplay failed (expected):", error);
        // We'll rely on the event listeners above
      });
    }

    // Cleanup function
    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current
          .play()
          .catch((error) => console.log("Play failed:", error));
      }
      setIsPlaying(!isPlaying);
    }
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = async () => {
    if (searchInput.trim() === "") return;
    try {
      const response = await fetch(
        `https://bnp-api-9oht.onrender.com/user/?partyId=${searchInput}`
      );
      const data = await response.json();
      setSearchResults(data.users); // Assuming `users` is an array in the response
      openModal();
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div>
      {/* Banner with Carousel */}
      <div className="relative ">
        {/* Background Music (Hidden) */}
        <audio ref={audioRef} src={audio} loop />

        {/* Carousel */}
        <Carousel autoPlay infiniteLoop showThumbs={false}>
        <div>
            <img
              src={ziaURRAHMAN }
              alt="ziaURRAHMAN"
              className="w-full lg:h-[800px] "
              width={1200}
              height={650}
            />
          </div>
          <div>
            <img
              src={ khaledazia}
              alt="খালেদা জিয়া"
              className="w-full lg:h-[800px] "
              width={1200}
              height={650}
            />
          </div>
          <div>
            <img
              src={tareqzia}
              alt="tareqzia"
              className="w-full lg:h-[800px] "
              width={1200}
              height={650}
            />
          </div>
        
        
         
          {/* Add more slides here */}
        </Carousel>

        {/* Play Music Button */}

        <button
          onClick={toggleMusic}
          className="absolute top-4 right-4 bg-green-500 bg-opacity-80 text-white p-4 rounded-full shadow-xl hover:bg-green-700 transition duration-300"
        >
          {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
        </button>
      </div>

      {/* Search Bar */}
     {/* Search Bar */}
<div className="max-w-screen-xl lg:mx-auto mx-4 mt-2 md:my-6">
  <div className="flex justify-center items-center space-x-2 md:space-x-4">
    <div className="w-full md:w-[90%]">
      <label
        htmlFor="search"
        className="block text-lg font-semibold text-green-600 mb-1 md:mb-2"
      >
        সদস্য খুঁজুন
      </label>
      <input
        id="search"
        placeholder="সদস্য খুঁজুন"
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="border-2 border-green-500 shadow-xl rounded-2xl w-full px-4 md:px-6 py-3 md:py-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-600"
        required
      />
    </div>
    <div className="my-auto mt-8 lg:w-[10%]">
      <button
        className="bg-green-600 text-white p-3 md:p-4 rounded-full hover:bg-red-700 transition duration-300 hover:text-yellow-500"
        onClick={handleSearch}
      >
        <FaSearch size={18} className="md:text-xl" />
      </button>
    </div>
  </div>
</div>
{/* Signup/Login and App Download Section */}
{/* Signup/Login and App Download Section */}
<div className="max-w-screen-xl lg:mx-auto mx-4 my-4 ">
        <div>
        <div className="w-full flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-6">
          {loading ? (
            <div className="w-full flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : !isAuthenticated ? (
            <div className="w-full">
              <Link
                to="/signIn"
                className="inline-flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
              >
                <span className="mr-3 text-lg">লগ ইন / <span className="font-bold text-red-800">রেজিস্ট্রেশন</span> </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 hidden lg:block"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3v1"
                  />
                </svg>
              </Link>
            </div>
          ) : null}
        </div>
        </div>

  {/* App Download Section (Always Visible) */}
  <div className="max-w-screen-xl lg:mx-auto mx-4 my-4 bg-green-50 rounded-xl p-6 shadow-md">
  <div className="w-full  p-4 rounded-lg">
      <h3 className="text-center  font-bold text-green-700 mb-4">
      ডাউনলোড ই-বিএনপি
     
      </h3>
      <div className="flex flex-row justify-center gap-3 max-w-md mx-auto">
        <button
          // onClick={() => handleAppDownload("ios")}
          className="flex-1 flex items-center justify-center bg-black text-white px-4 py-3 rounded-lg"
        >
          {/* Apple logo */}
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          <div className="flex flex-col items-start">
            <span className="text-xs">IOS</span>
            <span className="text-xs font-medium">App</span>
          </div>
        </button>
        <a
         href="https://bnpctg.com/uploads/apk/E-CTG.apk" download="BnpCtg.apk" className="flex-1 flex items-center justify-center bg-white border text-green-600 px-4 py-3 rounded-lg"
        >
          {/* Android logo */}
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.2,16.8a.8.8,0,0,0,.8.8h.8v2.8a1.2,1.2,0,0,0,2.4,0V17.6h1.6v2.8a1.2,1.2,0,0,0,2.4,0V17.6H16a.8.8,0,0,0,.8-.8V8H7.2Zm-2-8.8A1.2,1.2,0,0,0,4,9.2v5.6a1.2,1.2,0,0,0,2.4,0V9.2A1.2,1.2,0,0,0,5.2,8M18.8,8a1.2,1.2,0,0,0-1.2,1.2v5.6a1.2,1.2,0,0,0,2.4,0V9.2A1.2,1.2,0,0,0,18.8,8M16.6,3.6l1.4-1.4a.4.4,0,0,0,0-.6.4.4,0,0,0-.6,0L15.8,3.2a6.6,6.6,0,0,0-7.6,0L6.6,1.6a.4.4,0,0,0-.6,0,.4.4,0,0,0,0,.6L7.4,3.6A5.7,5.7,0,0,0,5,8H19A5.7,5.7,0,0,0,16.6,3.6ZM9.6,6A.8.8,0,1,1,9,5,.8.8,0,0,1,9.6,6Zm4.8,0a.8.8,0,1,1-.8-.8A.8.8,0,0,1,14.4,6Z" />
          </svg>
          <div className="flex flex-col  items-start">
            <span className="text-xs  font-medium">Android</span>
            <span className="text-xs  font-medium">App</span>
          </div>
        </a>
      </div>
    </div>
 </div>

</div>

      {/* Modal */}
      {isModalOpen && (
        <div className="z-[1000] fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-8 w-full max-w-4xl shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-center text-green-600">
              অনুসন্ধানের ফলাফল
            </h3>
            {searchResults.length > 0 ? (
              <div className="space-y-8">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col md:flex-row items-center bg-gray-100 rounded-lg p-6 shadow-md"
                  >
                    {/* Profile img */}
                    <img
                      src={user.image}
                      alt={user.fullName}
                      className="w-32 h-32 rounded-full object-cover mb-4 md:mb-0 md:mr-6"
                    />
                    {/* User Details */}
                    <div className="text-center md:text-left">
                      <p className="text-lg font-semibold">
                        <strong>নাম:</strong> {user.fullName}
                      </p>
                      <p className="text-gray-700">
                        <strong>ইমেইল:</strong> {user.email}
                      </p>
                      <p className="text-gray-700">
                        <strong>মোবাইল:</strong> {user.mobile}
                      </p>
                      <p className="text-gray-700">
                        <strong>NID:</strong> {user.nid}
                      </p>
                      <p className="text-gray-700">
                        <strong>ইউজার আইডি:</strong> {user.userId}
                      </p>
                      <p className="text-gray-700">
                        <strong>ইলেকশন সেন্টার:</strong> {user.electionCenter}
                      </p>
                      <p className="text-gray-700">
                        <strong>মহানগর:</strong> {user.mohanagar}
                      </p>
                      <p className="text-gray-700">
                        <strong>থানা:</strong> {user.thana}
                      </p>
                      <p className="text-gray-700">
                        <strong>ওয়ার্ড:</strong> {user.ward}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-700 text-center mb-6">
                কোনও ফলাফল পাওয়া যায়নি।
              </p>
            )}
            <div className="flex justify-center mt-6">
              <button
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                onClick={closeModal}
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
{/* Dofa */}
<div className="max-w-screen-2xl mx-auto my-8 p-6 rounded-lg bg-white">

<Dofa/>
</div>
      {/* Video */}
      <div className="mx-4 aspect-w-16 aspect-h-10">
        <Video />
      </div>

      

      {/* Video Section */}
      <div className="max-w-screen-2xl mx-auto my-8 p-6 rounded-lg bg-white">
        {/* প্রেস রিলিজ বিভাগ */}
        {/* <div className="mt-10">
          <h3 className="text-2xl text-center font-bold">প্রেস রিলিজ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <div className="h-52">
                <img
                  src="https://encrypted-tbn0.gstatic.com/imgs?q=tbn:ANd9GcSJMpghZFZykt2PzKqdu9azQhEP9n_wQnIIOQ&s"
                  alt="প্রেস রিলিজ ১"
                  className="w-full h-full object-cover"
                  width={500}
                  height={300}
                />
              </div>
              <p className="p-4 text-gray-700">সর্বশেষ আপডেট এবং খবর।</p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <div className="h-52">
                <img
                  src="https://api.bnpbd.org/api/upload/imgs/mohan-8--8f9e.jpg"
                  alt="প্রেস রিলিজ ২"
                  className="w-full h-full object-cover"
                  width={500}
                  height={300}
                />
              </div>
              <p className="p-4 text-gray-700">
                গুরুত্বপূর্ণ ঘোষণা এবং বিশদ বিবরণ।
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <div className="h-52">
                <img
                  src="https://api.bnpbd.org/api/upload/imgs/mohan-8--8f9e.jpg"
                  alt="প্রেস রিলিজ ২"
                  className="w-full h-full object-cover"
                  width={500}
                  height={300}
                />
              </div>
              <p className="p-4 text-gray-700">
                গুরুত্বপূর্ণ ঘোষণা এবং বিশদ বিবরণ।
              </p>
            </div>
          </div>
        </div> */}
        {/* প্রেস রিলিজ বিভাগ */}
        <div className="mt-10">
          <h3 className="text-2xl text-center font-bold">প্রেস রিলিজ</h3>
          <PressRelease />
        </div>
      </div>
    </div>
  );
};

export default Home;
