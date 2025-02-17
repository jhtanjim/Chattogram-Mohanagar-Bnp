import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2

const Nomination = () => {
  const { id } = useParams(); // Get election ID from the URL
  const [electionPosts, setElectionPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // For success message
  const [nominatedPosts, setNominatedPosts] = useState(new Set()); // To keep track of nominated posts

  useEffect(() => {
    // Fetch details for the specific election
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
        setElectionPosts(data.posts || []); // Store posts
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching election details:", error);
        setErrorMessage("ডেটা লোড করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।");
        setLoading(false);
      });

    // Load nominated posts from localStorage on page load
    const savedNominatedPosts =
      JSON.parse(localStorage.getItem("nominatedPosts")) || [];
    setNominatedPosts(new Set(savedNominatedPosts)); // Convert to Set for efficient lookups
  }, [id]);

  const handleNominationRequest = (postId) => {
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
              throw new Error("Nomination request failed");
            }
            return res.json();
          })
          .then((data) => {
            setSuccessMessage(
              "নির্বাচনে প্রার্থী হতে আপনার অনুরোধ সফল হয়েছে!"
            );
            setErrorMessage(""); // Clear any previous errors
            const updatedNominatedPosts = new Set(nominatedPosts);
            updatedNominatedPosts.add(postId);

            // Save nominated posts to localStorage
            localStorage.setItem(
              "nominatedPosts",
              JSON.stringify([...updatedNominatedPosts])
            );

            setNominatedPosts(updatedNominatedPosts); // Update state
          })
          .catch((error) => {
            console.error("Error requesting nomination:", error);
            setErrorMessage(
              "নির্বাচনের প্রার্থিতা রিকোয়েস্ট করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।"
            );
            setSuccessMessage(""); // Clear any previous success messages
          });
      }
    });
  };

  if (loading) {
    return <p>তথ্য লোড হচ্ছে...</p>;
  }

  if (errorMessage) {
    return <p className="text-red-600">{errorMessage}</p>;
  }

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">নির্বাচনের পদের তালিকা</h2>
      {successMessage && <p className="text-green-600">{successMessage}</p>}
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
                  {nominatedPosts.has(post.id) ? (
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      onClick={() => {}}
                    >
                      ক্যান্সেল
                    </button>
                  ) : (
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      onClick={() => handleNominationRequest(post.id)}
                    >
                      নির্বাচন করুন
                    </button>
                  )}
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
