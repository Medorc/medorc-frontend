import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import NavBar from "../../Components/NavBar";

import BackButton from "../../Components/BackButton";

import NavButton from "../../Components/NavButton";
import ProfileChange from "../../Components/ProfileChange";
import { useNavigate } from "react-router-dom";

export default function Account() {
  var url = "http://localhost:3000";
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    phone_no: "",
    password: "",
    photo: "",
  });
  const { token, role } = useAuth();

  useEffect(() => {
    if (!token) navigate("/");
    if (!role) return; // Wait for role to be available

    const fetchData = async () => {
      try {
        const res = await axios.get(`${url}/api/v1/${role}/profile/basic`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(res.data);    
        setData(res.data.data);
      } catch (err) {
        toast.error("API Error: " + (err.response?.data || err.message));
      }
    };

    fetchData();
  }, [token, role, navigate]);

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center ">
      <NavBar />

      {/* Header */}
      <BackButton />

      <NavButton />

      {/* Profile Image */}

      <ProfileChange data={data} />
    </div>
  );
}
