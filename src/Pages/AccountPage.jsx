import { useState, useEffect } from "react";

import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import NavBar from "../Components/NavBar";
import BackButton from "../Components/BackButton";
import NavButton from "../Components/NavButton";
import ProfileChange from "../Components/ProfileChange";
import { API_BASE_URL } from "../config/api";
import { Loading } from "../Components/Loading";

export default function AccountPage() {
  const navigate = useNavigate();
  const { token, role } = useAuth();

  const [data, setData] = useState({ email: "", phone_no: "", password: "", photo: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    if (!role) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/${role}/profile/basic`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const profile = res.data.data;
        if (profile?.name && !profile?.full_name) {
          profile.full_name = profile.name;
        }
        setData(profile);
      } catch (err) {
        toast.error("API Error: " + (err.response?.data || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, role, navigate]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-background">
      <NavBar />
      <BackButton />
      <NavButton />
      {loading ? (
        <Loading />
      ) : (
        <ProfileChange data={data} />
      )}
    </div>
  );
}
