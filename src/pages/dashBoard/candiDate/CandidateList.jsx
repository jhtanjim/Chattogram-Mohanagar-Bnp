import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CandidateList = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Fetch all election data
    fetch("https://bnp-api-9oht.onrender.com/election/summary", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((data) => {
        const filteredElection = data.filter((e) => e.state === "SCHEDULED");
        setElections(filteredElection); // Store the fetched elections data
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching elections:", error);
        setErrorMessage("ডেটা লোড করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>তথ্য লোড হচ্ছে...</p>;
  }

  if (errorMessage) {
    return <p className="text-red-600">{errorMessage}</p>;
  }

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">চলমান নির্বাচন সমূহ</h2>
      {elections.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">
                নির্বাচন শিরোনাম
              </th>
              <th className="border border-gray-300 px-4 py-2">পদ সম্পর্কিত</th>
            </tr>
          </thead>
          <tbody>
            {elections.map((election) => (
              <tr key={election.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {election.title}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <Link
                    to={`/nomination/${election.id}`}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    বিস্তারিত দেখুন
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>কোন তথ্য পাওয়া যায়নি।</p>
      )}
    </div>
  );
};

export default CandidateList;
