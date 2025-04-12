"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import UniversalLoading from "../../../Components/UniversalLoading"

export default function Elections() {
  const [elections, setElections] = useState([]) // State to store all elections
  const [errorMessage, setErrorMessage] = useState("") // State for error messages
  const [loading, setLoading] = useState(true) // State for loading indicator

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
        const filteredElection = data.filter((e) => e.state === "RUNNING")
        console.log(data)
        setElections(filteredElection) // Store the fetched elections data
        setLoading(false) // Stop the loading indicator
      })
      .catch((error) => {
        console.error("Error fetching elections:", error)
        setErrorMessage("ইলেকশন ডেটা লোড করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।")
        setLoading(false) // Stop loading even if there's an error
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

  return (
    <div className="p-4 md:p-6">
      {loading ? (
        <div className="text-center text-blue-600">
          <UniversalLoading text="তথ্য লোড হচ্ছে..." />
        </div>
      ) : errorMessage ? (
        <p className="text-center text-red-600">{errorMessage}</p>
      ) : elections.length > 0 ? (
        <>
          <h1 className="text-center text-red-600 text-2xl md:text-3xl font-bold mb-6">চলমান নির্বাচন সমূহ</h1>

          {/* Responsive table container with horizontal scroll for small screens */}
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
                        to={`/elections/${election.id}`}
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
        </>
      ) : (
        <p className="text-center text-red-600">কোন তথ্য পাওয়া যায়নি।</p>
      )}
    </div>
  )
}

