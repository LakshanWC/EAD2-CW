import React from "react";
import { useNavigate } from "react-router-dom";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            errorMessage: null
        };
    }

    handleRefresh = async () => {
        this.setState({ isLoading: true, errorMessage: null });

        try {
            console.log("Fetching account data...");
            const accountResponse = await fetch("http://localhost:8080/account-service/accounts");

            if (!accountResponse.ok) {
                throw new Error(`Account Service Error: ${accountResponse.statusText}`);
            }

            const accountData = await accountResponse.json();

            const transformedData = accountData.map(account => ({
                accountNumber: account.accountNumber,
                balance: account.balance,
                accountType: account.accountType,
                status: account.status,
                lastUpdatedAt: new Date().toISOString()
            }));

            console.log("Transformed Data:", transformedData);

            console.log("Sending data to transaction-service...");
            const transactionResponse = await fetch("http://localhost:8085/transaction-service/accounts/batch", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(transformedData)
            });

            if (!transactionResponse.ok) {
                throw new Error(`Transaction Service Error: ${transactionResponse.statusText}`);
            }

            console.log("Account data refreshed and updated in transaction-service!");
        } catch (error) {
            console.error("Failed to refresh account data:", error);
            this.setState({ errorMessage: error.message });
        } finally {
            this.setState({ isLoading: false });
        }
    };

    componentDidMount() {
        this.handleRefresh();
    }

    render() {
        const { user } = this.props;
        const { isLoading, errorMessage } = this.state;
        const styles = this.getStyles();

        return (
            <div style={styles.container}>
                <div style={{ ...styles.content, paddingTop: '80px' }}>
                    <div style={styles.header}>
                        <h1 style={styles.title}>Welcome to ABC Bank</h1>
                        <p style={styles.subtitle}>Your trusted financial partner</p>
                        <div style={styles.divider}></div>
                    </div>

                    {user && (
                        <div style={styles.userGreeting}>
                            <svg style={styles.userIcon} viewBox="0 0 24 24">
                                <path fill="#4f46e5" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                            </svg>
                            <div>
                                <p style={styles.welcomeText}>Welcome back,</p>
                                <p style={styles.username}>{user.username}</p>
                                <p style={styles.userRole}>{user.role === "ADMIN" ? "Administrator" : "Customer"}</p>
                            </div>
                        </div>
                    )}

                    {user && user.role === "ADMIN" && (
                        <div style={styles.adminSection}>
                            <div style={styles.syncCard}>
                                <h3 style={styles.syncTitle}>Account Data Sync</h3>
                                <p style={styles.syncDescription}>Synchronize account data with transaction service</p>

                                <button
                                    onClick={this.handleRefresh}
                                    disabled={isLoading}
                                    style={isLoading ? styles.syncButtonDisabled : styles.syncButton}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg style={styles.spinner} viewBox="0 0 50 50">
                                                <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                                            </svg>
                                            Syncing...
                                        </>
                                    ) : (
                                        <>
                                            <svg style={styles.syncIcon} viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M12,18A6,6 0 0,1 6,12C6,11 6.25,10.03 6.7,9.2L5.24,7.74C4.46,8.97 4,10.43 4,12A8,8 0 0,0 12,20V23L16,19L12,15M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12C18,13 17.75,13.97 17.3,14.8L18.76,16.26C19.54,15.03 20,13.57 20,12A8,8 0 0,0 12,4Z" />
                                            </svg>
                                            Sync Now
                                        </>
                                    )}
                                </button>

                                {errorMessage && (
                                    <div style={styles.errorBox}>
                                        <svg style={styles.errorIcon} viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
                                        </svg>
                                        <p style={styles.errorText}>{errorMessage}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div style={styles.quickActions}>
                        <h3 style={styles.sectionTitle}>Quick Actions</h3>
                        <div style={styles.actionButtons}>
                            <button style={styles.actionButton}>
                                <svg style={styles.actionIcon} viewBox="0 0 24 24">
                                    <path fill="#4f46e5" d="M11,13.5V21.5H3V13.5H11M12,2L17.5,11H6.5L12,2M17.5,13C20,13 22,15 22,17.5C22,20 20,22 17.5,22C15,22 13,20 13,17.5C13,15 15,13 17.5,13Z" />
                                </svg>
                                Transfer Funds
                            </button>
                            <button style={styles.actionButton}>
                                <svg style={styles.actionIcon} viewBox="0 0 24 24">
                                    <path fill="#4f46e5" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,10.5A1.5,1.5 0 0,0 10.5,12A1.5,1.5 0 0,0 12,13.5A1.5,1.5 0 0,0 13.5,12A1.5,1.5 0 0,0 12,10.5M7.5,10.5A1.5,1.5 0 0,0 6,12A1.5,1.5 0 0,0 7.5,13.5A1.5,1.5 0 0,0 9,12A1.5,1.5 0 0,0 7.5,10.5M16.5,10.5A1.5,1.5 0 0,0 15,12A1.5,1.5 0 0,0 16.5,13.5A1.5,1.5 0 0,0 18,12A1.5,1.5 0 0,0 16.5,10.5Z" />
                                </svg>
                                View Accounts
                            </button>
                            <button style={styles.actionButton}>
                                <svg style={styles.actionIcon} viewBox="0 0 24 24">
                                    <path fill="#4f46e5" d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,11.99H19V10.9C19,9.21 16.92,7.9 15.2,7.9C13.48,7.9 11.5,9.21 11.5,10.9V12H12V11.99M11,12V11.5C11,10.67 11.67,10 12.5,10C13.33,10 14,10.67 14,11.5V12H11Z" />
                                </svg>
                                Security
                            </button>
                        </div>
                    </div>

                    <div style={styles.recentActivity}>
                        <h3 style={styles.sectionTitle}>Recent Activity</h3>
                        <div style={styles.activityList}>
                            <div style={styles.activityItem}>
                                <div style={styles.activityIcon}>
                                    <svg viewBox="0 0 24 24">
                                        <path fill="#4f46e5" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M16.59,7.58L10,14.17L7.41,11.59L6,13L10,17L18,9L16.59,7.58Z" />
                                    </svg>
                                </div>
                                <div>
                                    <p style={styles.activityTitle}>System Update</p>
                                    <p style={styles.activityTime}>Just now</p>
                                </div>
                            </div>
                            <div style={styles.activityItem}>
                                <div style={styles.activityIcon}>
                                    <svg viewBox="0 0 24 24">
                                        <path fill="#4f46e5" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M16.59,7.58L10,14.17L7.41,11.59L6,13L10,17L18,9L16.59,7.58Z" />
                                    </svg>
                                </div>
                                <div>
                                    <p style={styles.activityTitle}>Accounts Synced</p>
                                    <p style={styles.activityTime}>Today, 10:30 AM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    getStyles() {
        return {
            container: {
                minHeight: "100vh",
                backgroundColor: "#f7fafc",
                color: "#2d3748",
                padding: "20px"
            },
            content: {
                maxWidth: "1200px",
                margin: "0 auto"
            },
            header: {
                textAlign: "center",
                marginBottom: "40px"
            },
            title: {
                fontSize: "2.5rem",
                fontWeight: "700",
                marginBottom: "10px",
                color: "#2d3748"
            },
            subtitle: {
                fontSize: "1.2rem",
                color: "#718096",
                marginBottom: "20px"
            },
            divider: {
                height: "4px",
                background: "linear-gradient(90deg, #4f46e5, #ec4899)",
                width: "80px",
                margin: "0 auto",
                borderRadius: "2px"
            },
            userGreeting: {
                display: "flex",
                alignItems: "center",
                gap: "20px",
                marginBottom: "40px",
                padding: "20px",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)"
            },
            userIcon: {
                width: "48px",
                height: "48px",
                color: "#3182ce"
            },
            welcomeText: {
                fontSize: "1rem",
                color: "#718096",
                margin: "0 0 4px 0"
            },
            username: {
                fontSize: "1.5rem",
                fontWeight: "600",
                margin: "0 0 4px 0",
                color: "#2d3748"
            },
            userRole: {
                fontSize: "0.9rem",
                color: "#38a169",
                margin: "0",
                fontWeight: "500"
            },
            adminSection: {
                marginBottom: "40px"
            },
            syncCard: {
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                padding: "25px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                marginBottom: "20px"
            },
            syncTitle: {
                fontSize: "1.25rem",
                fontWeight: "600",
                margin: "0 0 8px 0",
                color: "#2d3748"
            },
            syncDescription: {
                fontSize: "1rem",
                color: "#718096",
                margin: "0 0 20px 0"
            },
            syncButton: {
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#4f46e5",
                color: "#ffffff",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "all 0.2s ease"
            },
            syncButtonDisabled: {
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#a0aec0",
                color: "#ffffff",
                cursor: "not-allowed",
                fontSize: "16px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "10px"
            },
            syncIcon: {
                width: "20px",
                height: "20px"
            },
            spinner: {
                animation: "rotate 1s linear infinite",
                height: "20px",
                width: "20px",
                color: "#ffffff"
            },
            errorBox: {
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "20px",
                padding: "12px 16px",
                borderRadius: "8px",
                backgroundColor: "#fff5f5",
                borderLeft: "4px solid #ef4444"
            },
            errorIcon: {
                width: "20px",
                height: "20px",
                color: "#ef4444",
                flexShrink: "0"
            },
            errorText: {
                margin: "0",
                color: "#9b2c2c"
            },
            quickActions: {
                marginBottom: "40px"
            },
            sectionTitle: {
                fontSize: "1.5rem",
                fontWeight: "600",
                margin: "0 0 20px 0",
                color: "#2d3748"
            },
            actionButtons: {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px"
            },
            actionButton: {
                padding: "20px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#ffffff",
                color: "#2d3748",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                transition: "all 0.2s ease"
            },
            actionIcon: {
                width: "32px",
                height: "32px",
                color: "#4f46e5"
            },
            recentActivity: {
                marginBottom: "40px"
            },
            activityList: {
                display: "flex",
                flexDirection: "column",
                gap: "15px"
            },
            activityItem: {
                display: "flex",
                alignItems: "center",
                gap: "15px",
                padding: "15px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)"
            },
            activityIcon: {
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#e0e7ff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexShrink: "0"
            },
            activityTitle: {
                fontSize: "1rem",
                fontWeight: "500",
                margin: "0 0 4px 0",
                color: "#2d3748"
            },
            activityTime: {
                fontSize: "0.875rem",
                color: "#718096",
                margin: "0"
            }
        };
    }
}

function HomeWithNavigate(props) {
    const navigate = useNavigate();
    return <Home {...props} navigate={navigate} />;
}

// Add animation for spinner
const styleTag = document.createElement('style');
styleTag.innerHTML = `
    @keyframes rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .action-button:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.1);
    }
`;
document.head.appendChild(styleTag);

export default HomeWithNavigate;