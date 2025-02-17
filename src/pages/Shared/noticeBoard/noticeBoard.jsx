import { useState, useEffect } from "react";

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Fetch all notice data
    const token = localStorage.getItem("token");
    console.log(token); // Check if token is available
    if (!token) {
      setErrorMessage("User not found. Please log in.");
      setLoading(false);
      return;
    }

    fetch("https://bnp-api-9oht.onrender.com/notices", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch data: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched notices:", data); // Log the data to see what you get
        if (Array.isArray(data)) {
          setNotices(data); // Update state with fetched data
        } else {
          throw new Error("Invalid data format received.");
        }
      })
      .catch((error) => {
        console.error("Error fetching notices:", error);
        setErrorMessage(
          "নোটিশ ডেটা লোড করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।"
        );
      })
      .finally(() => {
        setLoading(false); // Stop loading when the request completes
      });
  }, []);

  if (loading) {
    return (
      <div className="my-20 text-center">
        <h1 className="font-bold text-xl">লোড হচ্ছে...</h1>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="my-20 text-center text-red-500">
        <h1 className="font-bold text-xl">{errorMessage}</h1>
      </div>
    );
  }

  return (
    <div className="my-20 max-w-screen-2xl lg:mx-auto mx-4">
      <h1 className="font-bold text-xl text-center mb-4">নোটিশ বোর্ড</h1>

      {/* Board Wrapper */}
      <div className="space-y-4">
        {notices.length > 0 ? (
          notices.map((notice, index) => (
            <div
              key={index}
              className="lg:flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
            >
              {/* Card 1 */}
              <div className="border border-black w-full lg:w-[25%] bg-[#DCFCE7] p-4 flex items-center justify-center min-w-[200px]">
                <h1 className="text-lg font-semibold">
                  {notice.author || "অ্যাডমিন"}
                </h1>
              </div>
              {/* Card 2 */}
              <div className="border border-black w-full lg:w-[50%] bg-[#DCFCE7] p-4 flex items-center justify-center min-w-[300px]">
                <p className="text-start text-sm font-semibold">
                  {notice.title ||
                    "লোরেম ইপসাম ডোলর সিট আমেট কনসেকটেটুর adipisicing এলিট।"}
                </p>
              </div>
              {/* Card 3 */}
              <div className="border border-black w-full lg:w-[25%] bg-[#DCFCE7] p-4 flex items-center justify-center min-w-[200px]">
                <h1 className="text-lg font-semibold">{notice.message}</h1>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center">
            <p>কোনো নোটিশ নেই</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeBoard;
