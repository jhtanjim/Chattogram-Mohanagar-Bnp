import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UniversalLoading from "../../../Components/UniversalLoading";

const ElectionResult = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("অনুগ্রহ করে লগইন করুন।");
        }

        const response = await fetch(
          "https://bnp-api-9oht.onrender.com/election/results/users",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error Response:", errorText);
          throw new Error("ডেটা লোড করতে ব্যর্থ হয়েছে।");
        }

        const data = await response.json();
        console.log(data);
        setElections(data);
      } catch (error) {
        console.error("Error fetching elections:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  if (loading) {
    return (
      <div >
    <UniversalLoading text="তথ্য লোড হচ্ছে..." />
        </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-red-600 mb-6">
        ইলেকশন ফলাফল
      </h1>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                নির্বাচন শিরোনাম
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                বিস্তারিত
              </th>
            </tr>
          </thead>
          <tbody>
            {elections.map((election) => (
              <tr key={election.electionId} className="border-t">
                <td className="px-6 py-4">{election.title}</td>
                <td className="px-6 py-4">
                  <Link
                    to={`/electionRes/${election.electionId}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    বিস্তারিত দেখুন
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ElectionResult;
