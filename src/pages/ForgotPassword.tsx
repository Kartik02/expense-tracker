import { useState } from "react";
import { auth } from "../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FiMail } from "react-icons/fi";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Password reset link has been sent to your email.");
            setTimeout(() => navigate("/login"), 5000); // Redirect after 5s
        } catch {
            setError("Email not found. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-96 text-center">
                <div className="flex justify-center mb-3">
                    <FiMail size={40} color="#DC2626" />
                </div>
                <h2 className="text-2xl font-bold text-gray-700">Reset Password</h2>
                <p className="text-gray-500 mb-5">Enter your email to receive a reset link</p>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {message && <p className="text-green-500 text-sm">{message}</p>}
                <form onSubmit={handleSendOTP} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full p-3 border border-gray-300 rounded-lg focus-visible:outline-2  focus-visible:outline-red-500"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button className="bg-red-600 hover:bg-red-700 text-white font-semibold p-3 w-full rounded-lg shadow-md transition">
                        Send Reset Link
                    </button>
                </form>
                <p className="text-gray-600 text-sm mt-4">
                    Remember your password?{" "}
                    <button onClick={() => navigate("/login")} className="text-blue-600 font-semibold hover:underline">
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;