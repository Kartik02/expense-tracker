import { ReactNode, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ExpenseTracker from "./pages/ExpenseTracker";
import ForgotPassword from "./pages/ForgotPassword";

const AuthGuard = ({ children }: { children: ReactNode  }) => {
    const location = useLocation();
    const [user, setUser] = useState(auth.currentUser);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            setUser(authUser);
        });
        return () => unsubscribe();
    }, []);

    // If the user is logged in and tries to access all other paths redirect to "/expensetracker"
    if (user && ["/", "/login", "/register", "/forgot-password"].includes(location.pathname)) {
        return <Navigate to="/expensetracker" replace />;
    }

    // If the user is not logged in and tries to access "/expensetracker", redirect to "/login"
    if (!user && location.pathname === "/expensetracker") {
        return <Navigate to="/login" replace />;
    }

    return children;
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthGuard><Register /></AuthGuard>} />
                <Route path="/expensetracker" element={<AuthGuard><ExpenseTracker /></AuthGuard>} />
                <Route path="/login" element={<AuthGuard><Login /></AuthGuard>} />
                <Route path="/forgot-password" element={<AuthGuard><ForgotPassword /></AuthGuard>} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
