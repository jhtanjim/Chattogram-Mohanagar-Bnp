"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import UniversalLoading from "../../../Components/UniversalLoading"

const CandidateList = () => {
  const [elections, setElections] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

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
          throw new Error("Failed to fetch data")
        }
        return res.json()
      })
      .then((data) => {
        const filteredElection = data.filter((e) => e.state === "SCHEDULED")
        console.log(filteredElection)
        setElections(filteredElection) // Store the fetched elections data
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching elections:", error)
        setErrorMessage("ডেটা লোড করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।")
        setLoading(false)
      })
  }, [])

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

  if (loading) {
    return (
      <div className="text-center text-blue-600 p-4">
        <UniversalLoading text="তথ্য লোড হচ্ছে..." />
      </div>
    )
  }

  if (errorMessage) {
    return <p className="text-center text-red-600 p-4">{errorMessage}</p>
  }

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-center text-red-600 text-2xl md:text-3xl font-bold mb-6">নির্ধারিত নির্বাচন সমূহ</h2>

      {elections.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-200 text-center">
                <th className="p-3 md:p-4 border border-gray-300 font-semibold">নির্বাচন শিরোনাম</th>
                <th className="p-3 md:p-4 border border-gray-300 font-semibold">আরম্ভের তারিখ ও সময়</th>
                <th className="p-3 md:p-4 border border-gray-300 font-semibold">শেষের তারিখ ও সময়</th>
                <th className="p-3 md:p-4 border border-gray-300 font-semibold">প্রত্যাহারের শেষ তারিখ ও সময়</th>
                <th className="p-3 md:p-4 border border-gray-300 font-semibold">বিস্তারিত</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {elections.map((election) => (
                <tr key={election.id} className="bg-green-100  transition-colors">
                  <td className="p-3 md:p-4 border border-gray-300">{election.title}</td>
                  <td className="p-3 md:p-4 border border-gray-300">{formatDateTimeBengali(election.startDate)}</td>
                  <td className="p-3 md:p-4 border border-gray-300">{formatDateTimeBengali(election.endDate)}</td>
                  <td className="p-3 md:p-4 border border-gray-300">
                    {election.posts && election.posts.length > 0
                      ? formatDateTimeBengali(election.posts[0].withdrawUntil)
                      : "তারিখ নেই"}
                  </td>
                  <td className="p-3 md:p-4 border border-gray-300 text-center">
                    <Link
                      to={`/nomination/${election.id}`}
                      className="inline-block py-2 px-4 md:px-5 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                    >
                      বিস্তারিত দেখুন
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-red-600">কোন তথ্য পাওয়া যায়নি।</p>
      )}
    </div>
  )
}

export default CandidateList

