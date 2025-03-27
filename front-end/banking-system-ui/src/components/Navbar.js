import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar({ currentUser, handleViewAllAccounts }) {
    const location = useLocation();
    const isAccountPage = location.pathname.startsWith("/account");

    return (
        <>
            <nav className="navbar">
                <div className="navbar-logo">
                    <Link to="/">Account Service</Link>
                </div>
            </nav>

            {isAccountPage && currentUser && currentUser.role === "ADMIN" && (
                <div className="sidebar-wrapper">
                    <div className="sidebar">
                        <h2>Admin Functions</h2>
                        <ul className="sidebar-links">
                            <li>
                                <button
                                    onClick={handleViewAllAccounts}
                                    className="sidebar-button"
                                >
                                    View All Accounts
                                </button>
                            </li>
                            <li>
                                <Link to="/account/create-account" className="sidebar-button">
                                    Create Account
                                </Link>
                            </li>
                            <li>
                                <Link to="/account/update-account" className="sidebar-button">
                                    Update Account
                                </Link>
                            </li>
                            <li>
                                <Link to="/account/delete-account" className="sidebar-button">
                                    Delete Account
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
}


export default Navbar;
