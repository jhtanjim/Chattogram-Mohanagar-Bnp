import { useRef } from "react";
import Barcode from "react-barcode";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useUserData } from "../../../hooks/useUserData";

const ProfileCard = () => {
  const { userData } = useUserData(); // Fetch user data from context
  const cardRef = useRef(); // Reference to the ID card

  // Function to download the ID card as a PDF
  const downloadPDF = () => {
    const cardElement = cardRef.current;

    html2canvas(cardElement, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("portrait", "pt", "a4");

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${userData?.fullName}_ID_Card.pdf`);
    });
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[700px] lg:mx-auto mx-4 my-10">
      <div
        ref={cardRef}
        className="border px-6 py-4 bg-white rounded-lg border-black relative"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <div className="relative overflow-hidden rounded-full">
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

          <div className="relative overflow-hidden rounded-full">
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
            <p>আইডি নং : {userData.partyId || "N/A"}</p>
          </div>
          <div className="flex justify-center">
            <Barcode
              className="max-w-full"
              value={userData.partyId?.slice(-8) || "00000000"}
              width={2.2}
              height={40}
              displayValue={false}
            />
          </div>
        </div>

        {/* Profile Details */}
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <img
            src={userData.image || "https://via.placeholder.com/150"}
            alt="Profile"
            className="h-52 w-44 object-cover border-2 border-black/10 rounded-md mx-auto md:mx-0"
          />
          <div className="flex-1 space-y-3 font-bold">
            <div className="flex flex-wrap md:flex-nowrap gap-4">
              <span className="min-w-[100px]">নাম</span>
              <span>: {userData.fullName || "N/A"}</span>
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-4">
              <span className="min-w-[100px]">সদস্য ধরণ</span>
              <span className="text-green-600">
                : {userData.userType || "N/A"}
              </span>
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-4">
              <span className="min-w-[100px]">ইউনিট</span>
              <span className="text-red-600">
                : {userData.mohanagar || "N/A"}
              </span>
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-4">
              <span className="min-w-[100px]">থানা</span>
              <span>: {userData.thana || "N/A"}</span>
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-4">
              <span className="min-w-[100px]">ওয়ার্ড</span>
              <span>: {userData.ward || "N/A"}</span>
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-4">
              <span className="min-w-[100px]">ইস্যু তারিখ</span>
              <span>: {userData.updatedAt || "Not Provided"}</span>
            </div>
            <div>
              <span className="text-xs">
                এই কার্ডটি শুধুমাত্র বি এন পির সাংগঠনিক কর্মকান্ডের জন্য
                প্রযোজ্য
              </span>
            </div>
          </div>
        </div>

        {/* Decorative Paddy */}
        {/* Decorative Paddy */}
        <div className="absolute bottom-0 right-0 w-48 h-48 md:w-64 md:h-64 opacity-20 pointer-events-none">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/02/Bangladesh_Nationalist_Party_Election_Symbol.svg"
            alt=""
            className="w-full h-full object-contain"
          />
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
