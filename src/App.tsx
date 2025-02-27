import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ExpenseTracker from "./pages/ExpenseTracker";
import ForgotPassword from "./pages/ForgotPassword";

const App = () => {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/expensetracker" element={<ExpenseTracker/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
};

export default App;
