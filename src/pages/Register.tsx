import { useState } from "react";
import { auth } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FiUserPlus } from "react-icons/fi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.endsWith("@gmail.com")) {
      setError("Please register with a valid Gmail account.");
      return;
    }

    if (password.length < 6 || confirmPassword.length < 6) {
      setError("Password should be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Send verification email
      sendEmailVerification(user).then(() => {
        alert("Verification email sent. Please check your inbox.");
      });

      // Log out user after registration (ensures they must verify email first)
      auth.signOut();
    } catch (error: any) {
      setError(error.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 text-center">
        <div className="flex justify-center mb-3">
          <FiUserPlus size={40} color="#16A34A" />
        </div>
        <h2 className="text-2xl font-bold text-gray-700">Create an Account</h2>
        <p className="text-gray-500 mb-5">Track your expenses effortlessly</p>
        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <p className="text-red-600 text-sm font-semibold bg-red-100 p-2 rounded-md">
              {error}
            </p>
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg focus-visible:outline-2 focus-visible:outline-green-500"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              className="w-full p-3 border border-gray-300 rounded-lg focus-visible:outline-2 focus-visible:outline-green-500 pr-10"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute top-3 right-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full p-3 border border-gray-300 rounded-lg focus-visible:outline-2 focus-visible:outline-green-500 pr-10"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute top-3 right-3 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold p-3 w-full rounded-lg shadow-md transition">
            Register
          </button>
        </form>
        <p className="text-gray-600 text-sm mt-4">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-green-600 font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
