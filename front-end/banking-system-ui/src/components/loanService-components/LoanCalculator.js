import React, { useState } from "react";
import axios from "axios";

const LoanCalculator = () => {
    const [loanId, setLoanId] = useState("");
    const [loanDetails, setLoanDetails] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const fetchLoanDetails = async () => {
        setError("");
        setLoanDetails(null);
        setIsLoading(true);

        if (!loanId) {
            setError("Please enter a loan application ID.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/loan-service/loan/details/${loanId}`);
            setLoanDetails(response.data);
        } catch (error) {
            setError("Failed to fetch loan details. Please check the ID and try again.");
            console.error("Error fetching loan details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setLoanId("");
        setLoanDetails(null);
        setError("");
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Loan Calculator</h2>
                    <p style={styles.subtitle}>Check your loan details and repayment information</p>
                    <div style={styles.divider}></div>
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        Loan Application ID
                        <span style={styles.required}>*</span>
                    </label>
                    <div style={styles.inputGroup}>
                        <input
                            type="text"
                            value={loanId}
                            onChange={(e) => setLoanId(e.target.value)}
                            placeholder="Enter loan application ID"
                            style={styles.input}
                            disabled={isLoading}
                        />
                        <div style={styles.buttonGroup}>
                            <button
                                onClick={fetchLoanDetails}
                                style={isLoading ? styles.checkButtonDisabled : styles.checkButton}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <svg style={styles.spinner} viewBox="0 0 50 50">
                                            <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                                        </svg>
                                        Checking...
                                    </>
                                ) : (
                                    "Check Details"
                                )}
                            </button>
                            <button
                                onClick={resetForm}
                                style={styles.resetButton}
                                disabled={isLoading}
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                {loanDetails && (
                    <div style={styles.loanDetails}>
                        <h3 style={styles.detailsTitle}>Loan Details</h3>
                        <div style={styles.detailsGrid}>
                            <div style={styles.detailCard}>
                                <div style={styles.detailIcon}>
                                    <svg viewBox="0 0 24 24">
                                        <path fill="#4f46e5" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                                    </svg>
                                </div>
                                <div>
                                    <p style={styles.detailLabel}>First Name</p>
                                    <p style={styles.detailValue}>{loanDetails.firstName}</p>
                                </div>
                            </div>

                            <div style={styles.detailCard}>
                                <div style={styles.detailIcon}>
                                    <svg viewBox="0 0 24 24">
                                        <path fill="#4f46e5" d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,11.99H19V10.9C19,9.21 16.92,7.9 15.2,7.9C13.48,7.9 11.5,9.21 11.5,10.9V12H12V11.99M11,12V11.5C11,10.67 11.67,10 12.5,10C13.33,10 14,10.67 14,11.5V12H11Z" />
                                    </svg>
                                </div>
                                <div>
                                    <p style={styles.detailLabel}>Loan Type</p>
                                    <p style={styles.detailValue}>{loanDetails.loanType}</p>
                                </div>
                            </div>

                            <div style={styles.detailCard}>
                                <div style={styles.detailIcon}>
                                    <svg viewBox="0 0 24 24">
                                        <path fill="#4f46e5" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,7H13V11H17V13H13V17H11V13H7V11H11V7Z" />
                                    </svg>
                                </div>
                                <div>
                                    <p style={styles.detailLabel}>Loan Amount</p>
                                    <p style={styles.detailValue}>${loanDetails.amount.toLocaleString()}</p>
                                </div>
                            </div>

                            <div style={styles.detailCard}>
                                <div style={styles.detailIcon}>
                                    <svg viewBox="0 0 24 24">
                                        <path fill="#4f46e5" d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
                                    </svg>
                                </div>
                                <div>
                                    <p style={styles.detailLabel}>Interest</p>
                                    <p style={styles.detailValue}>${loanDetails.interest.toLocaleString()}</p>
                                </div>
                            </div>

                            <div style={styles.detailCard}>
                                <div style={styles.detailIcon}>
                                    <svg viewBox="0 0 24 24">
                                        <path fill="#4f46e5" d="M17,18A2,2 0 0,1 19,20A2,2 0 0,1 17,22C15.89,22 15,21.1 15,20C15,18.89 15.89,18 17,18M1,2H4.27L5.21,4H20A1,1 0 0,1 21,5C21,5.17 20.95,5.34 20.88,5.5L17.3,11.97C16.96,12.58 16.3,13 15.55,13H8.1L7.2,14.63L7.17,14.75A0.25,0.25 0 0,0 7.42,15H19V17H7C5.89,17 5,16.1 5,15C5,14.65 5.09,14.32 5.24,14.04L6.6,11.59L3,4H1V2M7,18A2,2 0 0,1 9,20A2,2 0 0,1 7,22C5.89,22 5,21.1 5,20C5,18.89 5.89,18 7,18M16,11L18.78,6H6.14L8.5,11H16Z" />
                                    </svg>
                                </div>
                                <div>
                                    <p style={styles.detailLabel}>Total Amount</p>
                                    <p style={styles.detailValue}>${loanDetails.totalAmount.toLocaleString()}</p>
                                </div>
                            </div>

                            <div style={styles.detailCard}>
                                <div style={styles.detailIcon}>
                                    <svg viewBox="0 0 24 24">
                                        <path fill="#4f46e5" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z" />
                                    </svg>
                                </div>
                                <div>
                                    <p style={styles.detailLabel}>Status</p>
                                    <p style={{
                                        ...styles.detailValue,
                                        color: loanDetails.status === 'APPROVED' ? '#10b981' :
                                            loanDetails.status === 'PENDING' ? '#f59e0b' : '#ef4444'
                                    }}>
                                        {loanDetails.status}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div style={styles.errorBox}>
                        <svg style={styles.errorIcon} viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
                        </svg>
                        <div>
                            <p style={styles.errorTitle}>Error</p>
                            <p style={styles.errorText}>{error}</p>
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
        maxWidth: "800px",
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
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
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
    buttonGroup: {
        display: "flex",
        gap: "10px",
    },
    checkButton: {
        flex: "1",
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#4f46e5",
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
    checkButtonDisabled: {
        flex: "1",
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#a0aec0",
        color: "#fff",
        cursor: "not-allowed",
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
    spinner: {
        animation: "rotate 1s linear infinite",
        height: "20px",
        width: "20px",
        color: "#ffffff",
    },
    loanDetails: {
        marginTop: "30px",
        padding: "20px",
        borderRadius: "8px",
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
    },
    detailsTitle: {
        fontSize: "20px",
        fontWeight: "600",
        color: "#2d3748",
        margin: "0 0 20px 0",
        textAlign: "center",
    },
    detailsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "15px",
    },
    detailCard: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        padding: "15px",
        borderRadius: "8px",
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    },
    detailIcon: {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        backgroundColor: "#e0e7ff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexShrink: "0",
    },
    detailLabel: {
        fontSize: "12px",
        color: "#718096",
        margin: "0 0 4px 0",
    },
    detailValue: {
        fontSize: "16px",
        fontWeight: "500",
        color: "#2d3748",
        margin: "0",
    },
    errorBox: {
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        marginTop: "20px",
        padding: "15px",
        borderRadius: "8px",
        backgroundColor: "#fef2f2",
        borderLeft: "4px solid #ef4444",
    },
    errorIcon: {
        width: "24px",
        height: "24px",
        color: "#ef4444",
        flexShrink: "0",
    },
    errorTitle: {
        color: "#ef4444",
        margin: "0 0 5px 0",
        fontSize: "16px",
        fontWeight: "600",
    },
    errorText: {
        color: "#ef4444",
        margin: "0",
        fontSize: "14px",
    },
};

// Add animation for spinner
const styleTag = document.createElement('style');
styleTag.innerHTML = `
    @keyframes rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    input:focus {
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

export default LoanCalculator;