"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useUserData } from "../../../hooks/useUserData";

const UpdateProfile = ({ refetch, closeModal }) => {
  const navigate = useNavigate();
  const { userData } = useUserData();
  const [mohanagars, setMohanagars] = useState([]);
  const [thanas, setThanas] = useState([]);
  const [wards, setWards] = useState([]);
  const [electionCenters, setElectionCenters] = useState([]);
  const [filteredWards, setFilteredWards] = useState([]);
  const [filteredElectionCenters, setFilteredElectionCenters] = useState([]);
  const [selectedThana, setSelectedThana] = useState("");
  // Call refetch whenever you want to refresh the data

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    localReference: "",
    image: null,
    mohanagarId: "",
    thanaId: "",
    wardId: "",
    electionCenterId: "",
    userType: "",
    nid: "",
    birthDateEn: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const usertypes = [
    { name: "BNP", value: "BNP" },
    { name: "CHATRODOL", value: "CHATRODOL" },
    { name: "JUBODOL", value: "JUBODOL" },
  ];

  // Initialize form with user data
  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.fullName || "",
        email: userData.email || "",
        mobile: userData.mobile || "",
        mohanagarId: userData.mohanagarId || "",
        thanaId: userData.thanaId || "",
        wardId: userData.wardId || "",
        electionCenterId: userData.electionCenterId || "",
        userType: userData.userType || "BNP",
        nid: userData.nid || "",
        localReference: userData.localReference || "",
        birthDateEn: userData.birthDateEn || "",
        image: userData.image || "",
      });
      setSelectedThana(userData.thanaId);
    }
  }, [userData]);

  // Fetch location data
  useEffect(() => {
    const fetchLocationData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const endpoints = [
          "https://bnp-api-9oht.onrender.com/location/mohanagar",
          "https://bnp-api-9oht.onrender.com/location/thana",
          "https://bnp-api-9oht.onrender.com/location/ward",
          "https://bnp-api-9oht.onrender.com/location/electionCenter",
        ];

        const results = await Promise.all(
          endpoints.map(async (endpoint) => {
            const response = await fetch(endpoint);
            if (!response.ok)
              throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
          })
        );

        const [mohanagarsData, thanasData, wardsData, electionCentersData] =
          results;
        setMohanagars(mohanagarsData);
        setThanas(thanasData);
        setWards(wardsData);
        setElectionCenters(electionCentersData);
      } catch (error) {
        setError(`Failed to fetch data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocationData();
  }, []);

  // Filter wards based on selected thana
  useEffect(() => {
    const filtered = wards.filter((ward) => ward.thanaId === selectedThana);
    setFilteredWards(filtered);

    if (formData.wardId) {
      const filteredCenters = electionCenters.filter(
        (center) => center.wardId === formData.wardId
      );
      setFilteredElectionCenters(filteredCenters);
    } else {
      setFilteredElectionCenters([]);
    }
  }, [selectedThana, wards, formData.wardId, electionCenters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 30 * 1024) {
        Swal.fire({
          title: "ত্রুটি",
          text: "ছবির আকার 20KB এর বেশি হতে পারবে না।",
          icon: "error",
        });
        return;
      }
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch(
        `https://bnp-api-9oht.onrender.com/auth/${userData.id}`,
        {
          method: "PUT",
          body: data,
        }
      );

      if (response.ok) {
        const result = await response.json();
        Swal.fire({
          title: "সফল",
          text: "প্রোফাইল আপডেট সফল হয়েছে!",
          icon: "success",
        }).then(() => {
          closeModal();
        });
      } else {
        const errorText = await response.text();
        Swal.fire({
          title: "ত্রুটি",
          text: `আপডেট ব্যর্থ হয়েছে: ${errorText}`,
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "ত্রুটি",
        text: "সার্ভারের সাথে যোগাযোগ ব্যর্থ হয়েছে।",
        icon: "error",
      });
    }
    refetch(); // Refresh the user data after update
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-screen-2xl lg:mx-auto p-4 my-12">
      <div className="flex gap-4 items-center justify-center mb-6">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_Bangladesh_Nationalist_Party.svg"
          alt="লোগো"
          width={96}
          height={96}
          priority
        />
        <h1 className="font-bold text-xl">প্রোফাইল আপডেট করুন</h1>
      </div>
      <form className="max-w-xl mx-auto my-4" onSubmit={handleSubmit}>
        <div className="lg:flex gap-4">
          <div className="mb-4 w-full">
            <label className="block text-sm font-semibold">পূর্ণ নাম</label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              type="text"
              className="border rounded-2xl w-full px-4 py-3 mt-2"
              required
            />
          </div>
          <div className="mb-4 w-full">
            <label className="block text-sm font-semibold">ইমেইল এড্রেস</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              className="border rounded-2xl w-full px-4 py-3 mt-2"
              required
            />
          </div>
        </div>
        {/* New birthdate fields */}
        {/* <div className="lg:flex gap-4">
          <div className="mb-4 w-full">
            <label className="block text-sm font-semibold">
              জন্ম তারিখ (ইংরেজি)
            </label>
            <input
              name="birthDateEn"
              value={formData.birthDateEn}
              onChange={handleChange}
              type="date"
              className="border rounded-2xl w-full px-4 py-3 mt-2"
            />
          </div>
        </div> */}
        <div className="lg:flex gap-4">
          <div className="mb-4 w-full">
            <label className="block text-sm font-semibold">
              মোবাইল নাম্বার
            </label>
            <input
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              type="number"
              className="border rounded-2xl w-full px-4 py-3 mt-2"
              required
            />
          </div>
          <div className="mb-4 w-full">
            <label className="block text-sm font-semibold">
              এনআইডি নাম্বার
            </label>
            <input
              name="nid"
              value={formData.nid}
              onChange={handleChange}
              type="number"
              className="border rounded-2xl w-full px-4 py-3 mt-2"
              required
            />
          </div>
        </div>

        <div className="lg:flex gap-4 my-4">
          <div className="lg:w-full">
            <label htmlFor="userType" className="mb-3 block">
              সংগঠন
            </label>
            <div className="flex flex-wrap gap-4">
              {usertypes.map((type) => (
                <label key={type.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="userType"
                    value={type.value}
                    checked={formData.userType === type.value}
                    onChange={handleChange}
                    className="form-radio text-primary"
                  />
                  <span>{type.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="lg:w-full">
            <label htmlFor="mohanagarId" className="mb-3 block">
              সাংগঠনিক ইউনিট
            </label>
            <select
              name="mohanagarId"
              value={formData.mohanagarId}
              onChange={handleChange}
              className="w-full rounded-lg border-[1.5px] border-stroke py-3 px-5"
            >
              <option value="">মহানগর নির্বাচন করুন</option>
              {mohanagars.map((mohanagar) => (
                <option key={mohanagar.id} value={mohanagar.id}>
                  {mohanagar.nameBangla}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="lg:flex gap-4 my-4">
          <div className="w-full">
            <label htmlFor="thanaId" className="mb-3 block">
              থানা নির্বাচন করুন
            </label>
            <select
              name="thanaId"
              value={formData.thanaId}
              onChange={(e) => {
                handleChange(e);
                setSelectedThana(e.target.value);
              }}
              className="w-full rounded-lg border-[1.5px] border-stroke py-3 px-5"
            >
              <option value="">থানা নির্বাচন করুন</option>
              {thanas.map((thana) => (
                <option key={thana.id} value={thana.id}>
                  {thana.nameBangla}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <label htmlFor="wardId" className="mb-3 block">
              ওয়ার্ড নির্বাচন করুন
            </label>
            <select
              name="wardId"
              value={formData.wardId}
              onChange={handleChange}
              className="w-full rounded-lg border-[1.5px] border-stroke py-3 px-5"
            >
              <option value="">ওয়ার্ড নির্বাচন করুন</option>
              {filteredWards.map((ward) => (
                <option key={ward.id} value={ward.id}>
                  {ward.nameBangla}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full mb-4">
          <label htmlFor="electionCenterId" className="mb-3 block">
            নির্বাচনী কেন্দ্র
          </label>
          <select
            name="electionCenterId"
            value={formData.electionCenterId}
            onChange={handleChange}
            className="w-full rounded-lg border-[1.5px] border-stroke py-3 px-5"
          >
            <option value="">নির্বাচনী কেন্দ্র নির্বাচন করুন</option>
            {filteredElectionCenters.map((center) => (
              <option key={center.id} value={center.id}>
                {center.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="localReference" className="mb-3 block">
            স্থানীয় বি এন পি নেতার নাম যিনি আমাকে চিনেন*
          </label>
          <input
            type="text"
            name="localReference"
            value={formData.localReference}
            onChange={handleChange}
            className="w-full rounded-lg border-[1.5px] border-stroke py-3 px-5"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="mb-3 block">
            ছবি আপডেট করুন
          </label>
          <input
            type="file"
            name="image"
            onChange={handleFileUpload}
            className="w-full rounded-lg border-[1.5px] border-stroke py-3 px-5"
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-5 rounded-lg hover:bg-blue-600"
          >
            আপডেট করুন
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
