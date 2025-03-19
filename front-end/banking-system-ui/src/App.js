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
                        <Link to="/loan-service">
                            <button>Loan Service</button>
                        </Link>
                        <Link to={"/user-service"}>
                            <button>User Service</button>
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

                    <Route path="/register" element={<Register />} />



                    {/* Home Microservice */}
                    <Route
                        path="/home"
                        element={
                            isLoggedIn ? (
                                <>
                                    <AccountNavbar currentUser={currentUser} />
                                    <Home />
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

                    {/* Transaction Microservice */}
                    <Route
                        path="/transaction/*"
                        element={
                            isLoggedIn ? (
                                <>
                                    <h1>Transaction Microservice</h1>
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