"use client";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import UniversalLoading from "../../../Components/UniversalLoading";

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
        setElectionDetail(data);
        setLoading(false);
      })
      .catch((error) => {
        setErrorMessage("ইলেকশন ডেটা লোড করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।");
        setLoading(false);
      });
  }, [id, userToken]);

  const isVotingPeriod = () => {
    if (!electionDetail) return false;

    const now = new Date().getTime();
    const startDate = new Date(electionDetail.startDate).getTime();
    const endDate = new Date(electionDetail.endDate).getTime();

    return now >= startDate && now <= endDate;
  };

  const handleVote = async (postId, candidateId) => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      if (!isVotingPeriod()) {
        Swal.fire({
          icon: "error",
          title: "ভোট দিতে ব্যর্থ হয়েছে",
          text: "বর্তমানে ভোটদান চলছে না।",
          confirmButtonColor: "#d33",
        });
        return;
      }

      if (votedCandidates.includes(candidateId)) {
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
        Swal.fire({
          icon: "success",
          title: "ভোট সফল",
          text: "আপনার ভোট সফলভাবে গৃহীত হয়েছে!",
          confirmButtonColor: "#28a745",
        });
        const updatedVotedCandidates = [...votedCandidates, candidateId];
        setVotedCandidates(updatedVotedCandidates);
        localStorage.setItem("votedCandidates", JSON.stringify(updatedVotedCandidates));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Voting failed");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ভোট দিতে ব্যর্থ হয়েছে",
        text: error.message,
        confirmButtonColor: "#d33",
      });
    }
  };

  const getButtonText = (candidateId) => {
    if (votedCandidates.includes(candidateId)) {
      return "ভোট দেওয়া হয়েছে";
    }
    if (!isVotingPeriod()) {
      return "ভোটদান বন্ধ";
    }
    return "ভোট দিন";
  };

  if (loading) {
    return <UniversalLoading />;
  }

  if (errorMessage) {
    return <p className="text-red-600 text-center">{errorMessage}</p>;
  }

  if (!electionDetail) {
    return <p className="text-red-600 text-center">ডেটা পাওয়া যায়নি।</p>;
  }

  const currentPost = electionDetail.posts[currentPage - 1] || {};

  return (
    <div className="font-sans px-4 md:px-10 my-10 max-w-6xl mx-auto">
      <h3 className="text-red-600 text-center text-xl font-semibold mb-4">
        আপনার প্রার্থী নির্বাচন করুন
      </h3>

      {currentPost?.candidates?.length > 0 && (
        <>
          <h4 className="text-lg font-medium text-center mb-2">
            {currentPost.name} প্রার্থী
          </h4>

          {successMessage && (
            <p className="text-green-600 font-bold my-3 text-center">{successMessage}</p>
          )}

          {errorMessage && (
            <p className="text-red-600 font-bold my-3 text-center">{errorMessage}</p>
          )}

          {currentPost.hasVoted ? (
            <p className="text-blue-600 font-bold my-3 text-center">
              আপনি ইতিমধ্যেই এই পোস্টের জন্য ভোট দিয়েছেন।
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse mt-5">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 bg-green-300">ছবি</th>
                    <th className="border border-gray-300 px-4 py-2 bg-green-300">প্রার্থীর নাম</th>
                    <th className="border border-gray-300 px-4 py-2 bg-green-300">ভোট দিন</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPost.candidates.map((candidate, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">
                        <img
                          src={candidate.image}
                          alt={candidate.fullName}
                          className="w-16 h-16 object-cover rounded-full mx-auto"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {candidate.fullName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <button
                          onClick={() => handleVote(currentPost.id, candidate.id)}
                          disabled={
                            votedCandidates.includes(candidate.id) || !isVotingPeriod()
                          }
                          className={`px-4 py-2 rounded transition-all ${
                            votedCandidates.includes(candidate.id) || !isVotingPeriod()
                              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                              : "bg-green-500 text-white hover:bg-green-600"
                          }`}
                        >
                          {getButtonText(candidate.id)}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <div className="mt-8 text-center">
        <p className="mb-3">অন্যান্য পোস্টের প্রার্থীদের জন্য ভোট দিতে পরবর্তী পৃষ্ঠায় যান</p>
        <div className="flex justify-center flex-wrap gap-2">
          {electionDetail.posts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-1 rounded border ${
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
