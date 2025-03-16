import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useUserData } from "../../../hooks/useUserData";

const Nomination = () => {
  const { id } = useParams();
  const [electionPosts, setElectionPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { userData } = useUserData();
  console.log(userData?.id);
  const loggedInUserId = userData?.id;

  useEffect(() => {
    fetchElectionDetails();
    clearMessages();
  }, [id]);

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const fetchElectionDetails = () => {
    setLoading(true);
    clearMessages();

    fetch(`https://bnp-api-9oht.onrender.com/election/${id}`, {
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
        // console.log(data);
        setElectionPosts(data.posts || []);
      })
      .catch((error) => {
        console.error("Error fetching election details:", error);
        setErrorMessage("ডেটা লোড করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleNominationRequest = (postId) => {
    clearMessages();

    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "আপনি কি সত্যিই এই পদে নির্বাচন করতে চান?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, নির্বাচন করি",
      cancelButtonText: "না, বাতিল করি",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(
          `https://bnp-api-9oht.onrender.com/election/request-nomination/${postId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
          .then((res) => {
            if (!res.ok) {
              return res.json().then((data) => Promise.reject(data));
            }
            return res.json();
          })
          .then((data) => {
            setSuccessMessage(
              "নির্বাচনে প্রার্থী হতে আপনার অনুরোধ সফল হয়েছে!"
            );
            fetchElectionDetails();
          })
          .catch((error) => {
            console.error("Error requesting nomination:", error);
            setErrorMessage(
              error.message ||
                "নির্বাচনের প্রার্থিতা রিকোয়েস্ট করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।"
            );
          });
      }
    });
  };

  const handleCancelNomination = (postId) => {
    clearMessages();
  
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "আপনি কি সত্যিই আপনার অনুরোধ বাতিল করতে চান?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, বাতিল করি",
      cancelButtonText: "না, থাক",
    }).then((result) => {
      if (result.isConfirmed) {
        // Try the exact URL format you mentioned
        fetch(
          `https://bnp-api-9oht.onrender.com/election/request-withdrawal/candidate/${postId}/cancel`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            // You may need to include a body if the API expects one
            body: JSON.stringify({
              postId: postId,
              userId: loggedInUserId
            }),
          }
        )
          .then(async (res) => {
            // Log the complete response for debugging
            console.log("Cancel nomination response status:", res.status);
            
            if (!res.ok) {
              const errorData = await res.json().catch(e => ({}));
              console.log("Error data:", errorData);
              throw errorData;
            }
            return res.json();
          })
          .then((data) => {
            console.log("Cancel success data:", data);
            setSuccessMessage("আপনার অনুরোধ বাতিল করা হয়েছে!");
            fetchElectionDetails();
          })
          .catch((error) => {
            console.error("Complete error object:", error);
            
            // Try an alternative endpoint if the first one fails
            return fetch(
              `https://bnp-api-9oht.onrender.com/election/cancel-nomination/${postId}/cancel`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                  postId: postId
                }),
              }
            )
              .then(async (res) => {
                if (!res.ok) {
                  const fallbackErrorData = await res.json().catch(e => ({}));
                  throw fallbackErrorData;
                }
                return res.json();
              })
              .then((data) => {
                setSuccessMessage("আপনার অনুরোধ বাতিল করা হয়েছে!");
                fetchElectionDetails();
              })
              .catch((fallbackError) => {
                console.error("Error canceling nomination (fallback):", fallbackError);
                setErrorMessage(
                  "অনুরোধ বাতিল করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।"
                );
              });
          });
      }
    });
  };

  const handleWithdrawal = (postId) => {
    clearMessages();

    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "আপনি কি সত্যিই এই পদ থেকে প্রার্থিতা প্রত্যাহার করতে চান?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, প্রত্যাহার করি",
      cancelButtonText: "না, বাতিল করি",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(
          `https://bnp-api-9oht.onrender.com/election/request-withdrawal/candidate/${postId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
          .then(async (res) => {
            if (!res.ok) {
              const errorData = await res.json();
              throw errorData;
            }
            return res.json();
          })
          .then((data) => {
            setSuccessMessage("আপনার প্রার্থিতা প্রত্যাহার সফল হয়েছে!");
            fetchElectionDetails();
          })
          .catch((error) => {
            console.error("Error withdrawing nomination:", error);
            setErrorMessage(
              "প্রার্থিতা প্রত্যাহার করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।"
            );
          });
      }
    });
  };

  const getNomineeStatus = (post) => {
    console.log({ post });
    if (!post.nominees) return null;
    return post.nominees.find((nominee) => nominee.userId === loggedInUserId);
  };

  const renderActionButton = (post) => {
    const nomineeStatus = getNomineeStatus(post);
    console.log({ nomineeStatus });
    if (nomineeStatus) {
      return (
        <div className="space-y-2">
          <div
            className={`text-sm font-medium ${
              nomineeStatus.status === "PENDING"
                ? "text-yellow-600"
                : nomineeStatus.status === "APPROVED"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {nomineeStatus.status === "PENDING" && (
              <>
                <span>অপেক্ষমান</span>
                <button
                  className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => handleCancelNomination(post.id)}
                >
                  ক্যান্সেল
                </button>
              </>
            )}
            {nomineeStatus.status === "APPROVED" && (
              <>
                <span>অনুমোদিত</span>
                <button
                  className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => handleWithdrawal(post.id)}
                >
                  প্রত্যাহার
                </button>
              </>
            )}
            {nomineeStatus.status === "REJECTED" && <span>প্রত্যাখ্যাত</span>}
          </div>
        </div>
      );
    }

    // Show nomination button if user hasn't nominated
    return (
      <button
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        onClick={() => handleNominationRequest(post.id)}
      >
        নির্বাচন করুন
      </button>
    );
  };

  if (loading) {
    return <p>তথ্য লোড হচ্ছে...</p>;
  }

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">নির্বাচনের পদের তালিকা</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={fetchElectionDetails}
        >
          রিফ্রেশ করুন
        </button>
      </div>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {electionPosts.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">পদের নাম</th>
              <th className="border border-gray-300 px-4 py-2">স্ট্যাটাস</th>
            </tr>
          </thead>
          <tbody>
            {electionPosts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {post.name}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {renderActionButton(post)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>কোন পোস্ট পাওয়া যায়নি।</p>
      )}
    </div>
  );
};

export default Nomination;