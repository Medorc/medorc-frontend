import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState({
    role: "",
    email: "",
    password: "",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const roles = [
    { value: "patient", label: "Patient" },
    { value: "doctor", label: "Doctor" },
    { value: "hospital", label: "Hospital" },
    { value: "extern", label: "External" },
  ];

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
        login(response.data.token, response.data.role);
        navigate(`/${role}/home`);
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
                <div className="relative">
                  <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full border border-gray-300 rounded-full px-4 py-3 cursor-pointer bg-white flex items-center justify-between hover:border-blue-400 transition-colors"
                  >
                    <span className={data.role ? "text-gray-900" : "text-gray-500"}>
                      {roles.find((r) => r.value === data.role)?.label || "--Select Role--"}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                  </div>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
                      >
                        {roles.map((role) => (
                          <div
                            key={role.value}
                            onClick={() => {
                              setData((prev) => ({ ...prev, role: role.value }));
                              setIsDropdownOpen(false);
                            }}
                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between text-gray-700 hover:text-blue-600 transition-colors"
                          >
                            <span>{role.label}</span>
                            {data.role === role.value && <Check className="w-4 h-4 text-blue-500" />}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
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
            <div className="text-center mt-6 flex justify-between text-sm pt-2">
              <p className="text-blue-500 hover:underline cursor-pointer">Forgot password?</p>
              <p className="text-blue-500 hover:underline cursor-pointer" onClick={() => navigate('/SignUp')}>Not a user? Sign up</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}