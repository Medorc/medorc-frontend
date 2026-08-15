import { useState, useEffect } from "react";

import NavBar from "../../Components/NavBar";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { Loading } from "../../Components/Loading";
import { useNavigate } from "react-router-dom";
import UserCard from "../../Components/UserCard";

import { API_BASE_URL } from "../../config/api";

export default function ExternHome() {
  const navigate = useNavigate();

  const { token, role } = useAuth();

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || role !== "extern") {
      navigate("/");
    }
  }, [token, role, navigate]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/extern/profile`, {
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
    <div className="flex min-h-screen flex-col bg-background">
      <NavBar />
      {loading ? <Loading /> : <UserCard user={user} role={role} token={token} navigate={navigate} />}
    </div>
  );
}
