import { useState, useEffect } from "react";
import UpdateProfile from "../updateProfile/updateProfile";
import { useAuth } from "../../../contexts/AuthContext";

const MyProfile = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  console.log(user);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [profileData, setProfileData] = useState({
    name: "",
    id: "",
    email: "",
    phone: "",
    nid: "",
    birthDate: "",
    politicalPosition: "",
    ward: "",
    thana: "",
    mahanagar: "",
    PollingCenter: "",
    image: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.fullName,
        id: user.partyId,
        email: user.email,
        phone: user.mobile,
        nid: user.nid,
        birthDate: user.birthDate || "Not Provided",
        politicalPosition: user.userType,
        ward: user.ward,
        thana: user.thana,
        mahanagar: user.mohanagar,
        PollingCenter: user.electionCenter,
        image: user.image,
      });
    }
  }, [user]);

  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-300">
      <span className="text-gray-600 font-bold">{label} :</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );

  return (
    <div className="my-8 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#e6e6e6] rounded-3xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md">
              <img
                src={profileData.image || "/default-profile.png"} // Fallback image
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold">{profileData.name}</h2>
          </div>

          <div className="space-y-2">
            <InfoRow label="আইডি" value={profileData.id} />
            <InfoRow label="ইমেইল" value={profileData.email} />
            <InfoRow label="ফোন নম্বর" value={profileData.phone} />
            <InfoRow label="এনআইডি নম্বর" value={profileData.nid} />
            <InfoRow label="জন্ম তারিখ" value={profileData.birthDate} />
            <InfoRow
              label="রাজনৈতিক পদবি"
              value={profileData.politicalPosition}
            />
            <InfoRow label="ওয়ার্ড" value={profileData.ward} />
            <InfoRow label="থানা" value={profileData.thana} />
            <InfoRow label="মহানগর" value={profileData.mahanagar} />
            <InfoRow
              label="নির্বাচনী কেন্দ্র"
              value={profileData.PollingCenter}
            />
          </div>
        </div>

        <div className="px-6 pb-4">
          <button
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium"
            onClick={openModal} // Open modal on button click
          >
            প্রোফাইল সম্পাদনা করুন
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
            <UpdateProfile closeModal={closeModal} />{" "}
            {/* Pass closeModal to UpdateProfile */}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
