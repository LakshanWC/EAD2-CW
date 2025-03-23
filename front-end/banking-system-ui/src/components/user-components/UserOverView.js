import React from "react";
import { Link, useLocation } from "react-router-dom";

const UserOverview = ({ currentUser }) => {
    const location = useLocation();

    // Check if the current route is a user-related page
    const isUserPage = location.pathname.startsWith("/user");

    // If not on a user page, don't render anything
    if (!isUserPage) return null;

    return (
        <div>
            <ul style={styles.list}>
                {/* Show regular user links for non-admin users */}
                {(!currentUser || currentUser.role !== "ADMIN") && (
                    <>
                        <li>
                            <Link to="/user-service/update" style={styles.link}>Update Profile</Link>
                        </li>
                        <li>
                            <Link to="/user-service/view" style={styles.link}>View Profile</Link>
                        </li>
                    </>
                )}

                {/* Show admin-only links for admin users */}
                {currentUser && currentUser.role === "ADMIN" && (
                    <>
                        <li>
                            <Link to="/user-service/update" style={styles.link}>Update User</Link>
                        </li>
                        <li>
                            <Link to="/user-service/delete" style={styles.link}>Delete User</Link>
                        </li>
                        <li>
                            <Link to="/user-service/all" style={styles.link}>All Users</Link>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
};

// Styles for the component
const styles = {
    list: {
        listStyleType: "none",
        padding: "0",
        fontSize: "18px",
    },
    link: {
        textDecoration: "none",
        color: "#007BFF",
        display: "block",
        padding: "10px",
        marginBottom: "5px",
        border: "1px solid #ddd",
        borderRadius: "5px",
    }
};

export default UserOverview;
