import React, { useEffect ,useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import NavBar from "../../Components/NavBar";
import BackButton from "../../Components/BackButton";
import NavButton from "../../Components/NavButton";

import ProfileChange from "../../Components/ProfileChange";


export default function Account() {

  const url="http://localhost:3000";

  
  const [data, setData] = useState();
  const { token,role } = useAuth();

  const navigate = useNavigate();
   

    useEffect(() => {
    if (!token) navigate("/");

    const fetchData = async () => {
      try {
        const res = await axios.get(`${url}/api/v1/${role}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        setData(res.data.data);
        console.log(res.data);
       
      } catch (err) {
        toast.error("API Error: " + (err.response?.data || err.message));
      }
    };

    fetchData();
  }, [token]);

  

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center ">
      <NavBar />

      {/* Header */}
      <BackButton/>

      <NavButton />

      {/* Profile Image */}
      
      <ProfileChange data={data} />
      
    </div>
  );
}
