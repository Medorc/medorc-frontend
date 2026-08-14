import React, { useState, useEffect } from "react";
import NavBar from "../../Components/NavBar";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import UserCard from "../../Components/UserCard";

import { API_BASE_URL } from "../../config/api";

export default function HospitalHome() {
  const navigate = useNavigate();

  const { token, role } = useAuth();

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  // Validate Login
  useEffect(() => {
    if (!token || role !== "hospital") {
      navigate("/");
    }
  }, [token, role]);

  // Load Profile
  useEffect(() => {
    const getUser = async () => { 
      try {
        const response = await axios.get(`${API_BASE_URL}/hospital/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (token) {
      getUser();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <NavBar />

      {loading ? (
        <p className="text-center pt-20">Loading...</p>
      ) : (
        <UserCard user={user} role={role} token={token} navigate={navigate} />
      )}
    </div>
  );
}
