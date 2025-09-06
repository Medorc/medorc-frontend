import React, { useState } from "react";
import style from "./SignIn.module.css";
import { toast } from "react-toastify";
import axios from "axios";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  

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
    console.log(data);
    const { role, email, password } = data;
    if (!email || !password || !role) {
      toast.error("Please fill all fields");
      return;
    }
    

    try {
      const response = await axios.post(url, data);
      if (response.status === 200) {

        toast.success("Login Successful");
      }
    } catch (error) {
      toast.error("Login Failed");
    }
  };

  return (
    <div className={style.Signin}>
      <div className={style.signinimg}>
        <img src="Loginbg.png" alt="Background" />
      </div>

      <div className={style.signin_content}>
        <img src="Logo.png" alt="Logo" />

        <div className={style.signin_form}>
          <h2>Sign In</h2>
          <form onSubmit={handlesubmit} className={style.form}>
            <label htmlFor="role">Sign In as</label>
            <select
              id="role"
              name="role"
              value={data.role}
              onChange={changehandle}
            >
              <option value="">--Select Role--</option>
              <option value="patient" >Patient</option>
              <option value="Doctor">Doctor</option>
              <option value="Hospital">Hospital</option>
              <option value="External">External</option>
            </select>

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={changehandle}
              value={data.email}
            />

            <label htmlFor="password">Password</label>
            <div className={style.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                onChange={changehandle}
                value={data.password}
              />
              <button
                type="button"
                className={style.toggleBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁" : "👁"}
              </button>
            </div>

            <button type="submit" className={style.signinbtn}>
              Sign In
            </button>
          </form>

          <div className={style.credentials}>
            <p>Forgot password?</p>
            <p>Not a user? Sign up</p>
          </div>
        </div>
      </div>
    </div>
  );
}
