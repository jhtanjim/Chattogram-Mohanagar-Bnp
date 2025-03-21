"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UniversalLoading from "../../../Components/UniversalLoading";

export default function Elections() {
  const [elections, setElections] = useState([]); // State to store all elections
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const [loading, setLoading] = useState(true); // State for loading indicator

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
        const filteredElection = data.filter((e) => e.state === "RUNNING");
        console.log(data);
        setElections(filteredElection); // Store the fetched elections data
        setLoading(false); // Stop the loading indicator
      })
      .catch((error) => {
        console.error("Error fetching elections:", error);
        setErrorMessage(
          "ইলেকশন ডেটা লোড করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।"
        );
        setLoading(false); // Stop loading even if there's an error
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      {loading ? (
        <div style={{ textAlign: "center", color: "blue" }}>
          <UniversalLoading text="তথ্য লোড হচ্ছে..." />
        </div>
      ) : errorMessage ? (
        <p style={{ textAlign: "center", color: "red" }}>{errorMessage}</p>
      ) : elections.length > 0 ? (
        <>
          <h1 style={{ textAlign: "center", color: "red" }}>
            চলমান নির্বাচন সমূহ
          </h1>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#90ee90", textAlign: "left" }}>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  নির্বাচন শিরোনাম
                </th>
                {/* <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  পদের নাম
                </th> */}
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  বিস্তারিত
                </th>
              </tr>
            </thead>
            <tbody>
              {elections.map((election) => (
                <tr key={election.id} style={{ backgroundColor: "#d4f4d4" }}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {election.title}
                  </td>
                
                  <td
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    <Link
                      to={`/elections/${election.id}`}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        textDecoration: "none",
                      }}
                    >
                      বিস্তারিত দেখুন
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p style={{ textAlign: "center", color: "red" }}>
          কোন তথ্য পাওয়া যায়নি।
        </p>
      )}
    </div>
  );
}
