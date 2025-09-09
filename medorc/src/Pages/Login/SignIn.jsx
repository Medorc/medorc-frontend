import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState({
    role: "",
    email: "",
    password: "",
  });

  const changehandle = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const url = "http://localhost:3000/api/v1/auth/signin";

  const handlesubmit = async (e) => {
    e.preventDefault();
    const { role, email, password } = data;
    if (!email || !password || !role) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post(url, data);
      if (response.status === 200) {
        toast.success("Login Successful");
        login(response.data.token);
        navigate(`/${data.role}/home`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Login Failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      <div className="flex w-full max-w-7xl">
        <div className="hidden md:flex md:w-1/2 items-center justify-center pr-10">
          <img src="Loginbg.png" alt="Medical illustration" className="max-w-xl" />
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
          <img src="Logo.png" alt="Medorc Logo" className="w-72 pb-4" />
          <div className="bg-gray-100 p-8 rounded-2xl shadow-lg w-full max-w-md">
            <h2 className="text-4xl font-bold text-center mb-8">Sign In</h2>
            <form onSubmit={handlesubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="role" className="block mb-1 font-medium text-gray-700">
                  Sign In as
                </label>
                <div className="w-full border border-gray-300 rounded-full px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 bg-white">
                  <select
                    id="role"
                    name="role"
                    value={data.role}
                    onChange={changehandle}
                    className="w-full outline-none bg-transparent"
                  >
                    <option value="">--Select Role--</option>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="hospital">Hospital</option>
                    <option value="extern">External</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
                  Email
                </label>
                <div className="w-full border border-gray-300 rounded-full px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 bg-white">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={data.email}
                    onChange={changehandle}
                    placeholder="Enter your email"
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block mb-1 font-medium text-gray-700">
                  Password
                </label>
                <div className="w-full border border-gray-300 rounded-full px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 bg-white">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={data.password}
                    onChange={changehandle}
                    placeholder="Enter your password"
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-full font-semibold text-lg hover:bg-blue-600 transition duration-300 mt-4"
              >
                Sign In
              </button>
            </form>
            <div className="text-center mt-6 flex justify-between text-sm">
              <p className="text-blue-500 hover:underline cursor-pointer">Forgot password?</p>
              <p className="text-blue-500 hover:underline cursor-pointer" onClick={()=>navigate('/SignUp')}>Not a user? Sign up</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}