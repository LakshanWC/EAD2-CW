import React from "react";
import { Link, useLocation } from "react-router-dom";

const TransactionOverview = ({ currentUser }) => {
    const location = useLocation();
    const isTransactionPage = location.pathname.startsWith("/transaction-service");

    if (!isTransactionPage) return null;

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Transaction Services</h1>
                    <p style={styles.subtitle}>Manage all your financial transactions</p>
                    <div style={styles.divider}></div>
                </div>

                <div style={styles.servicesGrid}>
                    {/* Show regular transaction links for non-admin users */}
                    {(!currentUser || currentUser.role !== "ADMIN") && (
                        <>
                            <Link to="/transaction-service/withdraw" style={styles.serviceCard} className="service-card">
                                <div style={styles.serviceIcon} className="withdraw-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 4H20V19H4V4ZM2 19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V4C22 2.89543 21.1046 2 20 2H4C2.89543 2 2 2.89543 2 4V19ZM12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12ZM8 16C8 14.8954 8.89543 14 10 14H14C15.1046 14 16 14.8954 16 16V17H8V16Z" fill="#4f46e5"/>
                                    </svg>
                                </div>
                                <h3 style={styles.serviceTitle}>Withdraw</h3>
                                <p style={styles.serviceDescription}>Withdraw money from your account</p>
                                <div style={styles.serviceArrow}>
                                    <svg viewBox="0 0 24 24">
                                        <path fill="#4f46e5" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                                    </svg>
                                </div>
                            </Link>

                            <Link to="/transaction-service/deposit" style={styles.serviceCard} className="service-card">
                                <div style={styles.serviceIcon} className="deposit-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 3V21H3V3H21ZM19 5H5V19H19V5ZM13 12V17H11V12H8L12 8L16 12H13Z" fill="#4f46e5"/>
                                    </svg>
                                </div>
                                <h3 style={styles.serviceTitle}>Deposit</h3>
                                <p style={styles.serviceDescription}>Deposit money into your account</p>
                                <div style={styles.serviceArrow}>
                                    <svg viewBox="0 0 24 24">
                                        <path fill="#4f46e5" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                                    </svg>
                                </div>
                            </Link>

                            <Link to="/transaction-service/transfer" style={styles.serviceCard} className="service-card">
                                <div style={styles.serviceIcon} className="transfer-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M16 17.01V10H14V17.01H11L15 21L19 17.01H16ZM9 3L5 6.99H8V14H10V6.99H13L9 3Z" fill="#4f46e5"/>
                                    </svg>
                                </div>
                                <h3 style={styles.serviceTitle}>Transfer</h3>
                                <p style={styles.serviceDescription}>Transfer money to another account</p>
                                <div style={styles.serviceArrow}>
                                    <svg viewBox="0 0 24 24">
                                        <path fill="#4f46e5" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                                    </svg>
                                </div>
                            </Link>
                        </>
                    )}

                    {/* Show history link for all users */}
                    <Link to="/transaction-service/history" style={styles.serviceCard} className="service-card">
                        <div style={styles.serviceIcon} className="history-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="#4f46e5"/>
                            </svg>
                        </div>
                        <h3 style={styles.serviceTitle}>Transaction History</h3>
                        <p style={styles.serviceDescription}>View your transaction history</p>
                        <div style={styles.serviceArrow}>
                            <svg viewBox="0 0 24 24">
                                <path fill="#4f46e5" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                            </svg>
                        </div>
                    </Link>

                    {/* Show admin-only links */}
                    {currentUser && currentUser.role === "ADMIN" && (
                        <Link to="/transaction-service/on-hold" style={styles.serviceCard} className="service-card">
                            <div style={styles.serviceIcon} className="admin-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="#4f46e5"/>
                                </svg>
                            </div>
                            <h3 style={styles.serviceTitle}>Transaction Manager</h3>
                            <p style={styles.serviceDescription}>View and approve pending transactions</p>
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
    .service-card:hover .service-icon {
        background-color: #c7d2fe;
    }
    .withdraw-icon:hover {
        background-color: #fee2e2 !important;
    }
    .deposit-icon:hover {
        background-color: #d1fae5 !important;
    }
    .transfer-icon:hover {
        background-color: #fef3c7 !important;
    }
    .history-icon:hover {
        background-color: #e0e7ff !important;
    }
    .admin-icon:hover {
        background-color: #c7d2fe !important;
    }
`;
document.head.appendChild(styleTag);

export default React.memo(TransactionOverview);