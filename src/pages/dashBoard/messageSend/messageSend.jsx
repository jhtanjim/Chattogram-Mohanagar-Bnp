"use client";
import React, { useState } from "react";

const MessageSend = () => {
  const [selected, setSelected] = useState("ward");

  return (
    <div className="max-w-md mx-auto p-6 my-20 bg-white rounded-md">
      <h3 className="text-lg font-semibold text-green-600 mb-4 text-center">
        সদস্যকে আপনার বার্তা পাঠান
      </h3>
      <div className="flex justify-center space-x-4 mb-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="type"
            value="ward"
            checked={selected === "ward"}
            onChange={() => setSelected("ward")}
            className="hidden"
          />
          <span
            className={`px-4 py-2 rounded-full ${
              selected === "ward"
                ? "bg-green-600 text-white"
                : "bg-yellow-500 text-gray-600"
            }`}
          >
            ওয়ার্ড
          </span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="type"
            value="thana"
            checked={selected === "thana"}
            onChange={() => setSelected("thana")}
            className="hidden"
          />
          <span
            className={`px-4 py-2 rounded-full ${
              selected === "thana"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            থানার
          </span>
        </label>
      </div>
      <select className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
        <option value="">ওয়ার্ড নির্বাচন করুন</option>
        <option value="1">ওয়ার্ড ১</option>
        <option value="2">ওয়ার্ড ২</option>
      </select>
      <textarea
        placeholder="আপনার বার্তা লিখুন..."
        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        rows="4"
      />
      <button className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
        পাঠান
      </button>
      <p className="mt-4 text-sm text-center text-red-500">
        অনুমোদনের পর, বার্তাটি ব্যবহারকারীকে পাঠানো হবে।
      </p>
    </div>
  );
};

export default MessageSend;
