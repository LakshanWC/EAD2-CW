import React, { useState } from "react";
import axios from "axios"; // For making HTTP requests

const DeleteApplication = () => {
    // State for loan application ID
    const [loanId, setLoanId] = useState("");

    // State for success and error messages
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Function to handle delete confirmation
    const handleDelete = async () => {
        setError("");
        setMessage("");

        if (!loanId) {
            setError("Please enter a loan application ID.");
            return;
        }

        // Show confirmation popup
        const isConfirmed = window.confirm("Are you sure you want to delete this loan application?");
        if (!isConfirmed) {
            return; // Exit if the user cancels
        }

        try {
            // Send DELETE request to the backend
            const response = await axios.delete(
                `http://localhost:8080/loan-service/loan/delete/${loanId}`
            );

            // Handle success response
            setMessage("Loan application deleted successfully!");
            console.log("Response:", response.data);
        } catch (error) {
            // Handle error response
            setError("Failed to delete loan application. Please check the ID and try again.");
            console.error("Error deleting loan application:", error);
        }
    };

    // Function to reset the form
    const resetForm = () => {
        setLoanId("");
        setMessage("");
        setError("");
    };

    return (
        <div style={styles.container}>
            <h2>Delete Loan Application</h2>

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

            {/* Buttons */}
            <div style={styles.buttonGroup}>
                <button onClick={handleDelete} style={styles.deleteButton}>
                    Delete
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
    deleteButton: {
        padding: "10px 20px",
        borderRadius: "4px",
        border: "none",
        backgroundColor: "#dc3545", // Red color for delete button
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

export default DeleteApplication;