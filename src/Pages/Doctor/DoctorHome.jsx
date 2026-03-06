import React, { useState, useEffect } from "react";
import NavBar from "../../Components/NavBar";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import Loading from "../../Components/Loading";
import { useNavigate } from "react-router-dom";
import UserCard from "../../Components/UserCard";

export default function DoctorHome() {
  const url = "http://localhost:3000";
  const navigate = useNavigate();

  const { token, role } = useAuth();

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  // Validate Login
  useEffect(() => {
    if (!token || role !== "doctor") {
      navigate("/signup");
    }
  }, [token, role]);

  // Load Profile
  useEffect(() => {
    const getUser = async () => { 
      try {
        const response = await axios.get(`${url}/api/v1/doctor/profile/`, {
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
        <Loading />
      ) : (
        <UserCard user={user} role={role} token={token} navigate={navigate} />
      )}
    </div>
  );
}
