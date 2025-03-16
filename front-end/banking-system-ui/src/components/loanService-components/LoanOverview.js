import React from "react";
import { Link } from "react-router-dom"; // Assuming you are using React Router for navigation

const LoanOverview = () => {
    return (
        <div>
            <h1>Loan Service</h1>
            <ul style={styles.list}>
                <li>
                    <Link to="/loan-service/apply" style={styles.link}>Apply for a Loan</Link>
                </li>
                <li>
                    <Link to="/loan-service/calculator" style={styles.link}>Loan Calculator</Link>
                </li>
                <li>
                    <Link to="/loan-service/delete" style={styles.link}>Delete Loan Application</Link>
                </li>
                <li>
                    <Link to="/loan-service/status" style={styles.link}>Loan Status</Link>
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

export default LoanOverview;