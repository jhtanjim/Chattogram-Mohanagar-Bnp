import { useEffect, useState } from "react";
import Barcode from "react-barcode"; // Import Barcode library
import { FaDownload } from "react-icons/fa";
import { useAuth } from "../../../contexts/AuthContext";

const ProfileCard = () => {
  const { user } = useAuth(); // Fetching user data from AuthContext
  console.log(user);

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
    pollingCenter: "",
    img: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.fullName || "N/A", // 'full_name' from API data
        id: user.partyId || "N/A", // 'userId' from API data
        email: user.email || "N/A",
        phone: user.mobile || "N/A", // 'mobile' from API data
        nid: user.nid || "N/A",
        birthDate: user.created_at || "Not Provided", // Use created_at as a placeholder for birthDate
        politicalPosition: user.userType || "N/A", // 'user_type' from API data
        ward: user.ward || "N/A", // 'wardId' from API data
        thana: user.thana || "N/A", // 'thanaId' from API data
        mahanagar: user.mohanagar || "N/A", // 'mohanagarId' from API data
        pollingCenter: user.electionCenter || "N/A",
        img: user.image || "https://via.placeholder.com/150", // Default img if not found
      });
    }
  }, [user]);

  return (
    <div className="max-w-[700px] lg:mx-auto mx-4 my-10">
      <div className="border px-6 py-4 bg-white rounded-lg border-black">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <div className="w-20 h-20 relative overflow-hidden rounded-full">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_Bangladesh_Nationalist_Party.svg"
              alt="Bangladesh Nationalist Party Flag"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          <h1 className="lg:text-xl md:text-3xl font-bold text-red-700 text-center">
            বাংলাদেশ জাতীয়তাবাদী দল
          </h1>

          <div className="w-20 h-20 relative overflow-hidden rounded-full">
            <img
              src="https://projonmonews24.com/uploads/news/18250/1509170062.jpg"
              alt="Party Flag"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </div>

        {/* ID Section */}
        <div className="flex flex-col sm:flex-row mx-4 justify-between gap-4">
          <div className="my-4 font-bold">
            <p className="">আইডি নং : {profileData.id}</p>
          </div>
          <div className="flex justify-center">
            {/* Render the barcode */}
            <Barcode
              className="max-w-full"
              value={profileData.id.slice(-8) || "00000000"} // Use the last 8 digits of the ID
              width={2.2}
              height={40}
              displayValue={false} // Hides the value below the barcode
            />
          </div>
        </div>

        {/* Profile Details */}
        <div
          className="flex flex-col md:flex-row gap-6 items-center relative"
          style={{
            backgroundColor: "white", // Set background color to white
          }}
        >
          {/* Background img Wrapper */}
          <div
            className="absolute inset-0"
            style={{
              backgroundimg:
                'url("https://upload.wikimedia.org/wikipedia/commons/0/02/Bangladesh_Nationalist_Party_Election_Symbol.svg")',
              backgroundPosition: "bottom right",
              backgroundSize: "auto 200px", // Adjust height of background img
              backgroundRepeat: "no-repeat",
              opacity: 0.2, // Decrease opacity for background img only
            }}
          ></div>

          {/* Profile Content */}
          <img
            src={profileData.img}
            alt="Profile img"
            className="h-52 w-44 object-cover border-2 border-black/10 rounded-md mx-auto md:mx-0"
          />
          <div className="flex-1 space-y-3 font-bold">
            <div className="flex flex-wrap md:flex-nowrap gap-4">
              <span className="min-w-[100px]">নাম</span>
              <span>: {profileData.name}</span>
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-4">
              <span className="min-w-[100px]">সদস্য ধরণ</span>
              <span className="text-green-600">
                : {profileData.politicalPosition}
              </span>
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-4">
              <span className="min-w-[100px]">ইউনিট</span>
              <span className="text-red-600">: {profileData.mahanagar}</span>
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-4">
              <span className="min-w-[100px]">থানা</span>
              <span>: {profileData.thana}</span>
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-4">
              <span className="min-w-[100px]">ওয়ার্ড</span>
              <span>: {profileData.ward}</span>
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-4">
              <span className="min-w-[100px]">ইস্যু তারিখ</span>
              <span>: {profileData.birthDate}</span>
            </div>
            <div className="">
              <span className="text-xs">
                এই কার্ডটি শুধুমাত্র বি এন পির সাংগঠনিক কর্মকান্ডের
                জন্য প্রযোজ্য
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="my-2">
        <button
          className="w-full text-green-700 hover:text-yellow-500 font-bold py-2 px-4 rounded-lg"
          onClick={() => setIsEditing(true)}
        >
          আইডি কার্ড ডাউনলোড
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
