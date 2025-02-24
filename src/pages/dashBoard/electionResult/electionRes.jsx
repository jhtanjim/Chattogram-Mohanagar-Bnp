"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function ElectionResults() {
  const { electionId } = useParams();
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchElectionDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("অনুগ্রহ করে লগইন করুন।");
        }

        const electionRes = await fetch(
          `https://bnp-api-9oht.onrender.com/election/${electionId}/results`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!electionRes.ok) {
          throw new Error("ফলাফল লোড করতে ব্যর্থ হয়েছে।");
        }

        const electionData = await electionRes.json();

        const allElectionsRes = await fetch(
          "https://bnp-api-9oht.onrender.com/election/results/users",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!allElectionsRes.ok) {
          throw new Error("সকল ইলেকশন লোড করতে ব্যর্থ হয়েছে।");
        }

        const allElectionsData = await allElectionsRes.json();
        const matchedElection = allElectionsData.find(
          (e) => e.electionId === electionId
        );

        if (!matchedElection) {
          throw new Error("এই ইলেকশনটির ফলাফল পাওয়া যায়নি।");
        }

        const mergedElection = {
          ...electionData,
          results: matchedElection.results,
        };

        setElection(mergedElection);
      } catch (error) {
        console.error("Error fetching election details:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchElectionDetails();
  }, [electionId]);

  if (loading) {
    return (
      <div className="text-center py-8 text-2xl font-semibold text-gray-600">
        তথ্য লোড হচ্ছে...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p className="text-2xl font-bold mb-2">{error}</p>
        <p className="text-lg">
          অনুগ্রহ করে পুনরায় চেষ্টা করুন অথবা সাপোর্টের সাথে যোগাযোগ করুন।
        </p>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="text-center py-8 text-2xl font-bold text-red-600">
        কোনো ফলাফল পাওয়া যায়নি।
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-red-600 mb-8">
        {election.title} - ফলাফল
      </h1>

      <div className="space-y-8">
        {election.results.results.map((post) => {
          const winner = post.candidates.reduce((prev, current) =>
            prev.votes > current.votes ? prev : current
          );
          const totalVotes = post.candidates.reduce(
            (sum, candidate) => sum + candidate.votes,
            0
          );

          return (
            <div
              key={post.postId}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="bg-green-600 text-white p-4">
                <h2 className="text-2xl font-semibold">{post.postName}</h2>
              </div>
              <div className="p-6 space-y-4">
                {post.candidates.map((candidate) => {
                  const votePercentage = (candidate.votes / totalVotes) * 100;
                  const isWinner = candidate.candidateId === winner.candidateId;

                  return (
                    <div
                      key={candidate.candidateId}
                      className={`flex items-center p-4 rounded-lg ${
                        isWinner ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      <img
                        src={candidate.candidateImage || "/placeholder.svg"}
                        alt={candidate.candidateName}
                        className="w-16 h-16 rounded-full mr-4 border-4 border-white shadow"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-semibold text-lg">
                            {candidate.candidateName}
                          </p>
                          <p className="font-bold text-lg">
                            {candidate.votes} ভোট
                          </p>
                        </div>
                        <div className="relative pt-1">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                            <div
                              style={{ width: `${votePercentage}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                            ></div>
                          </div>
                        </div>
                        <p className="text-right text-sm mt-1">
                          {votePercentage.toFixed(2)}%
                        </p>
                      </div>
                      {isWinner && (
                        <div className="ml-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          বিজয়ী
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
