"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Swal from "sweetalert2"
import { useUserData } from "../../../hooks/useUserData"
import UniversalLoading from "../../../Components/UniversalLoading"

const Nomination = () => {
  const { id } = useParams()
  const [electionPosts, setElectionPosts] = useState([])
  const [electionDetails, setElectionDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const { userData } = useUserData()
  const loggedInUserId = userData?.id
  const [hasNomination, setHasNomination] = useState(false)
  const [nominatedPostId, setNominatedPostId] = useState(null)

  useEffect(() => {
    fetchElectionDetails()
    clearMessages()
  }, [id])

  const clearMessages = () => {
    setErrorMessage("")
    setSuccessMessage("")
  }

  // Function to format date in Bengali
  const formatDateTimeBengali = (dateString) => {
    if (!dateString) return "তারিখ নেই"

    const date = new Date(dateString)

    // Options for formatting date and time
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }

    // Format the date in Bengali
    return new Intl.DateTimeFormat("bn-BD", options).format(date)
  }

  const fetchElectionDetails = () => {
    setLoading(true)
    clearMessages()

    fetch(`https://bnp-api-9oht.onrender.com/election/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data")
        }
        return res.json()
      })
      .then((data) => {
        setElectionPosts(data.posts || [])
        setElectionDetails(data)
        
        // Check if user has any nominations already
        let nominated = false
        let nominatedId = null
        
        data.posts?.forEach(post => {
          const userNomination = post.nominees?.find(nominee => nominee.userId === loggedInUserId)
          if (userNomination) {
            nominated = true
            nominatedId = post.id
          }
        })
        
        setHasNomination(nominated)
        setNominatedPostId(nominatedId)
      })
      .catch((error) => {
        console.error("Error fetching election details:", error)
        setErrorMessage("ডেটা লোড করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleNominationRequest = (postId) => {
    clearMessages()
    
    // Check if user already has a nomination for another post
    if (hasNomination && nominatedPostId !== postId) {
      Swal.fire({
        title: "অনুরোধ সম্ভব নয়",
        text: "আপনি ইতিমধ্যে একটি পদে নির্বাচন করেছেন। আরেকটি পদে নির্বাচন করতে আগের নির্বাচন বাতিল করুন।",
        icon: "error",
        confirmButtonText: "বুঝেছি",
      })
      return
    }

    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "আপনি কি সত্যিই এই পদে নির্বাচন করতে চান?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, নির্বাচন করি",
      cancelButtonText: "না, বাতিল করি",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://bnp-api-9oht.onrender.com/election/request-nomination/${postId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((res) => {
            if (!res.ok) {
              return res.json().then((data) => Promise.reject(data))
            }
            return res.json()
          })
          .then((data) => {
            setSuccessMessage("নির্বাচনে প্রার্থী হতে আপনার অনুরোধ সফল হয়েছে!")
            setHasNomination(true)
            setNominatedPostId(postId)
            fetchElectionDetails()
          })
          .catch((error) => {
            console.error("Error requesting nomination:", error)
            setErrorMessage(error.message || "নির্বাচনের প্রার্থিতা রিকোয়েস্ট করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।")
          })
      }
    })
  }

  const handleCancelNomination = (postId) => {
    clearMessages()

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
        fetch(`https://bnp-api-9oht.onrender.com/election/request-withdrawal/candidate/${postId}/cancel`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          // You may need to include a body if the API expects one
          body: JSON.stringify({
            postId: postId,
            userId: loggedInUserId,
          }),
        })
          .then(async (res) => {
            // Log the complete response for debugging
            console.log("Cancel nomination response status:", res.status)

            if (!res.ok) {
              const errorData = await res.json().catch((e) => ({}))
              console.log("Error data:", errorData)
              throw errorData
            }
            return res.json()
          })
          .then((data) => {
            console.log("Cancel success data:", data)
            setSuccessMessage("আপনার অনুরোধ বাতিল করা হয়েছে!")
            setHasNomination(false)
            setNominatedPostId(null)
            fetchElectionDetails()
          })
          .catch((error) => {
            console.error("Complete error object:", error)

            // Try an alternative endpoint if the first one fails
            return fetch(`https://bnp-api-9oht.onrender.com/election/cancel-nomination/${postId}/cancel`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                postId: postId,
              }),
            })
              .then(async (res) => {
                if (!res.ok) {
                  const fallbackErrorData = await res.json().catch((e) => ({}))
                  throw fallbackErrorData
                }
                return res.json()
              })
              .then((data) => {
                setSuccessMessage("আপনার অনুরোধ বাতিল করা হয়েছে!")
                setHasNomination(false)
                setNominatedPostId(null)
                fetchElectionDetails()
              })
              .catch((fallbackError) => {
                console.error("Error canceling nomination (fallback):", fallbackError)
                setErrorMessage("অনুরোধ বাতিল করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।")
              })
          })
      }
    })
  }

  const handleWithdrawal = (postId) => {
    clearMessages()

    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "আপনি কি সত্যিই এই পদ থেকে প্রার্থিতা প্রত্যাহার করতে চান?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, প্রত্যাহার করি",
      cancelButtonText: "না, বাতিল করি",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://bnp-api-9oht.onrender.com/election/request-withdrawal/candidate/${postId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then(async (res) => {
            if (!res.ok) {
              const errorData = await res.json()
              throw errorData
            }
            return res.json()
          })
          .then((data) => {
            setSuccessMessage("আপনার প্রার্থিতা প্রত্যাহার সফল হয়েছে!")
            setHasNomination(false)
            setNominatedPostId(null)
            fetchElectionDetails()
          })
          .catch((error) => {
            console.error("Error withdrawing nomination:", error)
            setErrorMessage("প্রার্থিতা প্রত্যাহার করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।")
          })
      }
    })
  }

  const getNomineeStatus = (post) => {
    if (!post.nominees) return null
    return post.nominees.find((nominee) => nominee.userId === loggedInUserId)
  }

  const renderActionButton = (post) => {
    const nomineeStatus = getNomineeStatus(post)

    if (nomineeStatus) {
      return (
        <div className="flex flex-col  sm:flex-row items-center gap-2">
          <div
            className={`text-sm font-medium  ${
              nomineeStatus.status === "PENDING"
                ? "text-yellow-600"
                : nomineeStatus.status === "APPROVED"
                  ? "text-green-600"
                  : "text-red-600"
            }`}
          >
            {nomineeStatus.status === "PENDING" && (
              <>
                <span className="mr-2 ">অপেক্ষমান</span>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                  onClick={() => handleCancelNomination(post.id)}
                >
                  ক্যান্সেল
                </button>
              </>
            )}
            {nomineeStatus.status === "APPROVED" && (
              <>
                <span className="mr-2">অনুমোদিত</span>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                  onClick={() => handleWithdrawal(post.id)}
                >
                  প্রত্যাহার
                </button>
              </>
            )}
            {nomineeStatus.status === "REJECTED" && <span>প্রত্যাখ্যাত</span>}
          </div>
        </div>
      )
    }

    // Show nomination button if user hasn't nominated or if this is the same post they're trying again
    // If user already has a nomination for another post, disable this button
    const isOtherPostNominated = hasNomination && nominatedPostId !== post.id
    
    return (
      <button
        className={`${
          isOtherPostNominated 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-green-600 hover:bg-green-700"
        } text-white px-4 py-2 rounded transition-colors`}
        onClick={() => handleNominationRequest(post.id)}
        disabled={isOtherPostNominated}
        title={isOtherPostNominated ? "আপনি ইতিমধ্যে অন্য পদে নির্বাচন করেছেন" : ""}
      >
        {isOtherPostNominated ? "অন্য পদে নির্বাচিত" : "নির্বাচন করুন"}
      </button>
    )
  }

  if (loading) {
    return (
      <div className="text-center text-blue-600 p-4">
        <UniversalLoading text="তথ্য লোড হচ্ছে..." />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6">
      {electionDetails && (
        <div className="mb-6">
          <h1 className="text-center text-red-600 text-2xl md:text-3xl font-bold mb-4">{electionDetails.title}</h1>

          <div className="bg-green-100 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">আরম্ভের তারিখ ও সময়:</p>
                <p>{formatDateTimeBengali(electionDetails.startDate)}</p>
              </div>
              <div>
                <p className="font-semibold">শেষের তারিখ ও সময়:</p>
                <p>{formatDateTimeBengali(electionDetails.endDate)}</p>
              </div>
              <div>
                <p className="font-semibold">প্রত্যাহারের শেষ তারিখ ও সময়:</p>
                <p>
                  {electionDetails.posts && electionDetails.posts.length > 0
                    ? formatDateTimeBengali(electionDetails.posts[0].withdrawUntil)
                    : "তারিখ নেই"}
                </p>
              </div>
            </div>
          </div>
          
          {hasNomination && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              <p className="font-semibold">বিশেষ বিজ্ঞপ্তি:</p>
              <p>আপনি ইতিমধ্যে একটি পদে নির্বাচন করেছেন। একজন ব্যবহারকারী শুধুমাত্র একটি পদে নির্বাচন করতে পারবেন। অন্য পদে নির্বাচন করতে আগের নির্বাচন বাতিল করুন।</p>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-bold mb-2 md:mb-0">নির্বাচনের পদের তালিকা</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          onClick={fetchElectionDetails}
        >
          রিফ্রেশ করুন
        </button>
      </div>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{errorMessage}</div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {electionPosts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-200 text-center">
                <th className="p-3 md:p-4 border border-gray-300 font-semibold">পদের নাম</th>
                <th className="p-3 md:p-4 border border-gray-300 font-semibold">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {electionPosts.map((post) => (
                <tr key={post.id} className="bg-green-100 hover:bg-green-50 transition-colors">
                  <td className="p-3 md:p-4 border border-gray-300">{post.name}</td>
                  <td className="p-3 md:p-4 border border-gray-300">{renderActionButton(post)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-red-600">কোন পোস্ট পাওয়া যায়নি।</p>
      )}
    </div>
  )
}

export default Nomination