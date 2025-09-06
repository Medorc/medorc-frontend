import React, { useState } from 'react';
import Profile from '../../../Components/Profile';
import Pstyle from "./SignUp.module.css";
import { toast } from 'react-toastify';
import axios from 'axios';

export default function SPatient() {
  const [data, setData] = useState({
    role: "patient",
    full_name: "",
    phone_no: "",
    email: "",
    password: "",
    confirmPassword: "",
    date_of_birth: "",
    gender: "",
    address: "",
    allergy: "",
    photo: null,
      smoking: false,
      alcoholism: false,
      tobacco: false,
      pregnancy: false,
      exercise: false,
    
  });

  const changehandle = (e) => {
  const { name, value, type, checked } = e.target;
  setData((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};


  const url = "http://localhost:3000/api/v1/auth/signup";
  
  const Signup = async (e) => {
    e.preventDefault();
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    delete data.confirmPassword;
    if (!data.full_name || !data.phone_no || !data.email || !data.password || !data.date_of_birth || !data.gender || !data.address) {
      toast.error("Please fill all the required fields");
      return;
    }

    try {
      const response = await axios.post(url, data);

      if (response.status === 201) {
        
        toast.success("Signup successful");
        
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className={Pstyle.SPatient}>
      <div className={Pstyle.header}>
        <img src="Logo.png" alt="logo" />
        <h2>Sign Up - Patient</h2>
      </div>

      <form onSubmit={Signup} className={Pstyle.form}>
        <Profile />
        <div className={Pstyle.formContent}>
          <div className={Pstyle.left}>
            <label htmlFor="fullName">Full Name</label>
            <input type="text" id="fullName" name="full_name" onChange={changehandle} value={data.full_name} />

            <label htmlFor="phoneNumber">Phone Number</label>
            <input type="text" id="phoneNumber" name="phone_no" onChange={changehandle} value={data.phone_no} />

            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" onChange={changehandle} value={data.email} />

            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" onChange={changehandle} value={data.password} />

            <label htmlFor="confirmPassword">Confirm Password</label>
             <input type="password" id="confirmPassword" name="confirmPassword" onChange={changehandle} value={data.confirmPassword} /> 
          </div>

          <div className={Pstyle.right}>
            <label htmlFor="dob">Date of Birth</label>
            <input type="date" id="dob" name="date_of_birth" onChange={changehandle} value={data.date_of_birth} />

            <label htmlFor="gender">Gender</label>
            <select id="gender" onChange={changehandle} name="gender" value={data.gender}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <label htmlFor="address">Address</label>
            <textarea id="address" name="address" onChange={changehandle} value={data.address}></textarea>

            <label htmlFor="allergyDetails">Allergy Details (If any)</label>
            <textarea id="allergy" name="allergy" onChange={changehandle} value={data.allergy}></textarea>
          </div>

          <div className={Pstyle.style}>
            <div className={Pstyle.lifestyle}>
              <h4>Lifestyle Info</h4>
                <label>
                  <input type="checkbox" name="smoking" onChange={changehandle} checked={data.smoking} /> Smoking
                </label>
                <label>
                  <input type="checkbox" name="alcoholism" onChange={changehandle} checked={data.alcoholism} /> Alcoholism
                </label>
                <label>
                  <input type="checkbox" name="tobacco" onChange={changehandle} checked={data.tobacco} /> Tobacco
                </label>
                <label>
                  <input type="checkbox" name="pregnancy" onChange={changehandle} checked={data.pregnancy} /> Pregnancy
                </label>
                <label>
                  <input type="checkbox" name="exercise" onChange={changehandle} checked={data.exercise} /> Exercise Habit
                </label>
                </div>
            <button className={Pstyle.signupBtn} type="submit">Sign Up</button>
          </div>
        </div>
      </form>
    </div>
  );
}
