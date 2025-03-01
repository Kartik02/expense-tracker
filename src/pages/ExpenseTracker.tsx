import { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
} from "firebase/firestore";

import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Transaction } from "../types";
import { FiTrash, FiX } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { clsx } from "clsx";

const ExpenseTracker = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchTransactions();
      }
    });
  }, []);

  const fetchTransactions = async () => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    const transactionsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Transaction[];
    setTransactions(transactionsData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!auth.currentUser || !description || !amount) {
      setLoading(false);
      return;
    }

    // Check if user is offline
    if (!navigator.onLine) {
      setTimeout(() => {
        setLoading(false); // Stop loading after simulating API delay
        setError("No internet connection. Please try again.");
      }, 2000);
      return;
    }

    try {
      const newTransaction = {
        description,
        amount: parseFloat(amount),
        timestamp: new Date().toISOString(),
        userId: auth.currentUser.uid,
      };
      await addDoc(collection(db, "transactions"), newTransaction);
      setDescription("");
      setAmount("");
      fetchTransactions();
    } catch (error) {
      console.error("Transaction failed", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false); // Stop spinner
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "transactions", id));
    fetchTransactions();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User successfully logged out.");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const formatCurrency = (amount: number): string => {
    if (amount >= 1_00_00_000) {
      return `₹${(amount / 1_00_00_000).toFixed(2)} Cr`;
    } else if (amount >= 1_00_000) {
      return `₹${(amount / 1_00_000).toFixed(2)} Lakh`;
    }
    return `₹${amount.toFixed(2)}`;
  };

  const formatDate = (date: Date) => date.toLocaleDateString("en-GB");

  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income + expenses;

  const transactionsPerPage = 5;
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);
  const displayedTransactions = transactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Expense Tracker
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>

          {/* Balance */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4 text-center">
            <h2 className="text-sm font-medium text-gray-500">YOUR BALANCE</h2>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(balance)}
            </p>
          </div>

          {/* Income & Expenses */}
          <div className="flex justify-between mb-6">
            <div className="w-1/2 text-center p-4 bg-green-100 rounded-lg mr-2">
              <h3 className="text-sm font-medium text-green-700">INCOME</h3>
              <p className="text-lg font-bold text-green-600">
                {formatCurrency(income)}
              </p>
            </div>
            <div className="w-1/2 text-center p-4 bg-red-100 rounded-lg">
              <h3 className="text-sm font-medium text-red-700">EXPENSES</h3>
              <p className="text-lg font-bold text-red-600">
                {formatCurrency(Math.abs(expenses))}
              </p>
            </div>
          </div>

          {/* Full History Modal */}
          <button
            onClick={() => setIsModalOpen(true)}
            className={`bg-blue-500 text-white px-4 py-2 rounded w-full mb-4 ${
              transactions.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={transactions.length === 0}
          >
            Full History
          </button>

          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Transaction History
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-600 hover:text-red-500"
                  >
                    <FiX size={24} />
                  </button>
                </div>
                <div className="space-y-2">
                  {displayedTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="grid grid-cols-[0.8fr_0.8fr_1.5fr_0.1fr] gap-1 p-3 border rounded-lg items-center bg-white shadow"
                    >
                      <span className="font-medium truncate">
                        {transaction.description}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(new Date(transaction.timestamp))}
                      </span>
                      <span
                        className={clsx(
                          transaction.amount > 0
                            ? "text-green-500"
                            : "text-red-500"
                        )}
                      >
                        {transaction.amount > 0
                          ? `+ ${formatCurrency(transaction.amount)}`
                          : `- ${formatCurrency(Math.abs(transaction.amount))}`}
                      </span>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash size={20} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="text-blue-500 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="text-blue-500 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Add Transaction Form */}
          <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-gray-300">
              Add new transaction
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={20}
                  required
                  className="mt-1 block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus-visible:outline-2  focus-visible:outline-blue-500"
                  placeholder="Enter Short description..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 ">
                  Amount
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  (-100 = expense, 100 = income)
                </p>
                <input
                  type="text" // Changed to "text" to prevent unwanted restrictions from "number" type
                  value={amount}
                  onChange={(e) => {
                    const input = e.target.value;

                    // Allow only numbers, one decimal point, and an optional leading "-"
                    if (/^-?\d*\.?\d*$/.test(input) && input.length <= 20) {
                      setAmount(input);
                    }
                  }}
                  required
                  className="mt-1 block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus-visible:outline-2  focus-visible:outline-blue-500"
                  placeholder="Enter amount..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md flex justify-center items-center"
                disabled={loading}
              >
                {loading ? (
                  <AiOutlineLoading3Quarters className="animate-spin text-white text-xl" />
                ) : (
                  "Add Transaction"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
