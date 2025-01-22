import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";

const UpdateProfile = ({ closeModal }) => {
  // Add closeModal prop
  const { user } = useAuth();

  const [formData, setFormData] = useState({
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
    img: "",
  });

  const thanas = [
    { code: "AK", name: "Akbarshah Thana", wards: ["10"] },
    { code: "BA", name: "Bakoliya Thana", wards: ["17", "18", "19", "35"] },
    { code: "BD", name: "Bandar Thana", wards: ["36", "37", "38", "39"] },
    { code: "BY", name: "Bayazid Thana", wards: ["02"] },
    { code: "CH", name: "Chandgaon Thana", wards: ["04", "05", "06"] },
    { code: "CB", name: "Chawkbazar Thana", wards: ["15", "16"] },
    {
      code: "DM",
      name: "Double Mooring Thana",
      wards: ["12", "23", "24", "27", "28", "29", "30"],
    },
    { code: "EP", name: "EPZ Thana", wards: ["39", "40", "41"] },
    { code: "HA", name: "Halishahar Thana", wards: ["11", "24", "25", "26"] },
    { code: "KH", name: "Khulshi Thana", wards: ["08", "09", "13", "14"] },
    {
      code: "KT",
      name: "Kotwali Thana",
      wards: ["20", "21", "22", "30", "31", "32", "33", "34", "35", "15", "16"],
    },
    { code: "PA", name: "Pahartali Thana", wards: ["09", "11", "12"] },
    {
      code: "PC",
      name: "Panchlaish Thana",
      wards: ["01", "02", "03", "07", "08", "15", "16"],
    },
    { code: "PT", name: "Patenga Thana", wards: ["39", "40", "41"] },
    { code: "SD", name: "Sadarghat Thana", wards: ["30", "35"] },
  ];

  const politicalPositions = [
    { value: "", label: "পদবি নির্বাচন করুন" },
    { value: "BNP", label: "বিএনপি" },
    { value: "CHATRODOL", label: "ছাত্রদল" },
    { value: "JUBODOL", label: "যুবদল" },
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.fullName,
        id: user.userId,
        email: user.email,
        phone: user.mobile,
        nid: user.nid,
        birthDate: user.birthDate || "Not Provided",
        politicalPosition: user.userType,
        ward: user.ward,
        thana: user.thana,
        mahanagar: user.mohanagar,
        PollingCenter: user.electionCenter,
        img: user.img,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleimgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setFormData((prevData) => ({ ...prevData, img: imgUrl }));
    }
  };

  const selectedThana = thanas.find((thana) => thana.code === formData.thana);
  const wards = selectedThana ? selectedThana.wards : [];

  return (
    <div className="p-8 max-w-2xl my-8 mx-auto border">
      <h2 className="text-xl font-bold mb-4 w-full">
        আপনার প্রোফাইল আপডেট করুন
      </h2>

      <form className="space-y-6">
        <div className="lg:flex gap-2">
          {" "}
          {/* Name */}
          <div className=" w-full">
            <label htmlFor="name" className="block text-sm font-semibold">
              পূর্ণ নাম
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="border shadow-lg rounded-2xl w-full px-4 py-3 mt-2"
            />
          </div>
          {/* User ID */}
          <div className="w-full">
            <label htmlFor="id" className="block text-sm font-semibold">
              ইউজার আইডি
            </label>
            <input
              type="text"
              name="id"
              id="id"
              value={formData.id}
              onChange={handleChange}
              className="border shadow-lg rounded-2xl w-full px-4 py-3 mt-2"
            />
          </div>
        </div>

        <div className="lg:flex gap-2">
          {/* Email */}
          <div className="w-full">
            <label htmlFor="email" className="block text-sm font-semibold">
              ইমেইল
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="border shadow-lg rounded-2xl w-full px-4 py-3 mt-2"
            />
          </div>

          {/* Phone */}
          <div className="w-full">
            <label htmlFor="phone" className="block text-sm font-semibold">
              ফোন নম্বর
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="border shadow-lg rounded-2xl w-full px-4 py-3 mt-2"
            />
          </div>
        </div>

        <div className="lg:flex gap-2">
          {/* NID */}
          <div className="w-full">
            <label htmlFor="nid" className="block text-sm font-semibold">
              এনআইডি নম্বর
            </label>
            <input
              type="text"
              name="nid"
              id="nid"
              value={formData.nid}
              onChange={handleChange}
              className="border shadow-lg rounded-2xl w-full px-4 py-3 mt-2"
            />
          </div>

          {/* Birth Date */}
          <div className="w-full">
            <label htmlFor="birthDate" className="block text-sm font-semibold">
              জন্ম তারিখ
            </label>
            <input
              type="date"
              name="birthDate"
              id="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="border shadow-lg rounded-2xl w-full px-4 py-3 mt-2"
            />
          </div>
        </div>

        <div className="lg:flex gap-2">
          {/* Political Position */}
          <div className="w-full">
            <label
              htmlFor="politicalPosition"
              className="block text-sm font-semibold"
            >
              রাজনৈতিক পদবি
            </label>
            <select
              name="politicalPosition"
              id="politicalPosition"
              value={formData.politicalPosition}
              onChange={handleChange}
              className="border shadow-lg rounded-2xl w-full px-4 py-3 mt-2"
            >
              {politicalPositions.map((position) => (
                <option key={position.value} value={position.value}>
                  {position.label}
                </option>
              ))}
            </select>
          </div>

          {/* Ward */}
          <div className="w-full">
            <label htmlFor="ward" className="block text-sm font-semibold">
              ওয়ার্ড
            </label>
            <select
              name="ward"
              id="ward"
              value={formData.ward}
              onChange={handleChange}
              className="border shadow-lg rounded-2xl w-full px-4 py-3 mt-2"
            >
              <option value="">ওয়ার্ড নির্বাচন করুন</option>
              {wards.map((ward) => (
                <option key={ward} value={ward}>
                  {ward}
                </option>
              ))}
            </select>
          </div>

          {/* Thana */}
          <div className="w-full">
            <label htmlFor="thana" className="block text-sm font-semibold">
              থানা
            </label>
            <select
              name="thana"
              id="thana"
              value={formData.thana}
              onChange={handleChange}
              className="border shadow-lg rounded-2xl w-full px-4 py-3 mt-2"
            >
              <option value="">থানা নির্বাচন করুন</option>
              {thanas.map((thana) => (
                <option key={thana.code} value={thana.code}>
                  {thana.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="lg:flex gap-2">
          {" "}
          {/* Mahanagar */}
          <div className="w-full">
            <label htmlFor="mahanagar" className="block text-sm font-semibold">
              মহানগর
            </label>
            <input
              type="text"
              name="mahanagar"
              id="mahanagar"
              value={formData.mahanagar}
              onChange={handleChange}
              className="border shadow-lg rounded-2xl w-full px-4 py-3 mt-2"
            />
          </div>
          {/* Polling Center */}
          <div className="w-full">
            <label
              htmlFor="PollingCenter"
              className="block text-sm font-semibold"
            >
              নির্বাচন কেন্দ্র
            </label>
            <input
              type="text"
              name="PollingCenter"
              id="PollingCenter"
              value={formData.PollingCenter}
              onChange={handleChange}
              className="border shadow-lg rounded-2xl w-full px-4 py-3 mt-2"
            />
          </div>
        </div>

        {/* img Upload */}
        <div className="w-full">
          <label htmlFor="img" className="block text-sm font-semibold">
            প্রোফাইল ছবি
          </label>
          <input
            type="file"
            name="img"
            id="img"
            onChange={handleimgChange}
            className="border shadow-lg rounded-2xl w-full px-4 py-3 mt-2"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 border rounded-lg"
            onClick={closeModal} // Close modal on cancel
          >
            বাতিল
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
          >
            পরিবর্তন সংরক্ষণ করুন
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
