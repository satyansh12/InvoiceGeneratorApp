// LoginForm.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

interface User {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  console.log(process.env.REACT_APP_SERVER_URL);
  const [user, setUser] = useState<User>({ email: '', password: '' });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/login`, user);
      toast.success('Login successful!');
      const token = response.data.token;
      if (token) {
        localStorage.setItem("jwt", token);
        navigate("/add-products");
      } else {
        toast.error('Login failed. Please try again.');
      }
    } catch (error) {
      toast.error('Login failed!');
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-1/2 p-4">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="flex items-center mb-4">
              <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  required
                  className="input input-bordered w-full max-w-xs"
                  value={user.email}
                  onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center mb-4">
              <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full max-w-xs"
                  value={user.password}
                  id="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleInputChange}
              />
              <button type="button" onClick={togglePasswordVisibility} className="btn btn-ghost">
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <button type="submit" className="btn btn-primary">Log In</button>
            <p className="text-center my-4">Don't have an account yet?</p>
            <button type="button" onClick={handleRegister} className="btn btn-outline">Register</button>
          </form>
        </div>
      </div>
  );
};

export default LoginForm;
