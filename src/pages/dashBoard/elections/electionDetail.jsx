"use client";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function ElectionDetail() {
  const [electionDetail, setElectionDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [votedCandidates, setVotedCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const params = useParams();
  const router = useNavigate();
  const id = params.id;
  const userToken = localStorage.getItem("token");

  useEffect(() => {
    if (!id) return;

    fetch(`https://bnp-api-9oht.onrender.com/election/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setElectionDetail(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching election detail:", error);
        setErrorMessage(
          "ইলেকশন ডেটা লোড করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।"
        );
        setLoading(false);
      });
  }, [id, userToken]);

  const handleVote = async (postId, candidateId) => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      // Check if the user has already voted for this candidate
      if (votedCandidates.includes(candidateId)) {
        // Show SweetAlert2 error message
        Swal.fire({
          icon: "error",
          title: "ভোট দিতে ব্যর্থ হয়েছে",
          text: "আপনি ইতিমধ্যেই এই পোস্টের জন্য ভোট দিয়েছেন।",
          confirmButtonColor: "#d33",
        });
        return;
      }

      const response = await fetch(
        "https://bnp-api-9oht.onrender.com/election/vote",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ postId, candidateId }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Show SweetAlert2 success message
        Swal.fire({
          icon: "success",
          title: "ভোট সফল",
          text: "আপনার ভোট সফলভাবে গৃহীত হয়েছে!",
          confirmButtonColor: "#28a745",
        });
        const updatedVotedCandidates = [...votedCandidates, candidateId];
        setVotedCandidates(updatedVotedCandidates);
        localStorage.setItem(
          "votedCandidates",
          JSON.stringify(updatedVotedCandidates)
        );
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Voting failed");
      }
    } catch (error) {
      console.error("Voting failed:", error);
      Swal.fire({
        icon: "error",
        title: "ভোট দিতে ব্যর্থ হয়েছে",
        text: error.message,
        confirmButtonColor: "#d33",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <p className="text-red-600">{errorMessage}</p>;
  }

  if (!electionDetail) {
    return <p className="text-red-600">ডেটা পাওয়া যায়নি।</p>;
  }

  const currentPost = electionDetail.posts[currentPage - 1] || {};

  return (
    <div className="font-sans text-center my-20">
      <h3 className="text-red-600 text-lg font-semibold">
        আপনার প্রার্থী নির্বাচন করুন
      </h3>

      {currentPost &&
        currentPost.candidates &&
        currentPost.candidates.length > 0 && (
          <>
            <h4 className="text-lg font-medium mt-2">
              {currentPost.name} প্রার্থী
            </h4>

            {successMessage && (
              <p className="text-green-600 font-bold my-3">{successMessage}</p>
            )}

            {errorMessage && (
              <p className="text-red-600 font-bold my-3">{errorMessage}</p>
            )}

            {currentPost.hasVoted ? (
              <p className="text-blue-600 font-bold my-3">
                আপনি ইতিমধ্যেই এই পোস্টের জন্য ভোট দিয়েছেন।
              </p>
            ) : (
              <table className="mx-auto mt-5 border-collapse w-3/5">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 bg-green-300">
                      প্রার্থীর নাম
                    </th>
                    <th className="border border-gray-300 px-4 py-2 bg-green-300">
                      ভোট দিন
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentPost.candidates.map((candidate, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2 bg-green-100">
                        {candidate.fullName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 bg-green-100">
                        <button
                          onClick={() =>
                            handleVote(currentPost.id, candidate.id)
                          }
                          disabled={votedCandidates.includes(candidate.id)}
                          className={`px-4 py-2 rounded ${
                            votedCandidates.includes(candidate.id)
                              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                              : "bg-green-500 text-white hover:bg-green-600"
                          }`}
                        >
                          {votedCandidates.includes(candidate.id)
                            ? "ভোট দেওয়া হয়েছে"
                            : "ভোট দিন"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

      <div className="mt-5">
        <p className="mb-3">
          অন্যান্য পোস্টের প্রার্থীদের জন্য ভোট দিতে পরবর্তী পৃষ্ঠায় যান
        </p>
        <div className="space-x-2">
          {electionDetail.posts.map((election, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === index + 1 ? "bg-gray-200" : "bg-white"
              } hover:bg-gray-300`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
