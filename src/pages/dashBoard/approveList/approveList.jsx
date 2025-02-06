"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useUserData } from "../../../hooks/useUserData";

const ApproveList = () => {
  const [users, setUsers] = useState([]);
  const [approvingUserId, setApprovingUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const totalPages = Math.ceil(users.length / usersPerPage);
  const { isVerifier, isThanaVerifier } = useUserData();
  const [userToken, setUserToken] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setUserToken(token || "");
  }, []);

  useEffect(() => {
    if (userToken && (isVerifier || isThanaVerifier)) {
      fetchUsers();
    }
  }, [userToken, isVerifier, isThanaVerifier]); // Fetch users when roles and token are ready

  const fetchUsers = async () => {
    if (!userToken) return;

    try {
      const endpoint = isVerifier
        ? "https://bnp-api-9oht.onrender.com/user/unverified"
        : isThanaVerifier
        ? "https://bnp-api-9oht.onrender.com/user/unapproved"
        : null;

      if (!endpoint) return;

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const approveUser = async (userId, userImage) => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই ব্যবহারকারীকে অনুমোদন করতে চান?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      imageUrl: userImage || "https://via.placeholder.com/150",
      imageWidth: 80,
      imageHeight: 80,
      confirmButtonText: "হ্যাঁ, অনুমোদন করুন",
      cancelButtonText: "না",
    });

    if (result.isConfirmed) {
      setApprovingUserId(userId);
      try {
        const endpoint = isVerifier
          ? `https://bnp-api-9oht.onrender.com/user/${userId}/verify`
          : isThanaVerifier
          ? `https://bnp-api-9oht.onrender.com/user/${userId}/approve`
          : null;

        if (!endpoint) return;

        const response = await fetch(endpoint, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ isVerified: true }),
        });

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "সফল!",
            text: "ব্যবহারকারী অনুমোদিত হয়েছে।",
            imageUrl: userImage || "https://via.placeholder.com/150",
            imageWidth: 100,
            imageHeight: 100,
            confirmButtonColor: "#28a745",
          });

          setUsers(users.filter((user) => user.id !== userId));
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Approval failed");
        }
      } catch (error) {
        console.error("Error approving user:", error);

        Swal.fire({
          icon: "error",
          title: "ব্যর্থ!",
          text: `ব্যবহারকারী অনুমোদন ব্যর্থ হয়েছে: ${error.message}`,
          confirmButtonColor: "#d33",
        });
      } finally {
        setApprovingUserId(null);
      }
    }
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const currentUsers = users.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4 my-24">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        অনুমোদন তালিকা
      </h2>
      {users.length === 0 ? (
        <p className="text-center">No unverified users found.</p>
      ) : (
        <>
          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-100">
                <tr>
                  <th className="text-center border p-2">নাম</th>
                  <th className="text-center border p-2">মোবাইল</th>
                  <th className="text-center border p-2">কেন্দ্রের নাম</th>
                  <th className="text-center border p-2">স্থানীয় নেতার নাম</th>
                  <th className="text-center border p-2">অনুমোদন</th>
                </tr>
              </thead>
              <tbody className="border bg-green-50 text-center">
                {currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="border p-2">{user.fullName || "N/A"}</td>
                    <td className="border p-2">{user.mobile || "N/A"}</td>
                    <td className="border p-2">
                      {user.electionCenter || "N/A"}
                    </td>
                    <td className="border p-2">{user.country || "N/A"}</td>
                    <td className="border p-2">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => approveUser(user.id, user.image)}
                          className={`px-4 py-1 text-sm rounded ${
                            approvingUserId === user.id
                              ? "bg-gray-400"
                              : "bg-green-500 hover:bg-green-600 text-white"
                          }`}
                          disabled={approvingUserId === user.id}
                        >
                          {approvingUserId === user.id
                            ? "Approving..."
                            : "অনুমোদন"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-center items-center gap-2">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
              aria-label="Previous page"
            >
              Previous
            </button>
            <span className="px-4 py-2 border rounded bg-blue-500 text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ApproveList;
