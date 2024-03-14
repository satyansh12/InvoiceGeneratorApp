// RegisterForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = (field) => {
    if (field === 'old') {
      setShowOldPassword(!showOldPassword);
    } else if (field === 'new') {
      setShowNewPassword(!showNewPassword);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/signup`, user);
      const token = response.data.token;
      if (token) {
        localStorage.setItem("jwt", token);
        navigate("/add-products");
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } catch (error) {
      toast.error('Registration failed!');
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name"
                  required
                  className="input input-bordered w-full"
                  value={user.name}
                  onChange={handleInputChange}
              />
            </div>
            <div>
              <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  required
                  className="input input-bordered w-full"
                  value={user.email}
                  onChange={handleInputChange}
              />
            </div>
            <div>
              <input
                  type={showOldPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Password"
                  className="input input-bordered w-full"
                  value={user.password}
                  onChange={handleInputChange}
              />
              <button type="button" onClick={() => togglePasswordVisibility('old')} className="btn btn-ghost">
                {showOldPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <div>
              <input
                  type={showNewPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="input input-bordered w-full"
                  value={user.confirmPassword}
                  onChange={handleInputChange}
              />
              <button type="button" onClick={() => togglePasswordVisibility('new')} className="btn btn-ghost">
                {showNewPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <button type="submit" className="btn btn-primary w-full">Register</button>
          </form>
          <p className="text-center">Have an account?</p>
          <button onClick={handleLogin} className="btn btn-outline w-full">Log In</button>
        </div>
      </div>
  );
};

export default RegisterForm;
