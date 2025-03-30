import React, { useState } from "react";
import axios from "axios";

const UpdateStatus = () => {
    const [loanId, setLoanId] = useState("");
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdateStatus = async () => {
        setError("");
        setMessage("");
        setIsUpdating(true);

        if (!loanId || !status) {
            setError("Please enter a loan application ID and select a status.");
            setIsUpdating(false);
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:8765/loan-service/loan/${loanId}?status=${status}`
            );

            setMessage("Status updated successfully!");
            console.log("Response:", response.data);
        } catch (error) {
            setError("Failed to update status. Please check the ID and try again.");
            console.error("Error updating status:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const resetForm = () => {
        setLoanId("");
        setStatus("");
        setMessage("");
        setError("");
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Update Loan Status</h2>
                    <p style={styles.subtitle}>Manage loan application statuses</p>
                    <div style={styles.divider}></div>
                </div>

                {/* Loan ID Input */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        Loan Application ID
                        <span style={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        value={loanId}
                        onChange={(e) => setLoanId(e.target.value)}
                        placeholder="Enter loan application ID"
                        style={styles.input}
                        disabled={isUpdating}
                    />
                </div>

                {/* Status Dropdown */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        Status
                        <span style={styles.required}>*</span>
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        style={styles.select}
                        disabled={isUpdating}
                    >
                        <option value="">Select status</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="DENIED">DENIED</option>
                    </select>
                </div>

                {/* Buttons */}
                <div style={styles.buttonGroup}>
                    <button
                        onClick={handleUpdateStatus}
                        style={isUpdating ? styles.updateButtonDisabled : styles.updateButton}
                        disabled={isUpdating}
                    >
                        {isUpdating ? (
                            <>
                                <svg style={styles.spinner} viewBox="0 0 50 50">
                                    <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                                </svg>
                                Updating...
                            </>
                        ) : "Update Status"}
                    </button>
                    <button
                        onClick={resetForm}
                        style={styles.resetButton}
                        disabled={isUpdating}
                    >
                        Clear Form
                    </button>
                </div>

                {/* Status Messages */}
                {message && (
                    <div style={styles.messageBox}>
                        <svg style={styles.successIcon} viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
                        </svg>
                        <div>
                            <p style={styles.statusTitle}>Success</p>
                            <p style={styles.statusText}>{message}</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div style={styles.errorBox}>
                        <svg style={styles.errorIcon} viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
                        </svg>
                        <div>
                            <p style={styles.statusTitle}>Error</p>
                            <p style={styles.statusText}>{error}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        padding: "20px",
    },
    card: {
        width: "100%",
        maxWidth: "600px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
        padding: "40px",
        transition: "all 0.3s ease",
    },
    header: {
        marginBottom: "30px",
        textAlign: "center",
    },
    title: {
        fontSize: "28px",
        fontWeight: "700",
        color: "#2d3748",
        margin: "0 0 5px 0",
    },
    subtitle: {
        fontSize: "16px",
        color: "#718096",
        margin: "0 0 15px 0",
    },
    divider: {
        height: "3px",
        background: "linear-gradient(90deg, #4f46e5, #ec4899)",
        borderRadius: "3px",
        width: "80px",
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
    required: {
        color: "#e53e3e",
        marginLeft: "4px",
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
    select: {
        width: "100%",
        padding: "12px 15px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        fontSize: "16px",
        transition: "all 0.3s",
        boxSizing: "border-box",
        backgroundColor: "#f8fafc",
        appearance: "none",
        backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 10px center",
        backgroundSize: "20px",
    },
    buttonGroup: {
        display: "flex",
        gap: "15px",
        marginTop: "30px",
    },
    updateButton: {
        flex: "1",
        padding: "15px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#4f46e5",
        color: "#fff",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "600",
        transition: "all 0.2s",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
    },
    updateButtonDisabled: {
        flex: "1",
        padding: "15px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#a0aec0",
        color: "#fff",
        cursor: "not-allowed",
        fontSize: "16px",
        fontWeight: "600",
        transition: "all 0.2s",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
    },
    resetButton: {
        flex: "1",
        padding: "15px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        backgroundColor: "#fff",
        color: "#4a5568",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "600",
        transition: "all 0.2s",
    },
    spinner: {
        animation: "rotate 1s linear infinite",
        height: "20px",
        width: "20px",
        color: "#ffffff",
    },
    messageBox: {
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        marginTop: "25px",
        padding: "16px",
        borderRadius: "8px",
        backgroundColor: "#f0fdf4",
        borderLeft: "4px solid #10b981",
    },
    errorBox: {
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        marginTop: "25px",
        padding: "16px",
        borderRadius: "8px",
        backgroundColor: "#fef2f2",
        borderLeft: "4px solid #ef4444",
    },
    successIcon: {
        width: "24px",
        height: "24px",
        color: "#10b981",
        flexShrink: "0",
    },
    errorIcon: {
        width: "24px",
        height: "24px",
        color: "#ef4444",
        flexShrink: "0",
    },
    statusTitle: {
        fontSize: "16px",
        fontWeight: "600",
        margin: "0 0 4px 0",
    },
    statusText: {
        fontSize: "14px",
        margin: "0",
    },
};

// Add animation for spinner
const styleTag = document.createElement('style');
styleTag.innerHTML = `
    @keyframes rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    input:focus, select:focus {
        border-color: #4f46e5 !important;
        box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2) !important;
        outline: none;
    }
    button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
`;
document.head.appendChild(styleTag);

export default UpdateStatus;