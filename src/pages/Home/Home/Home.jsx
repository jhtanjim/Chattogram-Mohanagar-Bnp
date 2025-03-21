import { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

import { FaSearch } from "react-icons/fa";
import Video from "../../Shared/video/video";
import audio from "../../../assets/song/prothom_bangladesh.mp3";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import PressRelease from "../../Shared/pressRelease/pressRelease";
import khaledazia from "../../../../src/assets/khaledajia.jpg"
import tareqzia from "../../../../src/assets/TAREQZIa.jpg"
import ziaURRAHMAN  from "../../../../src/assets/ziaURRAHMAN.jpg"
const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(""); // Manage search input
  const [searchResults, setSearchResults] = useState([]); // Manage search results
  const [isPlaying, setIsPlaying] = useState(true);
  const [autoplayAttempted, setAutoplayAttempted] = useState(false);
  const audioRef = useRef(null);

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
      <div className="max-w-screen-xl lg:mx-auto mx-4">
        <div className="flex justify-center items-center space-x-4 my-10">
          <div className="w-full md:w-[90%]">
            <label
              htmlFor="search"
              className="block text-lg font-semibold text-green-600 mb-2"
            >
              সদস্য খুঁজুন
            </label>
            <input
              id="search"
              placeholder="সদস্য খুঁজুন"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="border-2 border-green-500 shadow-xl rounded-2xl w-full px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>
          <div className="my-auto mt-10 lg:w-[10%]">
            <button
              className="bg-green-600 text-white p-4 rounded-full hover:bg-red-700 transition duration-300 hover:text-yellow-500"
              onClick={handleSearch}
            >
              <FaSearch size={20} />
            </button>
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

      {/* Video */}
      <div className="mx-4 aspect-w-16 aspect-h-10">
        <Video />
      </div>

      {/* Quote */}
      <div className="mt-6 text-center bg-[#DCFCE7] py-20">
        <blockquote className="italic text-2xl font-bold">
          “আমাদের মধ্যে শক্তি আছে এবং আমরা কাজ করতে পারি। আমরা নিজেরাই নিজেদের
          টেনে তুলতে পারি। খালি হাতে আমরা বড় কিছু অর্জন করতে পারি。”
        </blockquote>
        <p className="mt-2 font-semibold text-xl">
          শহীদ প্রেসিডেন্ট <span className="text-green-600">জিয়াউর রহমান</span>
        </p>
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
