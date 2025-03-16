import { useState, useCallback, useEffect } from "react";
import UpdateProfile from "../updateProfile/updateProfile";
import { useUserData } from "../../../hooks/useUserData";
import UniversalLoading from "../../../Components/UniversalLoading";

const MyProfile = () => {
  const { userData, loading, error, refetch } = useUserData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleProfileUpdate = useCallback((updatedData) => {
    console.log("Updated profile data:", updatedData);
    closeModal();
  }, []);
  // Call refetch whenever you want to refresh the data
  useEffect(() => {
    refetch();
  }, []); // This will refetch when the component mounts
  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-300">
      <span className="text-gray-600 font-bold">{label} :</span>
      <span className="text-gray-800 text-end">{value || "N/A"}</span>
    </div>
  );

  if (loading)
    return (
      <div >
          <UniversalLoading
  text="প্রোফাইল লোড হচ্ছে" 

/>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );

  return (
    <div className="my-8 flex items-center justify-center ">
      <div className="w-full max-w-2xl bg-gray-100 rounded-3xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
              <img
                src={userData.image || "/placeholder.svg?height=80&width=80"}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {userData.fullName || "N/A"}
            </h2>
          </div>

          <div className="space-y-3">
            <InfoRow label="আইডি" value={userData.partyId} />
            <InfoRow label="ইমেইল" value={userData.email} />
            <InfoRow label="ফোন নম্বর" value={userData.mobile} />
            <InfoRow label="এনআইডি নম্বর" value={userData.nid} />
            {/* <InfoRow label="জন্ম তারিখ" value={userData.birthDate} /> */}
            <InfoRow label="সংগঠন / অঙ্গসংগঠন" value={userData.userType} />
            <InfoRow label="ওয়ার্ড" value={userData.ward} />
            <InfoRow label="থানা" value={userData.thana} />
            <InfoRow label="মহানগর" value={userData.mohanagar} />
            <InfoRow
              label="নির্বাচনী কেন্দ্র"
              value={userData.electionCenter}
            />
          </div>
        </div>

        <div className="px-6 pb-6">
          <button
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition duration-300 ease-in-out transform hover:scale-105"
            onClick={openModal}
          >
            প্রোফাইল সম্পাদনা করুন
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full transition-colors text-xl font-bold"
            >
              ×
            </button>
            <UpdateProfile
              closeModal={closeModal}
              onUpdate={handleProfileUpdate}
              initialData={userData}
              refetch={refetch}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
