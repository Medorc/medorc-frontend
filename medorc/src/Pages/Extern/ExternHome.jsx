import React, { useState, useEffect } from "react";
import NavBar from "../../Components/NavBar";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import UserCard from "../../Components/UserCard";

export default function ExternHome() {
  const url = "http://localhost:3000";
  const navigate = useNavigate();

  const { token, role } = useAuth();
  const [user, setUser] = useState("");

   const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getuser = async () => {
      try {
        const response = await axios.get(`${url}/api/v1/extern/profile/`, {
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
      getuser();
    }
  }, [token]);



  if (!token) {
    navigate("/signup");
  }

  if (role !== "extern") {
    navigate("/signup");
  }
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <NavBar />

      <UserCard user={user} role={role} token={token} navigate={navigate} loading={loading} />
      
    </div>
  );
}
