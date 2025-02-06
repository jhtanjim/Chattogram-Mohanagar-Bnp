import { useEffect, useState } from "react";

const Video = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("https://bnp-api-9oht.onrender.com/content/VIDEO")
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .catch((err) => console.error("Error fetching videos:", err));
  }, []);

  return (
    <div className="max-w-screen-3xl mx-auto my-8 p-6 rounded-lg bg-white">
      {/* প্রধান ভিডিও */}
      {videos.length > 0 && (
        <div className="mx-4 aspect-w-16 aspect-h-10">
          <iframe
            src={videos[0].video}
            title={videos[0].title}
            className="w-full h-[500px]"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {/* উক্তি */}
      <div className="mt-6 text-center bg-[#DCFCE7] py-20">
        <blockquote className="italic text-2xl font-bold">
          “আমাদের মধ্যে শক্তি আছে এবং আমরা কাজ করতে পারি। আমরা নিজেরাই নিজেদের
          টেনে তুলতে পারি। খালি হাতে আমরা বড় কিছু অর্জন করতে পারি।”
        </blockquote>
        <p className="mt-2 font-semibold text-xl">
          শহীদ প্রেসিডেন্ট <span className="text-green-600">জিয়াউর রহমান</span>
        </p>
      </div>

      {/* ভিডিও বিভাগ */}
      <div className="mt-10">
        <h3 className="text-2xl text-center font-bold">ভিডিও</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="rounded-lg overflow-hidden shadow-lg"
            >
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={video.video}
                  title={video.title}
                  className="w-full h-80"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="p-4 text-gray-700">{video.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Video;
