import React, { useState } from "react";
import axios from "axios"; // For making HTTP requests

const LoanCalculator = () => {
    // State for loan application ID
    const [loanId, setLoanId] = useState("");

    // State for loan details fetched from the backend
    const [loanDetails, setLoanDetails] = useState(null);

    // State for error messages
    const [error, setError] = useState("");

    // Function to fetch loan details from the backend
    const fetchLoanDetails = async () => {
        setError("");
        setLoanDetails(null);

        if (!loanId) {
            setError("Please enter a loan application ID.");
            return;
        }

        try {
            // Fetch loan details from the backend
            const response = await axios.get(`http://localhost:8080/loan-service/loan/details/${loanId}`);
            setLoanDetails(response.data); // Store loan details in state
        } catch (error) {
            setError("Failed to fetch loan details. Please check the ID and try again.");
            console.error("Error fetching loan details:", error);
        }
    };

    // Function to reset the form
    const resetForm = () => {
        setLoanId("");
        setLoanDetails(null);
        setError("");
    };

    return (
        <div style={styles.container}>
            <h2>Loan Calculator</h2>

            {/* Loan ID Input */}
            <div style={styles.formGroup}>
                <label>Loan Application ID:</label>
                <input
                    type="text"
                    value={loanId}
                    onChange={(e) => setLoanId(e.target.value)}
                    placeholder="Enter loan application ID"
                    style={styles.input}
                />
                <button onClick={fetchLoanDetails} style={styles.button}>
                    Check
                </button>
                <button onClick={resetForm} style={styles.button}>
                    Reset
                </button>
            </div>

            {/* Display Loan Details */}
            {loanDetails && (
                <div style={styles.loanDetails}>
                    <h3>Loan Details</h3>
                    <div style={styles.detailsContainer}>
                        <p><strong>First Name:</strong> {loanDetails.firstName}</p>
                        <p><strong>Loan Amount:</strong> {loanDetails.amount.toLocaleString()}</p>
                        <p><strong>Total Amount:</strong> {loanDetails.totalAmount.toLocaleString()}</p>
                        <p><strong>Loan Type:</strong> {loanDetails.loanType}</p>
                        <p><strong>Interest:</strong> {loanDetails.interest.toLocaleString()}</p>
                        <p><strong>Status:</strong> {loanDetails.status}</p>
                    </div>
                </div>
            )}

            {/* Display error */}
            {error && <p style={styles.error}>{error}</p>}
        </div>
    );
};

// Styles
const styles = {
    container: {
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    formGroup: {
        marginBottom: "15px",
    },
    input: {
        width: "100%",
        padding: "8px",
        marginTop: "5px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        fontSize: "16px",
    },
    button: {
        padding: "10px 20px",
        margin: "5px",
        borderRadius: "4px",
        border: "none",
        backgroundColor: "#007BFF",
        color: "#fff",
        cursor: "pointer",
        fontSize: "16px",
    },
    loanDetails: {
        marginTop: "20px",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    detailsContainer: {
        lineHeight: "1.8",
    },
    error: {
        color: "red",
        marginTop: "10px",
        fontSize: "16px",
    },
};

export default LoanCalculator;