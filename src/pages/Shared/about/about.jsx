import { FaWhatsapp } from "react-icons/fa";

const About = () => {
  return (
    <div className="max-w-4xl my-12 mx-auto px-4 py-12 bg-white shadow-lg rounded-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-800">আমাদের সম্পর্কে</h1>
      </div>

      <div className="space-y-6 text-gray-700">
        <p className="text-lg leading-relaxed">
          চট্টগ্রাম মহানগর বিএনপির সাংগঠনিক কর্মকান্ডের গতিশীলতা, প্রশাসনিক
          কর্মকান্ড পরিচালনা, ইলেক্ট্রনিক নির্বাচনের মাধ্যমে ৪৩ টি সাংগঠনিক
          ওয়ার্ড এবং ১৬ টি থানা কমিটির নেতৃত্ব সৃষ্টি করা ইত্যাদি কর্মকান্ড
          পরিচালনার উদ্দেশ্য নিয়ে এই অ্যাপসটি ডিজাইন করা হয়েছে।
        </p>
        <p className="text-lg leading-relaxed">
          এই এ্যাপসের আপগ্রেড বা উন্নয়ন একটি চলমান প্রক্রিয়া এই লক্ষ্যে কাহারো
          কোন প্রকার নতুন আইডিয়া থাকিলে সদস্য সচিব, জনাব নাজিমুর রহমান অথবা
          আমাকে জানানোর জন্য অনুরোধ করা যাইতেছে।
        </p>
      </div>

      <div className="mt-12 text-start">
        <p className="text-lg font-semibold text-blue-800">
          বদরুল হায়দার চৌধুরী
        </p>
        <p className="text-md text-black">
          টিম লিডার,
          <br />
          চট্টগ্রাম মহানগর বিএনপি আইটি সেল
        </p>
        <div className="flex items-center  space-x-2 mt-1 text-black">
          <FaWhatsapp className="text-[#15803D] text-xl" />
          <span className="text-md text-black">+৯৭৪৫০৫৫১৯০১</span>
        </div>
      </div>
    </div>
  );
};

export default About;
