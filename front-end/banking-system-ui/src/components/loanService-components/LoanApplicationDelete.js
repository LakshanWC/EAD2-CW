import React, { useState } from "react";
import axios from "axios";

const DeleteApplication = () => {
    const [loanId, setLoanId] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleDelete = async () => {
        setError("");
        setMessage("");

        if (!loanId) {
            setError("Please enter a loan application ID.");
            return;
        }

        const isConfirmed = window.confirm("Are you sure you want to delete this loan application?");
        if (!isConfirmed) return;

        try {
            await axios.delete(`http://localhost:8080/loan-service/loan/delete/${loanId}`);
            setMessage("Loan application deleted successfully!");
        } catch (error) {
            setError("Failed to delete loan application. Please check the ID and try again.");
            console.error("Error deleting loan application:", error);
        }
    };

    const resetForm = () => {
        setLoanId("");
        setMessage("");
        setError("");
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Delete Loan Application</h2>
                    <div style={styles.divider}></div>
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Loan Application ID</label>
                    <input
                        type="text"
                        value={loanId}
                        onChange={(e) => setLoanId(e.target.value)}
                        placeholder="Enter loan application ID"
                        style={styles.input}
                    />
                </div>

                <div style={styles.buttonGroup}>
                    <button onClick={handleDelete} style={styles.deleteButton}>
                        Delete Application
                    </button>
                    <button onClick={resetForm} style={styles.resetButton}>
                        Clear Form
                    </button>
                </div>

                {message && (
                    <div style={styles.messageBox}>
                        <svg style={styles.successIcon} viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
                        </svg>
                        <p style={styles.success}>{message}</p>
                    </div>
                )}

                {error && (
                    <div style={styles.messageBox}>
                        <svg style={styles.errorIcon} viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
                        </svg>
                        <p style={styles.error}>{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Enhanced Styles
const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        padding: "20px",
    },
    card: {
        width: "100%",
        maxWidth: "500px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
        padding: "30px",
        transition: "all 0.3s ease",
    },
    header: {
        marginBottom: "25px",
    },
    title: {
        fontSize: "24px",
        fontWeight: "600",
        color: "#2d3748",
        margin: "0 0 10px 0",
        textAlign: "center",
    },
    divider: {
        height: "3px",
        background: "linear-gradient(90deg, #4f46e5, #ec4899)",
        borderRadius: "3px",
        width: "60px",
        margin: "0 auto",
    },
    formGroup: {
        marginBottom: "20px",
    },
    label: {
        display: "block",
        marginBottom: "8px",
        fontSize: "14px",
        fontWeight: "500",
        color: "#4a5568",
    },
    input: {
        width: "100%",
        padding: "12px 15px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        fontSize: "16px",
        transition: "all 0.3s",
        boxSizing: "border-box",
        backgroundColor: "#f8fafc",
    },
    inputFocus: {
        borderColor: "#4f46e5",
        boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.2)",
    },
    buttonGroup: {
        display: "flex",
        gap: "15px",
        marginTop: "25px",
    },
    deleteButton: {
        flex: "1",
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#ef4444",
        color: "#fff",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "500",
        transition: "all 0.2s",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
    },
    resetButton: {
        flex: "1",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        backgroundColor: "#fff",
        color: "#4a5568",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "500",
        transition: "all 0.2s",
    },
    success: {
        color: "#10b981",
        margin: "0",
        fontSize: "14px",
    },
    error: {
        color: "#ef4444",
        margin: "0",
        fontSize: "14px",
    },
    messageBox: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginTop: "20px",
        padding: "12px 15px",
        borderRadius: "8px",
        backgroundColor: "#f0fdf4",
    },
    successIcon: {
        width: "20px",
        height: "20px",
        color: "#10b981",
    },
    errorIcon: {
        width: "20px",
        height: "20px",
        color: "#ef4444",
    },
    // Hover effects
    deleteButtonHover: {
        backgroundColor: "#dc2626",
        transform: "translateY(-1px)",
    },
    resetButtonHover: {
        backgroundColor: "#f8fafc",
        borderColor: "#cbd5e0",
    },
};

// Adding hover effects
const addHoverEffects = () => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
        .delete-button:hover {
            background-color: ${styles.deleteButtonHover.backgroundColor} !important;
            transform: ${styles.deleteButtonHover.transform} !important;
        }
        .reset-button:hover {
            background-color: ${styles.resetButtonHover.backgroundColor} !important;
            border-color: ${styles.resetButtonHover.borderColor} !important;
        }
        input:focus {
            border-color: ${styles.inputFocus.borderColor} !important;
            box-shadow: ${styles.inputFocus.boxShadow} !important;
            outline: none;
        }
    `;
    document.head.appendChild(styleTag);
};

// Call the function to add hover effects
addHoverEffects();

export default DeleteApplication;