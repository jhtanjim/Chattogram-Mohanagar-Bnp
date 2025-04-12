import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Swal from "sweetalert2";

const SignIn = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "ফাঁকা ইনপুট!",
        text: "ইমেইল অথবা পাসওয়ার্ড ফাঁকা থাকতে পারে না!",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    setIsSubmitting(true); // Prevent multiple submissions

    try {
      const response = await fetch(
        "https://bnp-api-9oht.onrender.com/auth/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "লগইন সফল হয়েছে!",
          confirmButtonColor: "#16A34A",
        });
        login(result.token, result.user); // Log in the user using context
        navigate("/dashBoard"); // Redirect after successful login
      } else {
        Swal.fire({
          icon: "error",
          title: "ব্যর্থ!",
          text: result.message || "লগইন ব্যর্থ হয়েছে!",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: "লগইন করতে সমস্যা হয়েছে, আবার চেষ্টা করুন।",
        confirmButtonColor: "#d33",
      });
    }

    setIsSubmitting(false); // Reset submit state
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4 my-12">
      <div className="flex gap-4 items-center justify-center mb-6">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_Bangladesh_Nationalist_Party.svg"
          alt="লোগো"
          width={96}
          height={96}
        />
        <h1 className="font-bold text-xl">চট্টগ্রাম মহানগর বিএনপি</h1>
      </div>

      <form className="max-w-md mx-auto my-4" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold">
            ইমেইল ঠিকানা
          </label>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="আপনার ইমেইল লিখুন"
            type="email"
            className="border shadow-lg rounded-2xl w-full px-4 py-3 mt-2"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-semibold">
            পাসওয়ার্ড
          </label>
          <input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
            className="border shadow-lg rounded-2xl w-full px-4 py-3 mt-2"
            required
          />
        </div>

        <button
          className="bg-[#16A34A] duration-200 text-white p-2 w-full rounded hover:bg-[#F5CF0D] hover:text-red-500 font-bold disabled:opacity-50"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "লগইন করা হচ্ছে..." : "লগইন করুন "}
        </button>

        <p className="py-1">
          <Link to="/forget-password" className="text-green-800 font-semibold">
            পাসওয়ার্ড ভুলে গেছেন?
          </Link>
        </p>

        <p className="py-4 text-center">
          অ্যাকাউন্ট নেই?{" "}
          <Link to="/signUp" className="text-blue-800 font-semibold">
            সাইন আপ করুন
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
