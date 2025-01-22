import React from "react";

const NoticeBoard = () => {
  return (
    <div className="my-20">
      <h1 className="font-bold text-xl text-center mb-4">নোটিশ বোর্ড</h1>

      {/* Board Wrapper */}
      <div className="space-y-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="lg:flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
          >
            {/* Card 1 */}
            <div className="border border-black w-full lg:w-[25%] bg-[#DCFCE7] p-4 flex items-center justify-center min-w-[200px]">
              <h1 className="text-lg font-semibold">অ্যাডমিন</h1>
            </div>
            {/* Card 2 */}
            <div className="border border-black w-full lg:w-[50%] bg-[#DCFCE7] p-4 flex items-center justify-center min-w-[300px]">
              <p className="text-start text-sm font-semibold">
                লোরেম ইপসাম ডোলর সিট আমেট কনসেকটেটুর adipisicing এলিট।
                লাউডান্টিয়াম ইন, আইডি কুয়াম নেকুয়ে অট অফিশিয়া। নাতুস, মাইনাস
                কুম অবক্যাকাটি ব্ল্যান্ডিতিস ডেসেরুন্ত এলিগেন্দি ইপসাম কোরাপ্টি
                ভেরিটেটিস, মোল্লিতিয়া, মলেস্তিয়ে ভোলুপট্যাটেম সিন্ট নেকুয়ে!
              </p>
            </div>
            {/* Card 3 */}
            <div className="border border-black w-full lg:w-[25%] bg-[#DCFCE7] p-4 flex items-center justify-center min-w-[200px]">
              <h1 className="text-lg font-semibold">অ্যাডমিন</h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticeBoard;
