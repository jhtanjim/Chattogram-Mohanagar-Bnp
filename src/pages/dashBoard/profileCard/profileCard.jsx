import { useRef, useState, useEffect } from "react";
import Barcode from "react-barcode";
import { useUserData } from "../../../hooks/useUserData";
import UniversalLoading from "../../../Components/UniversalLoading";

const ProfileCard = () => {
  const { userData, refetchUserData } = useUserData();
  const cardRef = useRef();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(() => {
    // Only restore submission state if it belongs to the current user
    const storedState = localStorage.getItem("bnp_payment_processing");
    const storedUserId = localStorage.getItem("bnp_payment_user_id");
    // We'll check if userId matches after userData loads
    return storedState === "true";
  });
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Effect to validate stored payment state belongs to current user
  useEffect(() => {
    if (userData && userData.id) {
      const storedUserId = localStorage.getItem("bnp_payment_user_id");
      
      // If the stored payment state doesn't belong to the current user, clear it
      if (storedUserId !== userData.id && isSubmitting) {
        localStorage.removeItem("bnp_payment_processing");
        localStorage.removeItem("bnp_transaction_id");
        localStorage.removeItem("bnp_payment_user_id");
        setIsSubmitting(false);
      }
    }
  }, [userData, isSubmitting]);

  // Effect to handle the payment processing state
  useEffect(() => {
    if (isSubmitting && userData?.id) {
      localStorage.setItem("bnp_payment_processing", "true");
      localStorage.setItem("bnp_payment_user_id", userData.id);
    } else if (!isSubmitting) {
      // Only remove if we're explicitly ending submission, not on initial load
      if (isSubmitting === false) { // Check it's explicitly false, not just falsy
        localStorage.removeItem("bnp_payment_processing");
      }
    }
  }, [isSubmitting, userData]);

  // Effect to check payment status when component mounts
  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (isSubmitting && userData && !userData.hasPaidForIdCard) {
        try {
          // Periodically check if the payment has been processed
          const timer = setInterval(async () => {
            await refetchUserData();
            if (userData?.hasPaidForIdCard) {
              clearInterval(timer);
              setIsSubmitting(false);
              setPaymentSuccess(true);
              // Clear localStorage when payment succeeds
              localStorage.removeItem("bnp_payment_processing");
              localStorage.removeItem("bnp_payment_user_id");
            }
          }, 5000); // Check every 5 seconds
          
          // Clean up the interval when component unmounts
          return () => clearInterval(timer);
        } catch (error) {
          console.error("Error checking payment status:", error);
          setIsSubmitting(false);
        }
      }
    };
    
    checkPaymentStatus();
  }, [isSubmitting, userData, refetchUserData]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPaymentError("");
    
    try {
      const response = await fetch(
        "https://bnp-api-9oht.onrender.com/user/id-card/payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({ transactionId: transactionId })
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Payment verification failed");
      }
      
      // Store the transaction ID for reference along with user ID
      localStorage.setItem("bnp_transaction_id", transactionId);
      localStorage.setItem("bnp_payment_user_id", userData.id);
      
      setPaymentSuccess(true);
      setTimeout(() => {
        setShowPaymentModal(false);
        refetchUserData(); // Refresh user data to update hasPaidForIdCard status
      }, 2000);
    } catch (error) {
      setPaymentError(error.message || "Payment verification failed");
      setIsSubmitting(false);
    }
  };

  // Function to get transaction ID specific to current user
  const getUserTransactionId = () => {
    const storedUserId = localStorage.getItem("bnp_payment_user_id");
    if (userData && userData.id && storedUserId === userData.id) {
      return localStorage.getItem("bnp_transaction_id") || transactionId;
    }
    return transactionId;
  };

  if (!userData) {
    return (
      <div>
        <UniversalLoading text="আইডি কার্ড লোড হচ্ছে" />
      </div>
    );
  }

  // If payment is being processed, show waiting message
  // Only show this if the current user initiated the payment
  const storedUserId = localStorage.getItem("bnp_payment_user_id");
  if (isSubmitting && !userData.hasPaidForIdCard && storedUserId === userData.id) {
    return (
      <div className="max-w-[700px] lg:mx-auto mx-4 my-10 text-center">
        <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-md">
          <h2 className="text-2xl font-bold text-red-700 mb-4">আইডি কার্ড পেমেন্ট প্রক্রিয়াধীন</h2>
          <div className="mb-6">
            {/* <UniversalLoading text="আপনার পেমেন্ট যাচাই করা হচ্ছে" /> */}
            <p className="mt-4">আপনার পেমেন্ট যাচাই করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন।</p>
            <p className="mt-2 text-sm">ট্রানজেকশন আইডি: {getUserTransactionId()}</p>
          </div>
          <h1
            // onClick={() => setIsSubmitting(false)}
            className="bg-red-500  text-white font-bold py-2 px-6 rounded-lg"
          >
            অপেক্ষা করুন
          </h1>
        </div>
      </div>
    );
  }

  // If user hasn't paid for ID card, show payment button
  if (!userData.hasPaidForIdCard) {
    return (
      <div className="max-w-[700px] lg:mx-auto mx-4 my-10 text-center">
        <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-md">
          <h2 className="text-2xl font-bold text-red-700 mb-4">আইডি কার্ড পেমেন্ট</h2>
          <p className="mb-6">আপনার আইডি কার্ড দেখতে প্যামেন্ট করে ট্রাঞ্জিকশান নাম্বার দিন
          </p>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            পেমেন্ট করুন
          </button>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">আইডি কার্ড পেমেন্ট</h3>
              
              {paymentSuccess ? (
                <div className="text-center text-green-600 mb-4">
                  <p className="font-bold">পেমেন্ট সফল হয়েছে!</p>
                  <p>আপনার আইডি কার্ড প্রদর্শিত হবে...</p>
                </div>
              ) : (
                <form onSubmit={handlePaymentSubmit}>
                  <div className="mb-4">
                    <label className="block mb-2 font-bold">ট্রানজেকশন আইডি</label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  {paymentError && (
                    <div className="text-red-600 mb-4">{paymentError}</div>
                  )}
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg"
                      disabled={isSubmitting}
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? "অপেক্ষা করুন..." : "জমা দিন"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // If user has paid, show the ID card
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

          <h1 className="lg:text-3xl md:text-3xl font-bold text-red-700 text-center">
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
              <span className="min-w-[100px]">সদস্য ধরন</span>
              <span className="text-green-600">
                : সাধারণ সদস্য
              </span>
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-4">
              <span className="min-w-[100px]">ইউনিট</span>
              <span className="text-red-600">
                : চট্টগ্রাম মহানগর
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
              <span>
                :{" "}
                {userData.updatedAt
                  ? new Date(userData.updatedAt).toISOString().split("T")[0]
                  : "Not Provided"}
              </span>
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
        <div className="absolute bottom-0 right-0 w-48 h-48 md:w-64 md:h-64 opacity-20 pointer-events-none">
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







// import { useRef, useState, useEffect } from "react";
// import Barcode from "react-barcode";
// import { useUserData } from "../../../hooks/useUserData";
// import UniversalLoading from "../../../Components/UniversalLoading";

// const ProfileCard = () => {
//   const { userData, refetchUserData } = useUserData();
//   const cardRef = useRef();
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [transactionId, setTransactionId] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(() => {
//     // Check if there's a stored submission state
//     const storedState = localStorage.getItem("bnp_payment_processing");
//     return storedState === "true";
//   });
//   const [paymentError, setPaymentError] = useState("");
//   const [paymentSuccess, setPaymentSuccess] = useState(false);

//   // Effect to handle the payment processing state
//   useEffect(() => {
//     if (isSubmitting) {
//       localStorage.setItem("bnp_payment_processing", "true");
//     } else {
//       localStorage.removeItem("bnp_payment_processing");
//     }
//   }, [isSubmitting]);

//   // Effect to check payment status when component mounts
//   useEffect(() => {
//     const checkPaymentStatus = async () => {
//       if (isSubmitting && !userData?.hasPaidForIdCard) {
//         try {
//           // Periodically check if the payment has been processed
//           const timer = setInterval(async () => {
//             await refetchUserData();
//             if (userData?.hasPaidForIdCard) {
//               clearInterval(timer);
//               setIsSubmitting(false);
//               setPaymentSuccess(true);
//             }
//           }, 5000); // Check every 5 seconds
          
//           // Clean up the interval when component unmounts
//           return () => clearInterval(timer);
//         } catch (error) {
//           console.error("Error checking payment status:", error);
//           setIsSubmitting(false);
//         }
//       }
//     };
    
//     checkPaymentStatus();
//   }, [isSubmitting, userData, refetchUserData]);

//   const handlePaymentSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setPaymentError("");
    
//     try {
//       const response = await fetch(
//         "https://bnp-api-9oht.onrender.com/user/id-card/payment",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`
//           },
//           body: JSON.stringify({ transactionId: transactionId })
//         }
//       );
      
//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.message || "Payment verification failed");
//       }
      
//       // Store the transaction ID for reference
//       localStorage.setItem("bnp_transaction_id", transactionId);
      
//       setPaymentSuccess(true);
//       setTimeout(() => {
//         setShowPaymentModal(false);
//         refetchUserData(); // Refresh user data to update hasPaidForIdCard status
//       }, 2000);
//     } catch (error) {
//       setPaymentError(error.message || "Payment verification failed");
//       setIsSubmitting(false);
//     }
//   };

//   if (!userData) {
//     return (
//       <div>
//         <UniversalLoading text="আইডি কার্ড লোড হচ্ছে" />
//       </div>
//     );
//   }

//   // If payment is being processed, show waiting message
//   if (isSubmitting && !userData.hasPaidForIdCard) {
//     return (
//       <div className="max-w-[700px] lg:mx-auto mx-4 my-10 text-center">
//         <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-md">
//           <h2 className="text-2xl font-bold text-red-700 mb-4">আইডি কার্ড পেমেন্ট প্রক্রিয়াধীন</h2>
//           <div className="mb-6">
//             {/* <UniversalLoading text="আপনার পেমেন্ট যাচাই করা হচ্ছে" /> */}
//             <p className="mt-4">আপনার পেমেন্ট যাচাই করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন।</p>
//             <p className="mt-2 text-sm">ট্রানজেকশন আইডি: {localStorage.getItem("bnp_transaction_id") || transactionId}</p>
//           </div>
//           <h1
//             // onClick={() => setIsSubmitting(false)}
//             className="bg-red-500  text-white font-bold py-2 px-6 rounded-lg"
//           >
//             অপেক্ষা করুন
//           </h1>
//         </div>
//       </div>
//     );
//   }

//   // If user hasn't paid for ID card, show payment button
//   if (!userData.hasPaidForIdCard) {
//     return (
//       <div className="max-w-[700px] lg:mx-auto mx-4 my-10 text-center">
//         <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-md">
//           <h2 className="text-2xl font-bold text-red-700 mb-4">আইডি কার্ড পেমেন্ট</h2>
//           <p className="mb-6">আপনার আইডি কার্ড দেখতে পেমেন্ট করুন</p>
//           <button
//             onClick={() => setShowPaymentModal(true)}
//             className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg"
//           >
//             পেমেন্ট করুন
//           </button>
//         </div>

//         {/* Payment Modal */}
//         {showPaymentModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
//               <h3 className="text-xl font-bold mb-4">আইডি কার্ড পেমেন্ট</h3>
              
//               {paymentSuccess ? (
//                 <div className="text-center text-green-600 mb-4">
//                   <p className="font-bold">পেমেন্ট সফল হয়েছে!</p>
//                   <p>আপনার আইডি কার্ড প্রদর্শিত হবে...</p>
//                 </div>
//               ) : (
//                 <form onSubmit={handlePaymentSubmit}>
//                   <div className="mb-4">
//                     <label className="block mb-2 font-bold">ট্রানজেকশন আইডি</label>
//                     <input
//                       type="text"
//                       value={transactionId}
//                       onChange={(e) => setTransactionId(e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                       required
//                       disabled={isSubmitting}
//                     />
//                   </div>
                  
//                   {paymentError && (
//                     <div className="text-red-600 mb-4">{paymentError}</div>
//                   )}
                  
//                   <div className="flex justify-between">
//                     <button
//                       type="button"
//                       onClick={() => setShowPaymentModal(false)}
//                       className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg"
//                       disabled={isSubmitting}
//                     >
//                       বাতিল
//                     </button>
//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
//                     >
//                       {isSubmitting ? "অপেক্ষা করুন..." : "জমা দিন"}
//                     </button>
//                   </div>
//                 </form>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }

//   // If user has paid, show the ID card
//   return (
//     <div className="max-w-[700px] lg:mx-auto mx-4 my-10">
//       <div
//         ref={cardRef}
//         className="border px-6 py-4 bg-white rounded-lg border-black relative"
//       >
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
//           <div className="relative overflow-hidden rounded-full">
//             <img
//               className="w-20 h-20"
//               src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_Bangladesh_Nationalist_Party.svg"
//               alt="Bangladesh Nationalist Party Flag"
//               style={{ objectFit: "cover" }}
//             />
//           </div>

//           <h1 className="lg:text-3xl md:text-3xl font-bold text-red-700 text-center">
//             বাংলাদেশ জাতীয়তাবাদী দল
//           </h1>

//           <div className="relative overflow-hidden rounded-full">
//             <img
//               className="w-20 h-20"
//               src="https://projonmonews24.com/uploads/news/18250/1509170062.jpg"
//               alt="Party Flag"
//               style={{ objectFit: "cover" }}
//             />
//           </div>
//         </div>

//         {/* ID Section */}
//         <div className="flex flex-col sm:flex-row mx-4 justify-between gap-4">
//           <div className="my-4 font-bold">
//             <p>আইডি নং : {userData.partyId || "N/A"}</p>
//           </div>
//           <div className="flex justify-center">
//             <Barcode
//               className="max-w-full"
//               value={userData.partyId?.slice(-8) || "00000000"}
//               width={2.2}
//               height={40}
//               displayValue={false}
//             />
//           </div>
//         </div>

//         {/* Profile Details */}
//         <div className="flex flex-col md:flex-row gap-6 items-center">
//           <img
//             src={userData.image || "https://via.placeholder.com/150"}
//             alt="Profile"
//             className="h-52 w-44 object-cover border-2 border-black/10 rounded-md mx-auto md:mx-0"
//           />
//           <div className="flex-1 space-y-3 font-bold">
//             <div className="flex flex-wrap md:flex-nowrap gap-4">
//               <span className="min-w-[100px]">নাম</span>
//               <span>: {userData.fullName || "N/A"}</span>
//             </div>
//             <div className="flex flex-wrap md:flex-nowrap gap-4">
//               <span className="min-w-[100px]">সদস্য ধরন</span>
//               <span className="text-green-600">
//                 : সাধারণ সদস্য
//               </span>
//             </div>
//             <div className="flex flex-wrap md:flex-nowrap gap-4">
//               <span className="min-w-[100px]">ইউনিট</span>
//               <span className="text-red-600">
//                 : চট্টগ্রাম মহানগর
//               </span>
//             </div>
//             <div className="flex flex-wrap md:flex-nowrap gap-4">
//               <span className="min-w-[100px]">থানা</span>
//               <span>: {userData.thana || "N/A"}</span>
//             </div>
//             <div className="flex flex-wrap md:flex-nowrap gap-4">
//               <span className="min-w-[100px]">ওয়ার্ড</span>
//               <span>: {userData.ward || "N/A"}</span>
//             </div>
//             <div className="flex flex-wrap md:flex-nowrap gap-4">
//               <span className="min-w-[100px]">ইস্যু তারিখ</span>
//               <span>
//                 :{" "}
//                 {userData.updatedAt
//                   ? new Date(userData.updatedAt).toISOString().split("T")[0]
//                   : "Not Provided"}
//               </span>
//             </div>

//             <div>
//               <span className="text-xs">
//                 এই কার্ডটি শুধুমাত্র বি এন পির সাংগঠনিক কর্মকান্ডের জন্য
//                 প্রযোজ্য
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Decorative Paddy */}
//         <div className="absolute bottom-0 right-0 w-48 h-48 md:w-64 md:h-64 opacity-20 pointer-events-none">
//           <img
//             src="https://upload.wikimedia.org/wikipedia/commons/0/02/Bangladesh_Nationalist_Party_Election_Symbol.svg"
//             alt=""
//             className="w-full h-full object-contain"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileCard;