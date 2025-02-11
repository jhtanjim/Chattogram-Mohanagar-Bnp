import { useState } from "react";

const ForgetPass = () => {
  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
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
      console.log(data);
      if (response.ok) {
        alert("Password reset link sent to your email!");
      } else {
        alert(data.message || "Something went wrong, please try again.");
      }
    } catch (error) {
      alert("Network error, please try again later.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "350px",
        margin: "50px auto",
        padding: "30px",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "600",
          marginBottom: "20px",
          textAlign: "center",
          color: "#333",
          letterSpacing: "1px",
        }}
      >
        Forgot Password
      </h2>
      <div
        style={{
          width: "50px",
          height: "4px",
          background: "#3498db",
          margin: "0 auto 30px",
        }}
      ></div>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "25px", position: "relative" }}>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            required
            style={{
              width: "100%",
              padding: "12px 16px",
              fontSize: "16px",
              color: "#333",
              border: `2px solid ${isFocused ? "#3498db" : "#ddd"}`,
              borderRadius: "4px",
              outline: "none",
              transition: "all 0.3s",
              backgroundColor: "transparent",
            }}
          />
          <label
            htmlFor="email"
            style={{
              position: "absolute",
              left: "16px",
              top: email || isFocused ? "-10px" : "12px",
              fontSize: email || isFocused ? "12px" : "16px",
              color: isFocused ? "#3498db" : "#999",
              padding: "0 4px",
              backgroundColor: "white",
              transition: "all 0.3s",
              pointerEvents: "none",
            }}
          >
            Email
          </label>
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "transparent",
            color: "#3498db",
            border: "2px solid #3498db",
            borderRadius: "4px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s",
            outline: "none",
          }}
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ForgetPass;
