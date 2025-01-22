import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// Function to generate random math problem
const generateMathProblem = () => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operator = Math.random() > 0.5 ? "+" : "*"; // Addition or Multiplication

  let question = `${num1} ${operator} ${num2}`;
  let solution = operator === "+" ? num1 + num2 : num1 * num2;

  return { question, solution };
};

const SignUp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Adjust if not applicable
  const [capVal, setCapVal] = useState("");
  const [mathProblem, setMathProblem] = useState({});
  const [mohanagars, setMohanagars] = useState([]);
  const [thanas, setThanas] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedMohanagar, setSelectedMohanagar] = useState("");
  const [selectedThana, setSelectedThana] = useState("");
  const [filteredWards, setFilteredWards] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    country: "",
    image: null,
    mohanagarCode: "",
    thanaCode: "",
    wardCode: "",
    electionCenter: "",
    userType: "",
    nid: "",
  });

  const usertypes = [
    { name: "BNP", value: "BNP" },
    { name: "CHATRODOL", value: "CHATRODOL" },
    { name: "JUBODOL", value: "JUBODOL" },
  ];

  // Fetching data
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const mohanagarsData = await fetch(
          "https://bnp-api-9oht.onrender.com/location/mohanagar"
        ).then((res) => res.json());
        const thanasData = await fetch(
          "https://bnp-api-9oht.onrender.com/location/thana"
        ).then((res) => res.json());
        const wardsData = await fetch(
          "https://bnp-api-9oht.onrender.com/location/ward"
        ).then((res) => res.json());

        setMohanagars(mohanagarsData);
        setThanas(thanasData);
        setWards(wardsData);
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };
    fetchLocationData();

    // Generate math problem for captcha
    setMathProblem(generateMathProblem());
  }, []);

  // Filter wards based on selected thana
  useEffect(() => {
    const filtered = wards.filter((ward) => ward.thanaId === selectedThana);
    setFilteredWards(filtered);
  }, [selectedThana, wards]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file upload for image
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file,
    });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for NID
    if (!formData.nid) {
      alert("NID বাধ্যতামূলক।");
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      alert("পাসওয়ার্ড মিলছে না!");
      return;
    }

    // Validate CAPTCHA answer
    if (parseInt(capVal) !== mathProblem.solution) {
      alert("CAPTCHA সঠিক নয়!");
      return;
    }

    // Prepare form data to send
    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("mobile", formData.mobile);
    data.append("password", formData.password);
    data.append("country", formData.country);
    data.append("mohanagarCode", formData.mohanagarCode);
    data.append("thanaCode", formData.thanaCode);
    data.append("wardCode", formData.wardCode);
    data.append("electionCenter", formData.electionCenter);
    data.append("userType", formData.userType);
    data.append("nid", formData.nid); // Add NID
    data.append("image", formData.image);

    try {
      const response = await fetch(
        "https://bnp-api-9oht.onrender.com/auth/signup",
        {
          method: "POST",
          body: data,
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert("সাইন আপ সফল হয়েছে!");

        // Store user data in localStorage
        localStorage.setItem("userData", JSON.stringify(result.user));

        // Use login context to set the user state
        login(result.token, result.user);

        // Redirect after successful signup
        navigate("/"); // Replace `router.push` with `navigate`

        console.log("Form submitted successfully:", result);
      } else {
        const errorText = await response.text();
        console.error("Error submitting form:", response.status, errorText);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

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
        <h1 className="font-bold text-xl">চট্টগ্রাম মহানগর বিএনপি</h1>
      </div>
      <form className="max-w-xl mx-auto my-4" onSubmit={handleSubmit}>
        {/* Full Name and Email */}
        <div className="lg:flex gap-4">
          <div className="mb-4 w-full">
            <label className="block text-sm font-semibold">পূর্ণ নাম</label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="জন ডো"
              type="text"
              className="border shadow-lg rounded-2xl w-full px-4 py-3 mt-2"
              required
            />
          </div>
          <div className="mb-4 w-full">
            <label className="block text-sm font-semibold">ইমেইল এড্রেস</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="abc@gmail.com"
              type="email"
              className="border shadow-lg rounded-2xl w-full px-4 py-3 mt-2"
              required
            />
          </div>
        </div>

        {/* Country */}
        <div>
          <label htmlFor="country" className="mb-3 block">
            দেশ
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="দেশ লিখুন"
            className="w-full rounded-lg border-[1.5px] border-stroke py-3 px-5"
          />
        </div>

        {/* Passwords */}
        <div className="lg:flex gap-4">
          <div className="mb-4 w-full">
            <label className="block text-sm font-semibold">পাসওয়ার্ড</label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              type="password"
              className="border shadow-lg rounded-2xl w-full px-4 py-3 mt-2"
              required
            />
          </div>
          <div className="mb-4 w-full">
            <label className="block text-sm font-semibold">
              পাসওয়ার্ড পুনরায় লিখুন
            </label>
            <input
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              type="password"
              className="border shadow-lg rounded-2xl w-full px-4 py-3 mt-2"
              required
            />
          </div>
        </div>

        {/* Mobile and NID */}
        <div className="lg:flex gap-4">
          <div className="mb-4 w-full">
            <label className="block text-sm font-semibold">
              মোবাইল নাম্বার
            </label>
            <input
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="মোবাইল নম্বর লিখুন"
              type="text"
              className="border shadow-lg rounded-2xl w-full px-4 py-3 mt-2"
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
              placeholder="এনআইডি নাম্বার লিখুন"
              type="text"
              className="border shadow-lg rounded-2xl w-full px-4 py-3 mt-2"
              required
            />
          </div>
        </div>

        {/* User Type */}
        <div>
          <label htmlFor="userType" className="mb-3 block">
            পদবি
          </label>
          <select
            id="userType"
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            className="w-full rounded-lg border-[1.5px] border-stroke py-3 px-5"
          >
            <option value="">পদবি নির্বাচন করুন</option>
            {usertypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Location Fields (Mohanagar, Thana, Ward, Election Center) */}
        <div>
          <label htmlFor="mohanagarCode" className="mb-3 block">
            মহানগর
          </label>
          <select
            name="mohanagarCode"
            value={formData.mohanagarCode}
            onChange={(e) => {
              setFormData({
                ...formData,
                mohanagarCode: e.target.value,
              });
              setSelectedMohanagar(e.target.value);
            }}
            className="w-full rounded-lg border-[1.5px] border-stroke py-3 px-5"
          >
            <option value="">মহানগর নির্বাচন করুন</option>
            {mohanagars.map((mohanagar) => (
              <option key={mohanagar.id} value={mohanagar.id}>
                {mohanagar.name}
              </option>
            ))}
          </select>
        </div>

        {/* Select Thana */}
        <div>
          <label htmlFor="thanaCode" className="mb-3 block">
            থানা নির্বাচন করুন
          </label>
          <select
            name="thanaCode"
            value={formData.thanaCode}
            onChange={(e) => {
              setFormData({
                ...formData,
                thanaCode: e.target.value,
              });
              setSelectedThana(e.target.value);
            }}
            className="w-full rounded-lg border-[1.5px] border-stroke py-3 px-5"
          >
            <option value="">থানা নির্বাচন করুন</option>
            {thanas.map((thana) => (
              <option key={thana.id} value={thana.id}>
                {thana.name}
              </option>
            ))}
          </select>
        </div>

        {/* Select Ward */}
        <div>
          <label htmlFor="wardCode" className="mb-3 block">
            ওয়ার্ড নির্বাচন করুন
          </label>
          <select
            name="wardCode"
            value={formData.wardCode}
            onChange={handleChange}
            className="w-full rounded-lg border-[1.5px] border-stroke py-3 px-5"
          >
            <option value="">ওয়ার্ড নির্বাচন করুন</option>
            {filteredWards.map((ward) => (
              <option key={ward.id} value={ward.id}>
                {ward.name}
              </option>
            ))}
          </select>
        </div>

        {/* Election Center */}
        <div>
          <label htmlFor="electionCenter" className="mb-3 block">
            নির্বাচনী কেন্দ্র
          </label>
          <input
            type="text"
            id="electionCenter"
            name="electionCenter"
            value={formData.electionCenter}
            onChange={handleChange}
            placeholder="কেন্দ্র নাম লিখুন"
            className="w-full rounded-lg border-[1.5px] border-stroke py-3 px-5"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="mb-3 block">
            ছবি আপলোড করুন
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleFileUpload}
            className="w-full rounded-lg border-[1.5px] border-stroke py-3 px-5"
          />
        </div>

        {/* CAPTCHA */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">
            CAPTCHA: {mathProblem.question}
          </label>
          <input
            type="number"
            value={capVal}
            onChange={(e) => setCapVal(e.target.value)}
            placeholder="Answer"
            className="border shadow-lg rounded-2xl w-full px-4 py-3 mt-2"
            required
          />
        </div>

        {/* Other form fields... */}

        <div className="mt-6">
          <button
            disabled={!capVal}
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-5 rounded-lg hover:bg-blue-600"
          >
            সাইন আপ করুন
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
