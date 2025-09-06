
import style from "./SignIn.module.css";
import { useNavigate } from "react-router-dom";

export default function SignUp() {

  const navigate = useNavigate();
  
  return (
    <div className={style.SignUp}>
      <div className={style.signupimg}>
        <img src="Loginbg.png" alt="Background" />
      </div>

      <div className={style.signup_content}>

        <img src="Logo.png" alt="Logo" />
        <h2>Sign Up</h2>
        <p>Register type</p>

        <button onClick={()=>navigate('/spatient')}>Patient</button>
        <button onClick={()=>navigate('/sDoctor')}>Doctor</button>
        <button>Hospital</button>
        <button>External</button>

      </div>
    </div>
  );
}
