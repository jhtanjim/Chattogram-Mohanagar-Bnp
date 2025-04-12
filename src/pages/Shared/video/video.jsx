import { useEffect, useState } from "react";

const Video = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("https://bnp-api-9oht.onrender.com/content/VIDEO")
      .then((res) => res.json())
      .then((data) => {
        setVideos(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching videos:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <>
          {/* Featured Video - Responsive for all screen sizes */}
          {videos.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">প্রধান ভিডিও</h2>
              <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src={videos[0].video}
                  title={videos[0].title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="mt-2 p-2 text-gray-800 font-medium text-center sm:text-left">{videos[0].title}</p>
            </div>
          )}

          {/* Quote Section - Responsive padding and font size */}
          <div className="my-6 sm:my-10 text-center bg-[#DCFCE7] p-6 sm:p-10 md:p-16 rounded-lg shadow-md">
            <blockquote className="italic text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
              "আমাদের মধ্যে শক্তি আছে এবং আমরা কাজ করতে পারি। আমরা নিজেরাই নিজেদের
              টেনে তুলতে পারি। খালি হাতে আমরা বড় কিছু অর্জন করতে পারি।"
            </blockquote>
            <p className="mt-4 font-semibold text-base sm:text-lg md:text-xl">
              শহীদ প্রেসিডেন্ট <span className="text-green-600">জিয়াউর রহমান</span>
            </p>
          </div>

          {/* Video Gallery - Responsive grid with better sizing */}
          <div className="mt-8 sm:mt-12">
            <h3 className="text-xl sm:text-2xl text-center font-bold mb-4 sm:mb-6">ভিডিও</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {videos.map((video, index) => (
                <div
                  key={video.id || index}
                  className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white"
                >
                  <div className="aspect-video">
                    <iframe
                      src={video.video}
                      title={video.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <p className="p-3 sm:p-4 text-gray-700 font-medium text-sm sm:text-base line-clamp-2">{video.title}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Video;