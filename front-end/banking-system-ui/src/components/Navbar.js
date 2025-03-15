import React from "react";
<<<<<<< Updated upstream
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar({ currentUser }) {
    const location = useLocation(); // Get the current route

    // Only show account-related links if on the account page
    const isAccountPage = location.pathname.startsWith("/account");

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/home">ABC Bank</Link> {/* Replace "Home" with "ABC Bank" */}
            </div>
            {isAccountPage && ( // Only show these links on the account page
                <ul className="navbar-links">
                    <li>
                        <Link to="/account/balance">View Balance</Link>
                    </li>
                    <li>
                        <Link to="/account/upBalance">Deposit/Withdraw</Link>
                    </li>

                    {/* Admin-only links */}
                    {currentUser && currentUser.role === "ADMIN" && (
                        <>
                            <li>
                                <Link to="/account/accounts">View All Accounts</Link>
                            </li>
                            <li>
                                <Link to="/account/create-account">Create Account</Link>
                            </li>
                            <li>
                                <Link to="/account/update-account">Update Account</Link>
                            </li>
                            <li>
                                <Link to="/account/delete-account">Delete Account</Link>
                            </li>
                        </>
                    )}
                </ul>
            )}
        </nav>
    );
}

export default Navbar;
=======
import {Link} from "react-router-dom";
import "./Navbar.css";

function Navbar({currentUser}){
    return(
        <nav classname="navbar">
            <div className="navbar-logo">
                <Link to="/">Account Service</Link>
            </div>
        </nav>
    )
}
>>>>>>> Stashed changes
