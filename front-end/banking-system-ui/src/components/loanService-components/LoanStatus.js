import React, { useState } from "react";
import axios from "axios"; // For making HTTP requests

const UpdateStatus = () => {
    // State for loan application ID
    const [loanId, setLoanId] = useState("");

    // State for selected status
    const [status, setStatus] = useState("");

    // State for success and error messages
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Function to handle status update
    const handleUpdateStatus = async () => {
        setError("");
        setMessage("");

        if (!loanId || !status) {
            setError("Please enter a loan application ID and select a status.");
            return;
        }

        try {
            // Send a PUT request to update the status
            const response = await axios.put(
                `http://localhost:8080/loan-service/loan/updateStatus/${loanId}?status=${status}`
            );

            // Handle success response
            setMessage("Status updated successfully!");
            console.log("Response:", response.data);
        } catch (error) {
            // Handle error response
            setError("Failed to update status. Please check the ID and try again.");
            console.error("Error updating status:", error);
        }
    };

    // Function to reset the form
    const resetForm = () => {
        setLoanId("");
        setStatus("");
        setMessage("");
        setError("");
    };

    return (
        <div style={styles.container}>
            <h2>Update Loan Status</h2>

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
            </div>

            {/* Status Dropdown */}
            <div style={styles.formGroup}>
                <label>Status:</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    style={styles.input}
                >
                    <option value="">Select status</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="DENIED">DENIED</option>
                </select>
            </div>

            {/* Buttons */}
            <div style={styles.buttonGroup}>
                <button onClick={handleUpdateStatus} style={styles.button}>
                    Update
                </button>
                <button onClick={resetForm} style={styles.button}>
                    Reset
                </button>
            </div>

            {/* Display success or error message */}
            {message && <p style={styles.success}>{message}</p>}
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
    buttonGroup: {
        display: "flex",
        gap: "10px",
        marginTop: "20px",
    },
    button: {
        padding: "10px 20px",
        borderRadius: "4px",
        border: "none",
        backgroundColor: "#007BFF",
        color: "#fff",
        cursor: "pointer",
        fontSize: "16px",
    },
    success: {
        color: "green",
        marginTop: "10px",
        fontSize: "16px",
    },
    error: {
        color: "red",
        marginTop: "10px",
        fontSize: "16px",
    },
};

export default UpdateStatus;