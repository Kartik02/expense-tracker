import { useState } from "react";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FiUserPlus } from "react-icons/fi";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/login");
        } catch {
            setError("Please register with valid gmail account.");
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
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <form onSubmit={handleRegister} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 border border-gray-300 rounded-lg focus-visible:outline-2 focus-visible:outline-green-500"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 border border-gray-300 rounded-lg focus-visible:outline-2 focus-visible:outline-green-500"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full p-3 border border-gray-300 rounded-lg focus-visible:outline-2 focus-visible:outline-green-500"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button className="bg-green-600 hover:bg-green-700 text-white font-semibold p-3 w-full rounded-lg shadow-md transition">
                        Register
                    </button>
                </form>
                <p className="text-gray-600 text-sm mt-4">
                    Already have an account?{" "}
                    <button onClick={() => navigate("/login")} className="text-green-600 font-semibold hover:underline">
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Register;
