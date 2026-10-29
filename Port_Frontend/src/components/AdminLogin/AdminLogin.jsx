import "./AdminLogin.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FaLock, FaEnvelope, FaSignInAlt } from "react-icons/fa";

function AdminLogin() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await axios.post(
        "http://localhost:5000/api/admin/login",
        {
          email,
          password,
        }
      );

      if (response.data.success) {

        // Save JWT token
        localStorage.setItem(
          "adminToken",
          response.data.token
        );

        toast.success("Login successful!");

        // Go to dashboard
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1000);
      }

    } catch (error) {

      console.error("Login error:", error);

      toast.error(
        error.response?.data?.message ||
        "Login failed. Please try again."
      );
    }
  };


  return (
    <div className="admin-login-page">

      <ToastContainer />

      <div className="admin-login-card">

        <div className="admin-login-icon">
          <FaLock />
        </div>

        <h1>Admin Login</h1>

        <p>
          Login to manage your Smart Portfolio
        </p>


        <form onSubmit={handleLogin}>

          {/* Email */}

          <div className="admin-input-group">

            <FaEnvelope />

            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

          </div>


          {/* Password */}

          <div className="admin-input-group">

            <FaLock />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

          </div>


          {/* Login Button */}

          <button
            type="submit"
            className="admin-login-button"
          >
            Login
            <FaSignInAlt />
          </button>

        </form>

      </div>

    </div>
  );
}

export default AdminLogin;