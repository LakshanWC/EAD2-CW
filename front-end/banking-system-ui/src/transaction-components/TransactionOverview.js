import React from "react";
import { Link } from "react-router-dom"; // Assuming you are using React Router for navigation

const TransactionOverview = () => {
    return (
        <div>
            {/* <h1>Transaction Overview</h1>*/}
            <ul style={styles.list}>
                <li>
                    <Link to="/transaction/withdrawals" style={styles.link}>Withdraw</Link>
                </li>
                <li>
                    <Link to="/transaction/deposits" style={styles.link}>Deposit</Link>
                </li>
                <li>
                    <Link to="/transaction/transfer" style={styles.link}>Transfer</Link>
                </li>
                <li>
                    <Link to="/transaction/history" style={styles.link}>History</Link>
                </li>
            </ul>
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
