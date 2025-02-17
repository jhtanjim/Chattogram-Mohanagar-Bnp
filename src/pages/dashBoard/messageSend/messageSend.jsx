import { useState } from "react";
import Swal from "sweetalert2";

const MessageSend = () => {
  const [selected, setSelected] = useState("");
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [expiredAt, setExpiredAt] = useState(""); // New state for expiration date
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userToken = localStorage.getItem("token");
  console.log("User Token:", userToken);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message || !title || !expiredAt) {
      setError("সব তথ্য পূরণ করুন");
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: "সব তথ্য পূরণ করুন",
      });
      return;
    }
    setLoading(true);
    setError(null);

    const NoticeType = {
      groupType: selected,
      title,
      message,
      expiredAt, // Include expiredAt in the request
    };

    console.log("NoticeType being sent:", NoticeType);

    try {
      const response = await fetch(
        "https://bnp-api-9oht.onrender.com/notices",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(NoticeType),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "বার্তা পাঠাতে ব্যর্থ হয়েছে");
      }

      Swal.fire({
        icon: "success",
        title: "সফল!",
        text: "বার্তা সফলভাবে পাঠানো হয়েছে!",
      });

      setMessage("");
      setTitle("");
      setExpiredAt(""); // Reset the expiration date field
    } catch (err) {
      setError(err.message);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 my-20 bg-white rounded-md">
      <h3 className="text-lg font-semibold text-green-600 mb-4 text-center">
        সদস্যকে আপনার বার্তা পাঠান
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center space-x-4 mb-4">
          {["WARD", "THANA", "MOHANAGAR"].map((type) => (
            <label key={type} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="type"
                value={type}
                checked={selected === type}
                onChange={() => setSelected(type)}
                className="hidden"
              />
              <span
                className={`px-4 py-2 rounded-full ${
                  selected === type
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {type}
              </span>
            </label>
          ))}
        </div>
        <input
          type="text"
          placeholder="শিরোনাম লিখুন..."
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="আপনার বার্তা লিখুন..."
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <h1 className="opacity-60">ম্যাসেজ ডিলিট হওয়ার সময় </h1>
        <input
          type="date"
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          value={expiredAt}
          onChange={(e) => setExpiredAt(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "পাঠানো হচ্ছে..." : "পাঠান"}
        </button>
      </form>
    </div>
  );
};

export default MessageSend;
