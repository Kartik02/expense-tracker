import { ReactNode, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebaseConfig";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ExpenseTracker from "./pages/ExpenseTracker";
import ForgotPassword from "./pages/ForgotPassword";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const AuthGuard = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-3xl" />
      </div>
    );
  }

  if (
    user &&
    ["/", "/login", "/register", "/forgot-password"].includes(location.pathname)
  ) {
    return <Navigate to="/expensetracker" replace />;
  }

  if (!user && location.pathname === "/expensetracker") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <AuthGuard>
              <Register />
            </AuthGuard>
          }
        />
        <Route
          path="/expensetracker"
          element={
            <AuthGuard>
              <ExpenseTracker />
            </AuthGuard>
          }
        />
        <Route
          path="/login"
          element={
            <AuthGuard>
              <Login />
            </AuthGuard>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthGuard>
              <ForgotPassword />
            </AuthGuard>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Analytics />
      <SpeedInsights />
    </Router>
  );
};

export default App;
