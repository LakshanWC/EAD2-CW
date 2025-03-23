import React from "react";
import { Link, useLocation } from "react-router-dom";

const TransactionOverview = ({ currentUser }) => {
    const location = useLocation();

    // Check if the current route is a transaction-related page
    const isTransactionPage = location.pathname.startsWith("/transaction");

    // If not on a transaction page, don't render anything
    if (!isTransactionPage) return null;

    return (
        <div>
            <ul style={styles.list}>
                {/* Show regular transaction links for non-admin users */}
                {(!currentUser || currentUser.role !== "ADMIN") && (
                    <>
                        <li>
                            <Link to="/transaction/withdraw" style={styles.link}>Withdraw</Link>
                        </li>
                        <li>
                            <Link to="/transaction/deposit" style={styles.link}>Deposit</Link>
                        </li>
                        <li>
                            <Link to="/transaction/transfer" style={styles.link}>Transfer</Link>
                        </li>
                    </>
                )}

                {/* Show history link for all users (including admins) */}
                <li>
                    <Link to="/transaction/history" style={styles.link}>History</Link>
                </li>

                {/* Show admin-only links for admin users */}
                {currentUser && currentUser.role === "ADMIN" && (
                    <>
                        <li>
                            <Link to="/transaction/admin-view" style={styles.link}>Admin View</Link>
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

export default React.memo(TransactionOverview);