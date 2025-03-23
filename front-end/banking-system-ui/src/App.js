<<<<<<< Updated upstream
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import axios from "axios";
import Login from "./Login";
import Home from "./Home";
import AccountList from "./components/AccountList";
import AccountNavbar from "./components/Navbar";
import CreateAccount from "./components/CreateAccount";
import UpdateAccount from "./components/UpdateAccount";
import DeleteAccount from "./components/DeleteAccount";
import "./App.css";
=======
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./Login";  // Import the Login component
import Home from "./Home";    // Import the Home component
import AccountList from "./components/AccountList";
>>>>>>> Stashed changes

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [showAllAccounts, setShowAllAccounts] = useState(false); // Default to false
    const [allAccounts, setAllAccounts] = useState([]);

    const handleLogin = (user) => {
        setIsLoggedIn(true);
        setCurrentUser(user);
    };

    const fetchAllAccounts = async () => {
        try {
            const response = await axios.get("http://localhost:8080/account-service/accounts");
            setAllAccounts(response.data);
            setShowAllAccounts(true); // Show the table after fetching data
        } catch (error) {
            console.error("Error fetching all accounts:", error);
        }
    };

    return (
        <Router>
<<<<<<< Updated upstream
            <div>
                {isLoggedIn && (
                    <div className="microservice-buttons">
                        <Link to="/home">
                            <button>Home</button>
                        </Link>
                        <Link to="/account">
                            <button onClick={() => setShowAllAccounts(false)}>Account Service</button>
                        </Link>
                        <Link to="/transaction">
                            <button>Transaction Service</button>
                        </Link>
                        <Link to="/loan">
                            <button>Loan Service</button>
                        </Link>
                    </div>
                )}

                {isLoggedIn && currentUser?.role === "ADMIN" && (
                    <AccountNavbar
                        currentUser={currentUser}
                        handleViewAllAccounts={fetchAllAccounts}
                    />
                )}

                <Routes>
                    <Route
                        path="/"
                        element={
                            isLoggedIn ? (
                                <Navigate to="/home" />
                            ) : (
                                <Login onLogin={handleLogin} />
                            )
                        }
                    />
                    <Route
                        path="/home"
                        element={isLoggedIn ? <Home /> : <Navigate to="/" />}
                    />

                    {/* Account Service Routes */}
                    <Route
                        path="/account"
                        element={
                            isLoggedIn ? (
                                <AccountList
                                    showAllAccounts={showAllAccounts}
                                    allAccounts={allAccounts}
                                    currentUser={currentUser}
                                />
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />
                    <Route
                        path="/account/create-account"
                        element={
                            isLoggedIn && currentUser?.role === "ADMIN" ? (
                                <CreateAccount fetchAllAccounts={fetchAllAccounts} />
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />
                    <Route
                        path="/account/update-account"
                        element={
                            isLoggedIn && currentUser?.role === "ADMIN" ? (
                                <UpdateAccount fetchAllAccounts={fetchAllAccounts} />
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />
                    <Route
                        path="/account/delete-account"
                        element={
                            isLoggedIn && currentUser?.role === "ADMIN" ? (
                                <DeleteAccount fetchAllAccounts={fetchAllAccounts} />
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />

                    {/* Other Microservices */}
                    <Route
                        path="/loan"
                        element={isLoggedIn ? <h1>Loan Microservice</h1> : <Navigate to="/" />}
                    />
                    <Route
                        path="/transaction"
                        element={isLoggedIn ? <h1>Transaction Microservice</h1> : <Navigate to="/" />}
                    />
                </Routes>
            </div>
=======
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/components" element={<AccountList />}/>
            </Routes>
>>>>>>> Stashed changes
        </Router>
    );
}

export default App;