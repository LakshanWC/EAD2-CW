// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import Login from "./Login"; // Import the Login microservice
import AccountNavbar from "./components/Navbar"; // Import the Account microservice's navbar
import AccountList from "./components/AccountList"; // Import the Account microservice's main component

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
    const [currentUser, setCurrentUser] = useState(null); // Track current user

    // Simulate login
    const handleLogin = (user) => {
        setIsLoggedIn(true);
        setCurrentUser(user);
    };

    return (
        <Router>
            <div>
                {/* Show microservice buttons only if logged in */}
                {isLoggedIn && (
                    <div className="microservice-buttons">
                        <Link to="/home">
                            <button>Home</button>
                        </Link>
                        <Link to="/account">
                            <button>Account Service</button>
                        </Link>
                        <Link to="/transaction">
                            <button>Transaction Service</button>
                        </Link>
                        <Link to="/loan">
                            <button>Loan Service</button>
                        </Link>
                    </div>
                )}

                {/* Routes for each microservice */}
                <Routes>
                    {/* Login Microservice (default route) */}
                    <Route
                        path="/"
                        element={
                            isLoggedIn ? (
                                <Navigate to="/home" /> // Redirect to Home if already logged in
                            ) : (
                                <Login onLogin={handleLogin} /> // Show Login page if not logged in
                            )
                        }
                    />

                    {/* Home Microservice */}
                    <Route
                        path="/home"
                        element={
                            isLoggedIn ? (
                                <>
                                    <AccountNavbar currentUser={currentUser} />
                                    <h1>Welcome to ABC Bank</h1>
                                </>
                            ) : (
                                <Navigate to="/" /> // Redirect to Login if not logged in
                            )
                        }
                    />

                    {/* Account Microservice */}
                    <Route
                        path="/account/*"
                        element={
                            isLoggedIn ? (
                                <>
                                    <AccountNavbar currentUser={currentUser} />
                                    <Routes>
                                        <Route path="/" element={<AccountList />} />
                                        <Route path="/balance" element={<h1>View Balance Page</h1>} />
                                        <Route path="/upBalance" element={<h1>Deposit/Withdraw Page</h1>} />
                                    </Routes>
                                </>
                            ) : (
                                <Navigate to="/" /> // Redirect to Login if not logged in
                            )
                        }
                    />

                    {/* User Microservice */}
                    <Route
                        path="/loan"
                        element={
                            isLoggedIn ? (
                                <h1>Loan Microservice</h1>
                            ) : (
                                <Navigate to="/" /> // Redirect to Login if not logged in
                            )
                        }
                    />

                    {/* Transaction Microservice */}
                    <Route
                        path="/transaction"
                        element={
                            isLoggedIn ? (
                                <h1>Transaction Microservice</h1>
                            ) : (
                                <Navigate to="/" /> // Redirect to Login if not logged in
                            )
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;