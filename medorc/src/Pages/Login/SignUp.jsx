import { useNavigate } from "react-router-dom";
import { FaUserInjured, FaUserMd, FaHospital, FaUserTie } from "react-icons/fa";

const roleOptions = [
  {
    label: "Patient",
    path: "/patient",
    icon: FaUserInjured,
    description: "Register to manage your health records",
    color: "from-blue-500 to-blue-600",
    hoverColor: "hover:from-blue-600 hover:to-blue-700",
  },
  {
    label: "Doctor",
    path: "/sDoctor",
    icon: FaUserMd,
    description: "Join as a healthcare professional",
    color: "from-emerald-500 to-emerald-600",
    hoverColor: "hover:from-emerald-600 hover:to-emerald-700",
  },
  {
    label: "Hospital",
    path: "/sHospital",
    icon: FaHospital,
    description: "Register your healthcare facility",
    color: "from-purple-500 to-purple-600",
    hoverColor: "hover:from-purple-600 hover:to-purple-700",
  },
  {
    label: "External",
    path: "/sExternal",
    icon: FaUserTie,
    description: "External partner or viewer access",
    color: "from-amber-500 to-amber-600",
    hoverColor: "hover:from-amber-600 hover:to-amber-700",
  },
];

export default function SignUp() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Left Side - Hero Image */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('Loginbg.png')] bg-cover bg-center opacity-30"></div>
        <div className="relative z-10 text-center px-12">
          <img src="Logo.png" alt="Logo" className="w-40 mx-auto mb-8 drop-shadow-2xl" />
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to Medorc</h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Your trusted platform for seamless healthcare management.
            Connect, manage, and access medical records securely.
          </p>
        </div>
        {/* Decorative Elements */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Right Side - Registration Options */}
      <div className="flex flex-col w-full lg:w-1/2 justify-center items-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <img src="Logo.png" alt="Logo" className="w-28 h-auto" />
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Create Account</h2>
            <p className="text-gray-500">Select your account type to get started</p>
          </div>

          {/* Role Selection Cards */}
          <div className="space-y-4">
            {roleOptions.map((role) => (
              <button
                key={role.label}
                onClick={() => navigate(role.path)}
                className={`w-full group flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-200 
                           shadow-sm hover:shadow-lg hover:border-transparent hover:scale-[1.02]
                           transition-all duration-300 ease-out`}
              >
                {/* Icon Container */}
                <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${role.color} ${role.hoverColor}
                                flex items-center justify-center transition-all duration-300
                                group-hover:shadow-lg group-hover:scale-110`}>
                  <role.icon className="text-white text-2xl" />
                </div>

                {/* Text Content */}
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-800 text-lg group-hover:text-gray-900 transition-colors">
                    {role.label}
                  </h3>
                  <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                    {role.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex-shrink-0 text-gray-300 group-hover:text-gray-500 transition-colors">
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-gray-500">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/")}
                className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
