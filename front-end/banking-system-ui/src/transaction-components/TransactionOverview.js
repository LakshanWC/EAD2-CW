import React from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation for route checking

const TransactionOverview = ({ currentUser }) => {
    const location = useLocation(); // Get the current route

    // Only show transaction-related links if on the transaction page
    const isTransactionPage = location.pathname.startsWith("/transaction");

    return (
        <div>
            {isTransactionPage && ( // Only show these links on the transaction page
                <ul style={styles.list}>
                    {/* Show regular transaction links only if the user is not an admin */}
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
                            <li>
                                <Link to="/transaction/history" style={styles.link}>History</Link>
                            </li>
                        </>
                    )}

                    {/* Show admin-only links and history if the user is an admin */}
                    {currentUser && currentUser.role === "ADMIN" && (
                        <>
                            <li>
                                <Link to="/transaction/admin-view" style={styles.link}>Admin View</Link>
                            </li>
                            <li>
                                <Link to="/transaction/admin-edit" style={styles.link}>Admin Edit</Link>
                            </li>
                        </>
                    )}
                </ul>
            )}
        </div>
    );
};

// Add some basic styles
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

export default TransactionOverview;