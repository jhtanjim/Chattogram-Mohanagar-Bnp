"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Swal from "sweetalert2";
import UniversalLoading from "../../Components/UniversalLoading";

// Function to generate random math problem
const generateMathProblem = () => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operator = Math.random() > 0.5 ? "+" : "*"; // Addition or Multiplication

  const question = `${num1} ${operator} ${num2}`;
  const solution = operator === "+" ? num1 + num2 : num1 * num2;

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
  const [selectedelEctionCenter, setSelectedelEctionCenter] = useState("");
  const [filteredWards, setFilteredWards] = useState([]);
  const [electionCenters, setElectionCenters] = useState([]);
  const [filteredElectionCenters, setFilteredElectionCenters] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    localReference: "",
    image: null,
    mohanagarId: "",
    thanaId: "",
    wardId: "",
    electionCenterId: "",
    userType: "BNP",
    nid: "",
    formNumber: "", // <-- NEW FIELD

  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const usertypes = [
    { name: "BNP", value: "BNP" },
    { name: "CHATRODOL", value: "CHATRODOL" },
    { name: "JUBODOL", value: "JUBODOL" },
  ];
  useEffect(() => {
    setFormData((prev) => ({ ...prev, userType: "BNP" }));
  }, []);

  // Fetching data
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
            try {
              const response = await fetch(endpoint);
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return await response.json();
            } catch (error) {
              console.error(`Error fetching from ${endpoint}:`, error);
              throw error;
            }
          })
        );

        const [mohanagarsData, thanasData, wardsData, electionCentersData] =
          results;

        setMohanagars(mohanagarsData);
        setThanas(thanasData);
        setWards(wardsData);
        setElectionCenters(electionCentersData);

    
      } catch (error) {
        console.error("Error fetching location data:", error);
        setError(`Failed to fetch data: ${error.message}`);
      } finally {
        setIsLoading(false);
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

    // Filter election centers based on selected ward
    if (formData.wardId) {
      const filteredCenters = electionCenters.filter(
        (center) => center.wardId === formData.wardId
      );
      setFilteredElectionCenters(filteredCenters);
    } else {
      setFilteredElectionCenters([]);
    }
  }, [selectedThana, wards, formData.wardId, electionCenters]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file upload for image
  // Handle file upload for image
  // Function to compress an image before upload
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          // Create canvas
          const canvas = document.createElement("canvas");

          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;

          // Draw image on canvas with new dimensions
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Convert canvas to Blob with reduced quality
          canvas.toBlob(
            (blob) => {
              // Create a new file from the blob
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });

              resolve(compressedFile);
            },
            "image/jpeg",
            0.7 // Compression quality (0.7 = 70% quality)
          );
        };

        img.onerror = (error) => {
          reject(error);
        };
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  // Modified handleFileUpload function
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Show loading indicator or message
        const compressedFile = await compressImage(file);

     

        setFormData({
          ...formData,
          image: compressedFile,
        });

        // Optionally show success message
        Swal.fire({
          title: "সফল",
          text: `ছবি সফলভাবে কম্প্রেস করা হয়েছে। (${(
            compressedFile.size / 1024
          ).toFixed(2)}KB)`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error compressing image:", error);
        Swal.fire({
          title: "ত্রুটি",
          text: "ছবি কম্প্রেস করতে সমস্যা হয়েছে।",
          icon: "error",
        });
      }
    }
  };

  // Handle submit
  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password length
    if (formData.password.length < 8) {
      Swal.fire({
        title: "ত্রুটি",
        text: "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে!",
        icon: "error",
      });
      return;
    }

    // Validate NID
    if (!formData.nid) {
      Swal.fire({
        title: "ত্রুটি",
        text: "NID বাধ্যতামূলক।",
        icon: "error",
      });
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        title: "ত্রুটি",
        text: "পাসওয়ার্ড মিলছে না!",
        icon: "error",
      });
      return;
    }

    // Validate CAPTCHA answer
    if (Number.parseInt(capVal) !== mathProblem.solution) {
      Swal.fire({
        title: "ত্রুটি",
        text: "CAPTCHA সঠিক নয়!",
        icon: "error",
      });
      return;
    }

    // Set submitting state
    setIsSubmitting(true);

    // Prepare form data to send
    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("mobile", formData.mobile);
    data.append("password", formData.password);
    data.append("localReference", formData.localReference);
    data.append("mohanagarId", formData.mohanagarId);
    data.append("thanaId", formData.thanaId);
    data.append("wardId", formData.wardId);
    data.append("electionCenterId", formData.electionCenterId);
    data.append("userType", formData.userType);
    data.append("nid", formData.nid);
    data.append("image", formData.image);
    data.append("formNumber", formData.formNumber);

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
        Swal.fire({
          title: "সফল",
          text: "সাইন আপ সফল হয়েছে!",
          icon: "success",
        }).then(() => {
          // Store user data in localStorage
          localStorage.setItem("userData", JSON.stringify(result.user));

          // Use login context to set the user state
          login(result.token, result.user);

          // Redirect after successful signup
          navigate("/dashBoard");
        });

        console.log("Form submitted successfully:", result);
      } else {
        const errorText = await response.text();
        Swal.fire({
          title: "ত্রুটি",
          text: `সাইন আপ ব্যর্থ হয়েছে: ${errorText}`,
          icon: "error",
        });
        console.error("Error submitting form:", response.status, errorText);
      }
    } catch (error) {
      Swal.fire({
        title: "ত্রুটি",
        text: "সার্ভারের সাথে যোগাযোগ ব্যর্থ হয়েছে।",
        icon: "error",
      });
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div><UniversalLoading 
    text="SignIn Loading..." 
  
  /></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
              placeholder="নাজিমুর রহমান
"
              type="text"
              className="border  rounded-2xl w-full px-4 py-3 mt-2"
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
              className="border  rounded-2xl w-full px-4 py-3 mt-2"
              required
            />
          </div>
        </div>

        {/* localReference */}

        {/* Passwords */}
        <div className="lg:flex gap-4 my-4">
          <div className="mb-4 w-full">
            <label className="block text-sm font-semibold">পাসওয়ার্ড</label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              type="password"
              className="border  rounded-2xl w-full px-4 py-3 mt-2"
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
              className="border  rounded-2xl w-full px-4 py-3 mt-2"
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
              className="border  rounded-2xl w-full px-4 py-3 mt-2"
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
              className="border  rounded-2xl w-full px-4 py-3 mt-2"
              required
            />
          </div>
        </div>
        <div className="lg:flex gap-4 my-4">
          {" "}
          {/* User Type */}
          <div className="lg:w-full">
            <label htmlFor="userType" className="mb-3 block">
              সংগঠন
            </label>
            <div className="flex flex-wrap gap-4">
              {usertypes.map((type) => (
                <label key={type.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={type.value}
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
            {/* <label htmlFor="mohanagarId" className="mb-3  block">
              সাংগঠনিক ইউনিট
            </label> */}
            <select
              name="mohanagarId"
              value={formData.mohanagarId}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  mohanagarId: e.target.value,
                });
                setSelectedMohanagar(e.target.value);
              }}
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

        {/* Location Fields (Mohanagar, Thana, Ward, Election Center) */}
        <div className="lg:flex gap-4 my-4">
          {/* Select Thana */}
          <div className="w-full my-4">
            {/* <label htmlFor="thanaId" className="mb-3 block">
              থানা নির্বাচন করুন
            </label> */}
            <select
              name="thanaId"
              value={formData.thanaId}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  thanaId: e.target.value,
                });
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

          {/* Select Ward */}
          <div className="w-full">
            {/* <label htmlFor="wardId" className="mb-3 block">
              ওয়ার্ড নির্বাচন করুন
            </label> */}
            <select
              name="wardId"
              value={formData.wardId}
              onChange={(e) => {
                const selectedWardId = e.target.value;
                setFormData({
                  ...formData,
                  wardId: selectedWardId,
                  electionCenterId: "", // Reset election center when ward changes
                });

                // Filter election centers based on selected ward
                const filteredCenters = electionCenters.filter(
                  (center) => center.wardId === selectedWardId
                );
                setFilteredElectionCenters(filteredCenters);
              }}
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
        {/* Election Center */}
        <div>
          <div className="w-full my-8">
            {/* <label htmlFor="electionCenterId" className="mb-3 block">
              নির্বাচনী কেন্দ্র
            </label> */}
            <select
              name="electionCenterId"
              value={formData.electionCenterId}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  electionCenterId: e.target.value,
                });
                setSelectedelEctionCenter(e.target.value);
              }}
              className="w-full rounded-lg border-[1.5px] border-stroke py-3 px-5"
            >
              <option value="">নির্বাচনী কেন্দ্র নির্বাচন করুন</option>
              {filteredElectionCenters.map((electionCenter) => (
                <option key={electionCenter.id} value={electionCenter.id}>
                  {electionCenter.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="localReference" className="mb-3 block">
            স্থানীয় বিএনপি নেতার নাম যিনি আপনাকে চিনেন
          </label>
          <input
            type="text"
            id="localReference"
            name="localReference"
            value={formData.localReference}
            onChange={handleChange}
            placeholder="স্থানীয় নেতার নাম, যিনি আপনাকে চিনে
"
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
            required
          />
        </div>

        {/* formdata */}
<div className="mb-4 w-full">
  <label className="block text-sm font-semibold">ফর্ম নাম্বার (১৪ ডিজিট)</label>
  <input
  name="formNumber"
  value={formData.formNumber}
  onChange={(e) => {
    const val = e.target.value;
    // Only allow digits
    if (/^\d*$/.test(val)) {
      setFormData({ ...formData, formNumber: val });
    }
  }}
  placeholder="উদাহরণ: 12345678901234"
  type="text"
  maxLength={14}    // <-- max length here
  className="border rounded-2xl w-full px-4 py-3 mt-2"
  required
/>

</div>

        {/* CAPTCHA */}
        <div className="my-4">
          <label className="block text-sm font-semibold">
            {/* CAPTCHA: {mathProblem.question} */}
            <div className="flex items-center gap-2">
  <span className="text-sm font-bold">CAPTCHA: {mathProblem.question}</span>
  <span className="text-sm font-bold">=</span>
  {/* <input
    type="text"
    value={capVal}
    onChange={(e) => setCapVal(e.target.value)}
    className="border rounded-lg px-2 py-1 w-16 text-center"
  /> */}
  <span className="text-sm font-bold text-red-500">?</span>
</div>
          </label>
          <input
            type="number"
            value={capVal}
            onChange={(e) => setCapVal(e.target.value)}
            placeholder="Answer"
            className="border  rounded-2xl w-full px-4 py-3 mt-2"
            required
          />
        </div>

        {/* Other form fields... */}

        <div className="mt-6">
        <button
          disabled={!capVal || isSubmitting}
          type="submit"
          className="bg-[#16A34A] duration-200 text-white p-2 w-full rounded hover:bg-[#F5CF0D] hover:text-red-500 font-bold "
        >
          {isSubmitting ? 'সাইন আপ করা হচ্ছে...' : 'সাইন আপ করুন'}
        </button>
        </div>
        <p className="py-4 text-center">
          অ্যাকাউন্ট আছে?
          <a href="/signIn" className="text-blue-800 font-semibold">
            সাইন ইন করুন
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
