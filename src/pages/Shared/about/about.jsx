import profileImage from "../../../../src/assets/WhatsApp Image 2025-02-09 at 23.38.56_bc327a6c.jpg";

const About = () => {
  return (
    <div className="max-w-4xl my-12 mx-auto px-4 py-12 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col items-center mb-8">
        <img
          src={profileImage}
          alt="চট্টগ্রাম মহানগর বিএনপি লোগো"
          width={150}
          height={150}
          className="rounded-full border-4 border-blue-500"
        />
        <h1 className="text-3xl font-bold mt-4 text-blue-800">
          আমাদের সম্পর্কে
        </h1>
      </div>

      <div className="space-y-6 text-gray-700">
        <p className="text-lg leading-relaxed">
          চট্টগ্রাম মহানগর বিএনপির সাংগঠনিক কর্মকান্ডের গতিশীলতা এবং নির্বাচনের
          মাধ্যমে নেতৃত্ব সৃষ্টির উদ্দেশ্যে সদস্য সচিব নাজমুর রহমানের নির্দেশে
          এই অ্যাপটি নির্মাণ করা হয়েছে।
        </p>
        <p className="text-lg leading-relaxed">
          এই এ্যাপসের আপগ্রেড বা উন্নয়ন একটি চলমান প্রক্রিয়া এই লক্ষ্যে কাহারো
          কোন প্রকার নতুন আইডিয়া থাকিলে সদস্য সচিব জনাব নাজিমুর রহমান অথবা আমাকে
          জানানোর জন্য অনুরোধ করা যাইতেছে।
        </p>
      </div>

      <div className="mt-12 text-right">
        <p className="text-lg font-semibold text-blue-800">
          দিরুল হায়দার চৌধুরী
        </p>
        <p className="text-md text-gray-600">
          টিম লিডার,
          <br />
          চট্টগ্রাম মহানগর বিএনপি আইটি সেল
        </p>
      </div>
    </div>
  );
};

export default About;
