import React from "react";
import { Link } from "react-router-dom";

const LoanOverview = ({ currentUser }) => {
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Loan Services</h1>
                    <p style={styles.subtitle}>Manage all your loan needs in one place</p>
                    <div style={styles.divider}></div>
                </div>

                <div style={styles.servicesGrid}>
                    {/* Apply for Loan */}
                    <Link to="/loan-service/apply" style={styles.serviceCard}>
                        <div style={styles.serviceIcon} className="apply-icon">
                            <svg viewBox="0 0 24 24">
                                <path fill="#4f46e5" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                            </svg>
                        </div>
                        <h3 style={styles.serviceTitle}>Apply for Loan</h3>
                        <p style={styles.serviceDescription}>Start a new loan application</p>
                        <div style={styles.serviceArrow}>
                            <svg viewBox="0 0 24 24">
                                <path fill="#4f46e5" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                            </svg>
                        </div>
                    </Link>

                    {/* Loan Calculator */}
                    <Link to="/loan-service/calculator" style={styles.serviceCard}>
                        <div style={styles.serviceIcon} className="calculator-icon">
                            <svg viewBox="0 0 24 24">
                                <path fill="#4f46e5" d="M7,2H17A2,2 0 0,1 19,4V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V4A2,2 0 0,1 7,2M7,4V8H17V4H7M7,10V12H9V10H7M11,10V12H13V10H11M15,10V12H17V10H15M7,14V16H9V14H7M11,14V16H13V14H11M15,14V16H17V14H15M7,18V20H9V18H7M11,18V20H13V18H11M15,18V20H17V18H15Z" />
                            </svg>
                        </div>
                        <h3 style={styles.serviceTitle}>Loan Calculator</h3>
                        <p style={styles.serviceDescription}>Calculate your loan details</p>
                        <div style={styles.serviceArrow}>
                            <svg viewBox="0 0 24 24">
                                <path fill="#4f46e5" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                            </svg>
                        </div>
                    </Link>

                    {/* Delete Loan Application */}
                    <Link to="/loan-service/delete" style={styles.serviceCard}>
                        <div style={styles.serviceIcon} className="delete-icon">
                            <svg viewBox="0 0 24 24">
                                <path fill="#4f46e5" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                            </svg>
                        </div>
                        <h3 style={styles.serviceTitle}>Delete Application</h3>
                        <p style={styles.serviceDescription}>Remove a loan application</p>
                        <div style={styles.serviceArrow}>
                            <svg viewBox="0 0 24 24">
                                <path fill="#4f46e5" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                            </svg>
                        </div>
                    </Link>

                    {/* Loan Status (Admin Only) */}
                    {currentUser && currentUser.role === "ADMIN" && (
                        <Link to="/loan-service/status" style={styles.serviceCard}>
                            <div style={styles.serviceIcon} className="status-icon">
                                <svg viewBox="0 0 24 24">
                                    <path fill="#4f46e5" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z" />
                                </svg>
                            </div>
                            <h3 style={styles.serviceTitle}>Loan Status</h3>
                            <p style={styles.serviceDescription}>View and manage loan applications</p>
                            <div style={styles.serviceArrow}>
                                <svg viewBox="0 0 24 24">
                                    <path fill="#4f46e5" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                                </svg>
                            </div>
                        </Link>
                    )}
                </div>
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
        maxWidth: "1000px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
        padding: "40px",
        transition: "all 0.3s ease",
    },
    header: {
        marginBottom: "40px",
        textAlign: "center",
    },
    title: {
        fontSize: "32px",
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
    servicesGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
    },
    serviceCard: {
        display: "flex",
        flexDirection: "column",
        padding: "25px",
        borderRadius: "10px",
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        textDecoration: "none",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
    },
    serviceIcon: {
        width: "50px",
        height: "50px",
        borderRadius: "12px",
        backgroundColor: "#e0e7ff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "20px",
    },
    serviceTitle: {
        fontSize: "18px",
        fontWeight: "600",
        color: "#2d3748",
        margin: "0 0 8px 0",
    },
    serviceDescription: {
        fontSize: "14px",
        color: "#718096",
        margin: "0 0 20px 0",
    },
    serviceArrow: {
        position: "absolute",
        right: "20px",
        bottom: "20px",
        opacity: "0.7",
        transition: "all 0.3s ease",
    },
};

// Add hover effects
const styleTag = document.createElement('style');
styleTag.innerHTML = `
    .service-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        border-color: #c7d2fe;
    }
    .service-card:hover .service-arrow {
        transform: translateX(3px);
        opacity: 1;
    }
    .apply-icon:hover {
        background-color: #e0e7ff;
    }
    .calculator-icon:hover {
        background-color: #e0e7ff;
    }
    .delete-icon:hover {
        background-color: #fee2e2;
    }
    .status-icon:hover {
        background-color: #d1fae5;
    }
`;
document.head.appendChild(styleTag);

export default LoanOverview;