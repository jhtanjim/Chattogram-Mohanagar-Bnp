import React, { useState } from "react";

const ForgetPass = () => {
  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset previous states
    setError("");
    setSuccess("");
    
    // Validate email
    if (!email || !email.includes('@')) {
      setError("Please enter a valid email address");
      return;
    }

    // Prevent multiple submissions
    if (loading) return;

    try {
      setLoading(true);
      const response = await fetch(
        "https://bnp-api-9oht.onrender.com/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      
      const data = await response.json();

      if (response.ok) {
        setSuccess("Password reset link sent to your email!");
        // Optional: Clear email field after success
        setEmail("");
      } else {
        setError(data.message || "Something went wrong, please try again.");
      }
    } catch (error) {
      setError("Network error, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md"
    >
      <h2 
        className="text-2xl font-semibold text-center text-gray-800 mb-4"
      >
        Forgot Password
      </h2>
      
      <div className="h-1 w-16 bg-blue-500 mx-auto mb-6"></div>
      
      <form onSubmit={handleSubmit}>
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {success}
          </div>
        )}
        
        <div className="relative mb-6">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            required
            className={`
              w-full px-4 py-3 border rounded-md 
              transition-all duration-300
              ${isFocused ? 'border-blue-500' : 'border-gray-300'}
              focus:outline-none focus:ring-2 focus:ring-blue-500
            `}
          />
          <label
            htmlFor="email"
            className={`
              absolute left-4 transition-all duration-300
              ${email || isFocused 
                ? 'top-0 text-xs text-blue-500 bg-white px-1 -translate-y-1/2' 
                : 'top-1/2 -translate-y-1/2 text-base text-gray-500'}
            `}
          >
            Email
          </label>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`
            w-full py-3 rounded-md text-white font-semibold transition-colors
            ${loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'}
          `}
        >
          {loading ? 'Sending...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ForgetPass;