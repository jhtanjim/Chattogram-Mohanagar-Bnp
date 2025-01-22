import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(""); // Manage search input
  const [searchResults, setSearchResults] = useState([]); // Manage search results

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
      {/* Banner */}
      <div className="max-w-screen-2xl mx-4 my-4 rounded-2xl lg:mx-auto overflow-hidden">
        {/* Carousel (simply a static section here for simplicity) */}

        <div>
          <img
            src="https://api.bnpbd.org/api/upload/images/bnp-chief-khaleda-zia-release-9244.jpg"
            alt="খালেদা জিয়া"
            className="w-full lg:h-[650px] object-cover"
            width={1200}
            height={650}
          />
        </div>
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
        <iframe
          src="https://www.youtube.com/embed/2tWPVCVSoaQ"
          title="ভিডিও"
          className="w-full h-[500px]"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
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
        <div className="mt-10">
          <h3 className="text-2xl text-center font-bold">ভিডিও</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src="https://www.youtube.com/embed/OsbiW19Mpio"
                  title="ভিডিও ১"
                  className="w-full h-80"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="p-4 text-gray-700">
                ভিডিওতে আলোচিত বিষয়ের বিস্তারিত।
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src="https://www.youtube.com/embed/2tWPVCVSoaQ"
                  title="ভিডিও ২"
                  className="w-full h-80"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="p-4 text-gray-700">আকর্ষণীয় তথ্য এবং বিশ্লেষণ।</p>
            </div>
          </div>
        </div>
        {/* প্রেস রিলিজ বিভাগ */}
        <div className="mt-10">
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
        </div>
      </div>
    </div>
  );
};

export default Home;
