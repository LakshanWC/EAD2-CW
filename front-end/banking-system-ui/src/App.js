import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import Login from "./Login"; // Import the Login component
import Home from "./Home"; // Import the Home component
import AccountList from "./components/AccountList"; // Import the AccountList component
import AccountNavbar from "./components/Navbar";

import TransactionOverview from "./components/transaction-components/TransactionOverview";
import TransactionHistory from "./components/transaction-components/TransactionHistory";
import Transfer from "./components/transaction-components/Transfer";

// Import Loan Service Components
import LoanOverview from "./components/loanService-components/LoanOverview";
import LoanApplicationForm from "./components/loanService-components/LoanApplicationForm";
import LoanCalculator from "./components/loanService-components/LoanCalculator";
import LoanStatus from "./components/loanService-components/LoanStatus";
import LoanApplicationDelete from "./components/loanService-components/LoanApplicationDelete";
import WithDrawAndDeposit from "./components/transaction-components/WithDrawAndDeposit";
import AdminView from "./components/transaction-components/AdminView";

//user service import
import Register from "./components/user-components/Register";
import UserOverView from "./components/user-components/UserOverView";
import UserUpdate from "./components/user-components/UserUpdate";
import UserDelete from "./components/user-components/UserDelete";
import AllUsers from "./components/user-components/AllUsers";
import Profile from "./components/user-components/Profile";

import axios from "axios";
import CreateAccount from "./components/CreateAccount";
import UpdateAccount from "./components/UpdateAccount";
import DeleteAccount from "./components/DeleteAccount";
import "./App.css";





function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [showAllAccounts, setShowAllAccounts] = useState(false); // Default to false
    const [allAccounts, setAllAccounts] = useState([]);

    const handleLogin = (user) => {
        setIsLoggedIn(true);
        setCurrentUser(user);
    };

    const handleLogout =()=>{
        setIsLoggedIn(false);
        setCurrentUser(null);
    }

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
                        <Link to="/loan-service">
                            <button>Loan Service</button>
                        </Link>
                        <Link to={"/user-service"}>
                            <button>User Service</button>
                        </Link>
                        <Link>
                            <button onClick={handleLogout} style={{background:"red"}}>Logout</button>
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
                                <Navigate to="/home" /> // Redirect to Home if already logged in

                            ) : (
                                <Login onLogin={handleLogin} />
                            )
                        }
                    />

                    <Route path="/register" element={<Register />} />

                    {/* Home Microservice */}
                    <Route
                        path="/home"
                        element={
                            isLoggedIn ? (
                                <>
                                    <Home user={currentUser} />
                                </>
                            ) : (
                                <Navigate to="/" /> // Redirect to Login if not logged in
                            )
                        }
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


                    {/*user microservice*/}
                    <Route path="/user-service/*"
                           element={
                               isLoggedIn?(
                                   <>
                                       <Routes>
                                           <Route path={"/"} element={<UserOverView currentUser={currentUser}/>}/>
                                           <Route path={"/update"} element={<UserUpdate/>}/>
                                           <Route path={"/delete"} element={<UserDelete/>}/>
                                           <Route path={"/all"} element={<AllUsers/>}/>
                                           <Route path={"/view"} element={<Profile currentUser={currentUser}/>}/>
                                       </Routes>
                                   </>
                               ):(
                                   <Navigate to="/"/>
                               )
                           }

                    />

                    {/* Loan Microservice */}
                    <Route
                        path="/loan-service/*"
                        element={
                            isLoggedIn ? (
                                <>
                                    <Routes>
                                        <Route path="/" element={<LoanOverview currentUser={currentUser} />} />
                                        <Route path="apply" element={<LoanApplicationForm currentUser={currentUser} />} />
                                        <Route path="calculator" element={<LoanCalculator currentUser={currentUser} />} />
                                        <Route path="status" element={<LoanStatus currentUser={currentUser} />} />
                                        <Route path="delete" element={<LoanApplicationDelete currentUser={currentUser} />} />
                                    </Routes>
                                </>
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />
                    <Route
                        path="/transaction/*"
                        element={
                            isLoggedIn ? (
                                <>
                                    {/* <TransactionOverview currentUser={currentUser}/>*/}
                                    <Routes>
                                        <Route path="/" element={<TransactionOverview currentUser={currentUser}/> } />
                                        <Route path="transfer" element={<Transfer />} />
                                        <Route path="history" element={<TransactionHistory />} />
                                        <Route path={"withdraw"} element={<WithDrawAndDeposit/>}/>
                                        <Route path={"deposit"} element={<WithDrawAndDeposit/>}/>
                                        <Route path={"admin-view"} element={<AdminView/>}/>
                                    </Routes>
                                </>
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
