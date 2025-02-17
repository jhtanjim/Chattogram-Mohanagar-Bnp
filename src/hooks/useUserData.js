// import { useState, useEffect } from "react";

// export function useUserData() {
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isVerifier, setIsVerifier] = useState(false);
//   const [isThanaVerifier, setIsThanaVerifier] = useState(false);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await fetch(
//           "https://bnp-api-9oht.onrender.com/user/me",
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch user data");
//         }
//         const data = await response.json();
//         setUserData(data);
//         setIsVerifier(data?.roles.includes("VERIFIER"));
//         setIsThanaVerifier(data?.roles.includes("THANA_VERIFIER"));
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "An error occurred");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   return { userData, loading, error, isVerifier, isThanaVerifier };
// }
// "use client";

// import { useState, useEffect } from "react";

// export function useUserData() {
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isVerifier, setIsVerifier] = useState(false);
//   const [isThanaVerifier, setIsThanaVerifier] = useState(false);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await fetch(
//           "https://bnp-api-9oht.onrender.com/user/me",
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch user data");
//         }
//         const data = await response.json();

//         setUserData(data);

//         // Ensure roles is an array before calling includes()
//         const roles = Array.isArray(data.roles) ? data.roles : [];

//         setIsVerifier(roles.includes("VERIFIER"));
//         setIsThanaVerifier(roles.includes("THANA_VERIFIER"));
//       } catch (err) {
//         setError(err.message || "An error occurred");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   return { userData, loading, error, isVerifier, isThanaVerifier };
// }
"use client";

import { useState, useEffect, useCallback } from "react";

export function useUserData() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVerifier, setIsVerifier] = useState(false);
  const [isThanaVerifier, setIsThanaVerifier] = useState(false);

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://bnp-api-9oht.onrender.com/user/me",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();

      setUserData(data);

      // Ensure roles is an array before calling includes()
      const roles = Array.isArray(data.roles) ? data.roles : [];

      setIsVerifier(roles.includes("VERIFIER"));
      setIsThanaVerifier(roles.includes("THANA_VERIFIER"));
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return {
    userData,
    loading,
    error,
    isVerifier,
    isThanaVerifier,
    refetch: fetchUserData,
  };
}
