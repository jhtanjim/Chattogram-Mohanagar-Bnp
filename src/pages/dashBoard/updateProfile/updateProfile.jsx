import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useUserData } from "../../../hooks/useUserData";
import Swal from "sweetalert2";

const UpdateProfile = ({ closeModal, onUpdate, initialData }) => {
  const { user } = useAuth();
  const { userData } = useUserData();
  const id = user?.id;

  const [formData, setFormData] = useState(initialData || {});
  const [mohanagars, setMohanagars] = useState([]);
  const [thanas, setThanas] = useState([]);
  const [wards, setWards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userToken, setUserToken] = useState(
    localStorage.getItem("token") || ""
  );

  useEffect(() => {
    if (!userToken) {
      setError("User not authenticated. Please log in again.");
      return;
    }

    const fetchLocationData = async () => {
      try {
        const [mohanagarsData, thanasData, wardsData] = await Promise.all([
          fetch("https://bnp-api-9oht.onrender.com/location/mohanagar").then(
            (res) => res.json()
          ),
          fetch("https://bnp-api-9oht.onrender.com/location/thana").then(
            (res) => res.json()
          ),
          fetch("https://bnp-api-9oht.onrender.com/location/ward").then((res) =>
            res.json()
          ),
        ]);

        setMohanagars(mohanagarsData);
        setThanas(thanasData);
        setWards(wardsData);
      } catch (err) {
        console.error("Error fetching location data:", err);
        setError("Failed to load location data. Please try again.");
      }
    };

    fetchLocationData();
  }, [userToken]);

  const usertypes = [
    { name: "BNP", value: "BNP" },
    { name: "CHATRODOL", value: "CHATRODOL" },
    { name: "JUBODOL", value: "JUBODOL" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({ ...prevData, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "আপডেট করার আগে নিশ্চিত করুন!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ, আপডেট করুন!",
      cancelButtonText: "বাতিল করুন",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        setError("");

        if (!id || !userToken) {
          setError("ব্যবহারকারী প্রমাণিত নয়। অনুগ্রহ করে আবার লগ ইন করুন।");
          setIsLoading(false);
          return;
        }

        try {
          const response = await fetch(
            `https://bnp-api-9oht.onrender.com/auth/${id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
              },
              body: JSON.stringify({ ...formData, userId: id }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || "প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে।"
            );
          }

          const updatedUser = await response.json();
          onUpdate(updatedUser);
          Swal.fire("সফল!", "আপনার প্রোফাইল সফলভাবে আপডেট হয়েছে।", "success");
          closeModal();
        } catch (err) {
          console.error("Error updating profile:", err);
          setError(
            err.message || "প্রোফাইল আপডেট করার সময় একটি সমস্যা হয়েছে।"
          );
          Swal.fire("ব্যর্থ!", "আপডেটের সময় একটি ত্রুটি ঘটেছে।", "error");
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        আপনার প্রোফাইল আপডেট করুন
      </h2>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              label: "পূর্ণ নাম",
              name: "fullName",
              type: "text",
              required: true,
            },
            {
              label: "ইউজার আইডি",
              name: "partyId",
              type: "text",
              required: true,
            },
            { label: "ইমেইল", name: "email", type: "email", required: true },
            {
              label: "মোবাইল নম্বর",
              name: "mobile",
              type: "tel",
              required: true,
            },
            {
              label: "এনআইডি নম্বর",
              name: "nid",
              type: "text",
              required: true,
            },
            { label: "জন্ম তারিখ", name: "birthDate", type: "date" },
          ].map(({ label, name, type, required }) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {label}
              </label>
              <input
                type={type}
                name={name}
                id={name}
                value={formData[name] || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required={required}
              />
            </div>
          ))}

          {[
            { label: "রাজনৈতিক পদবি", name: "userType", options: usertypes },
            { label: "ওয়ার্ড", name: "ward", options: wards },
            { label: "থানা", name: "thana", options: thanas },
            { label: "মহানগর", name: "mohanagar", options: mohanagars },
          ].map(({ label, name, options }) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {label}
              </label>
              <select
                name={name}
                id={name}
                value={formData[name] || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">{`${label} নির্বাচন করুন`}</option>
                {options.map((option) => (
                  <option
                    key={option.id || option.value}
                    value={option.id || option.value}
                  >
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div>
            <label
              htmlFor="electionCenter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              নির্বাচনী কেন্দ্র
            </label>
            <input
              type="text"
              name="electionCenter"
              id="electionCenter"
              value={formData.electionCenter || ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            প্রোফাইল ছবি
          </label>
          <input
            type="file"
            name="image"
            id="image"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            বাতিল
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? "আপডেট হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
