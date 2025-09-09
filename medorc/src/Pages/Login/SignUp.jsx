import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen">
      {/* Left Side Image */}
      <div className="hidden md:flex w-1/2 items-center justify-center ">
        <img
          src="Loginbg.png"
          alt="Background"
          className="max-w-full max-h-full object-cover"
        />
      </div>

      {/* Right Side Content */}
      <div className="flex flex-col w-full md:w-1/2 justify-center items-center p-8">
        <img src="Logo.png" alt="Logo" className="w-32 h-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign Up</h2>
        <p className="text-gray-600 mb-6">Register type</p>

        <div className="flex flex-col space-y-4 w-full max-w-xs">
          <button
            onClick={() => navigate("/patient")}
            className="w-full py-2 rounded-lg border-2 border-black  text-black m-2 font-medium  transition"
          >
            Patient
          </button>

          <button
            onClick={() => navigate("/sDoctor")}
            className="w-full py-2 rounded-lg border-2 border-black font-medium  m-2  transition"
          >
            Doctor
          </button>

          <button className="w-full py-2 rounded-lg border-2 border-black font-medium  transition">
            Hospital
          </button>

         <button className="w-full py-2 rounded-lg border-2 m-2 font-medium border-black transition">
  External
</button>

        </div>
      </div>
    </div>
  );
}
