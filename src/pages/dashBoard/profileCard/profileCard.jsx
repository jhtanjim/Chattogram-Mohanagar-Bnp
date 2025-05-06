import { useRef, useState, useEffect } from "react";
import Barcode from "react-barcode";
import { useUserData } from "../../../hooks/useUserData";
import UniversalLoading from "../../../Components/UniversalLoading";
import { Link } from "react-router-dom";

const BASE_URL = "https://bnp-api-9oht.onrender.com";

const ProfileCard = () => {
  const { userData, refetch } = useUserData();
  const cardRef = useRef();
  const [transactionId, setTransactionId] = useState("");
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const checkPendingPayment = async () => {
    if (userData && userData.id) {
      try {
        const response = await fetch(`${BASE_URL}/user/id-card/payment`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });

        // Check if response is successful and has content
        if (response.ok && response.status !== 204) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            setPaymentDetails(data);
           
          }
        } else {
          // If no payment found, make sure to clear payment details
          setPaymentDetails(null);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    }
  };

  useEffect(() => {
    checkPendingPayment();
  }, [userData]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPaymentError("");
    try {
      const response = await fetch(`${BASE_URL}/user/id-card/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ transactionId: transactionId })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Payment verification failed");
      }
      
      // Update the payment details state immediately
      setPaymentDetails({
        transactionId: transactionId,
        status: "PENDING"
      });
      
      // Refresh user data to ensure we have the latest state
      await refetch();
      
      // Also check pending payment again to ensure we have the latest payment status
      await checkPendingPayment();
      
    } catch (error) {
      setPaymentError(error.message || "Payment verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelPayment = async () => {
    if (!paymentDetails) return;

    try {
      const response = await fetch(`${BASE_URL}/user/id-card/payment`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (response.ok) {
        setPaymentDetails(null);
        await refetch();
        await checkPendingPayment();
      }
    } catch (error) {
      console.error("Error cancelling payment:", error);
    }
  };

  if (!userData) {
    return <UniversalLoading text="আইডি কার্ড লোড হচ্ছে" />;
  }

  // Payment Pending View
  if (paymentDetails && paymentDetails.status === "PENDING") {
    return (
      <div className="max-w-[700px] w-full mx-auto px-4 my-10 text-center">
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-300 shadow-md">
          <h2 className="text-xl sm:text-2xl font-bold text-yellow-600 mb-4">পেমেন্ট অপেক্ষাধীন</h2>
          <div className="mb-6">
            <p className="mt-4">আপনার পেমেন্ট প্রক্রিয়াধীন। অ্যাডমিন অনুমোদনের জন্য অপেক্ষা করুন।</p>
            <p className="mt-2 text-sm">ট্রাঞ্জিকশান আইডি: {paymentDetails.transactionId}</p>
          </div>
          <button 
            onClick={handleCancelPayment}
            className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg"
          >
            পেমেন্ট বাতিল করুন
          </button>
        </div>
      </div>
    );
  }

  // If user hasn't paid for ID card, show payment form directly on the page
  if (!userData.hasPaidForIdCard) {
    return (
      <div className="max-w-[700px] w-full mx-auto px-4 my-10 text-center">
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-300 shadow-md">
          <h2 className="text-xl sm:text-2xl font-bold text-red-700 mb-4">ট্রাঞ্জিকশান আইডি</h2>
          
          <form onSubmit={handlePaymentSubmit} className="max-w-md mx-auto">
            <div className="mb-4">
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                disabled={isSubmitting}
                placeholder="ট্রাঞ্জিকশান আইডি"
              />
            </div>
            
            {paymentError && (
              <div className="text-red-600 mb-4">{paymentError}</div>
            )}
            
            <div className="flex gap-2 justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? "অপেক্ষা করুন..." : "জমা দিন"}
              </button>
             <Link to={"/dashboard"}> <button
                type="button"
                className={`bg-red-600 duration-300 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg`}
              >
                Close
              </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // If user has paid, show the ID card
  return (
    <div className="max-w-[700px] w-full mx-auto px-4 my-6 sm:my-10">
      <div
        ref={cardRef}
        className="border px-3 sm:px-6 py-4 bg-white rounded-lg border-black relative"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 mb-4">
          <div className="relative overflow-hidden rounded-full">
            <img
              className="w-16 h-16 sm:w-20 sm:h-20"
              src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_Bangladesh_Nationalist_Party.svg"
              alt="Bangladesh Nationalist Party Flag"
              style={{ objectFit: "cover" }}
            />
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-red-700 text-center my-2 sm:my-0">
            বাংলাদেশ জাতীয়তাবাদী দল
          </h1>

          <div className="relative overflow-hidden rounded-full">
            <img
              className="w-16 h-16 sm:w-20 sm:h-20"
              src="https://projonmonews24.com/uploads/news/18250/1509170062.jpg"
              alt="Party Flag"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>

        {/* ID Section */}
        <div className="flex flex-col sm:flex-row mx-2 sm:mx-4 justify-between gap-4 items-center">
          <div className="my-2 sm:my-4 font-bold text-center sm:text-left">
            <p>আইডি নং : {userData.partyId || "N/A"}</p>
          </div>
          <div className="flex justify-center">
            <Barcode
              className="max-w-full"
              value={userData.partyId?.slice(-8) || "00000000"}
              width={1.5}
              height={30}
              displayValue={false}
            />
          </div>
        </div>

        {/* Profile Details */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center mt-2">
          <div className="w-full md:w-auto flex justify-center">
            <img
              src={userData.image || "https://via.placeholder.com/150"}
              alt="Profile"
              className="h-40 w-40 sm:h-48 sm:w-40 md:h-52 md:w-44 object-cover border-2 border-black/10 rounded-md"
            />
          </div>
          
          <div className="flex-1 space-y-2 sm:space-y-3 font-bold w-full">
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <span className="min-w-[80px] sm:min-w-[100px]">নাম</span>
              <span className="flex-1">: {userData.fullName || "N/A"}</span>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <span className="min-w-[80px] sm:min-w-[100px]">সদস্য ধরন</span>
              <span className="flex-1 text-green-600">
                : সাধারণ সদস্য
              </span>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <span className="min-w-[80px] sm:min-w-[100px]">ইউনিট</span>
              <span className="flex-1 text-red-600">
                : চট্টগ্রাম মহানগর
              </span>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <span className="min-w-[80px] sm:min-w-[100px]">থানা</span>
              <span className="flex-1">: {userData.thana || "N/A"}</span>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <span className="min-w-[80px] sm:min-w-[100px]">ওয়ার্ড</span>
              <span className="flex-1">: {userData.ward || "N/A"}</span>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <span className="min-w-[80px] sm:min-w-[100px]">ইস্যু তারিখ</span>
              <span className="flex-1">
                :{" "}
                {userData.updatedAt
                  ? new Date(userData.updatedAt).toISOString().split("T")[0]
                  : "Not Provided"}
              </span>
            </div>

            <div className="mt-2">
              <span className="text-xs">
                এই কার্ডটি শুধুমাত্র বি এন পির সাংগঠনিক কর্মকান্ডের জন্য
                প্রযোজ্য
              </span>
            </div>
          </div>
        </div>

        {/* Decorative Paddy - Adjusted size for smaller screens */}
        <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-40 sm:h-40 md:w-64 md:h-64 opacity-20 pointer-events-none">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/02/Bangladesh_Nationalist_Party_Election_Symbol.svg"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;