import { useEffect, useState, useRef } from "react";
import Barcode from "react-barcode"; // Import Barcode library
import { FaDownload } from "react-icons/fa";
import { useAuth } from "../../../contexts/AuthContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ProfileCard = () => {
  const { user } = useAuth(); // Fetching user data from AuthContext
  const cardRef = useRef(); // Reference to the ID card
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
        name: user.fullName || "N/A",
        id: user.partyId || "N/A",
        email: user.email || "N/A",
        phone: user.mobile || "N/A",
        nid: user.nid || "N/A",
        birthDate: user.created_at || "Not Provided",
        politicalPosition: user.userType || "N/A",
        ward: user.ward || "N/A",
        thana: user.thana || "N/A",
        mahanagar: user.mohanagar || "N/A",
        pollingCenter: user.electionCenter || "N/A",
        img: user.image || "https://via.placeholder.com/150",
      });
    }
  }, [user]);

  const downloadPDF = () => {
    const cardElement = cardRef.current;

    html2canvas(cardElement, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("portrait", "pt", "a4");

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${profileData.name}_ID_Card.pdf`);
    });
  };

  return (
    <div className="max-w-[700px] lg:mx-auto mx-4 my-10">
      <div
        ref={cardRef}
        className="border px-6 py-4 bg-white rounded-lg border-black"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <div className=" relative overflow-hidden rounded-full">
            <img
              className="w-20 h-20"
              src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_Bangladesh_Nationalist_Party.svg"
              alt="Bangladesh Nationalist Party Flag"
              style={{ objectFit: "cover" }}
            />
          </div>

          <h1 className="lg:text-xl md:text-3xl font-bold text-red-700 text-center">
            বাংলাদেশ জাতীয়তাবাদী দল
          </h1>

          <div className=" relative overflow-hidden rounded-full">
            <img
              className="w-20 h-20"
              src="https://projonmonews24.com/uploads/news/18250/1509170062.jpg"
              alt="Party Flag"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>

        {/* ID Section */}
        <div className="flex flex-col sm:flex-row mx-4 justify-between gap-4">
          <div className="my-4 font-bold">
            <p>আইডি নং : {profileData.id}</p>
          </div>
          <div className="flex justify-center">
            <Barcode
              className="max-w-full"
              value={profileData.id.slice(-8) || "00000000"}
              width={2.2}
              height={40}
              displayValue={false}
            />
          </div>
        </div>

        {/* Profile Details */}
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <img
            src={profileData.img}
            alt="Profile"
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
            <div>
              <span className="text-xs">
                এই কার্ডটি শুধুমাত্র বি এন পির সাংগঠনিক কর্মকান্ডের জন্য
                প্রযোজ্য
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="my-4">
        <button
          className="w-full text-green-700 hover:text-yellow-500 font-bold py-2 px-4 rounded-lg"
          onClick={downloadPDF}
        >
          <FaDownload className="inline-block mr-2" />
          আইডি কার্ড ডাউনলোড
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
