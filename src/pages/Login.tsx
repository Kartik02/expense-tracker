import { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        auth.signOut();
        alert("Please verify your email before logging in.");
        return;
      }

      navigate("/expensetracker");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 text-center">
        <div className="flex justify-center mb-3">
          <FiLogIn size={40} color="#2563eb" />
        </div>

        <h2 className="text-2xl font-bold text-gray-700">Welcome Back</h2>
        <p className="text-gray-500 mb-5">
          Login to continue tracking your expenses
        </p>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg focus-visible:outline-2  focus-visible:outline-blue-500"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus-visible:outline-2  focus-visible:outline-blue-500"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 w-full rounded-lg shadow-md transition">
            Login
          </button>
        </form>
        <p className="text-gray-600 text-sm mt-4">
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-red-500 font-semibold hover:underline"
          >
            Forgot Password?
          </button>
        </p>
        <p className="text-gray-600 text-sm mt-4">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
