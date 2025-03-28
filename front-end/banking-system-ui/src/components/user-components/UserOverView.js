import React from "react";
import { Link, useLocation } from "react-router-dom";

const UserOverview = ({ currentUser }) => {
    const location = useLocation();
    const isUserPage = location.pathname.startsWith("/user");

    if (!isUserPage) return null;

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.title}>User Services</h1>
                    <p style={styles.subtitle}>Manage your user profile and settings</p>
                    <div style={styles.divider}></div>
                </div>

                <div style={styles.servicesGrid}>
                    {/* Regular user links */}
                    {(!currentUser || currentUser.role !== "ADMIN") && (
                        <>
                            <Link to="/user-service/update" style={styles.serviceCard}>
                                <div style={styles.serviceIcon} className="update-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path fill="#4f46e5" d="M21.7,13.35L20.7,14.35L18.65,12.3L19.65,11.3C19.86,11.09 20.21,11.09 20.42,11.3L21.7,12.58C21.91,12.79 21.91,13.14 21.7,13.35M12,18.94L18.06,12.88L20.11,14.93L14.06,21H12V18.94M12,14C7.58,14 4,15.79 4,18V20H10V18.11L14,14.11C13.34,14.03 12.67,14 12,14M12,4A4,4 0 0,0 8,8A4,4 0 0,0 12,12A4,4 0 0,0 16,8A4,4 0 0,0 12,4Z" />
                                    </svg>
                                </div>
                                <h3 style={styles.serviceTitle}>Update Profile</h3>
                                <p style={styles.serviceDescription}>Edit your personal information</p>
                                <div style={styles.serviceArrow}>
                                    <svg viewBox="0 0 24 24">
                                        <path fill="#4f46e5" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                                    </svg>
                                </div>
                            </Link>

                            <Link to="/user-service/view" style={styles.serviceCard}>
                                <div style={styles.serviceIcon} className="view-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path fill="#4f46e5" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
                                    </svg>
                                </div>
                                <h3 style={styles.serviceTitle}>View Profile</h3>
                                <p style={styles.serviceDescription}>See your profile details</p>
                                <div style={styles.serviceArrow}>
                                    <svg viewBox="0 0 24 24">
                                        <path fill="#4f46e5" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                                    </svg>
                                </div>
                            </Link>
                        </>
                    )}

                    {/* Admin-only links */}
                    {currentUser && currentUser.role === "ADMIN" && (
                        <>
                            <Link to="/user-service/update" style={styles.serviceCard}>
                                <div style={styles.serviceIcon} className="update-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path fill="#4f46e5" d="M21.7,13.35L20.7,14.35L18.65,12.3L19.65,11.3C19.86,11.09 20.21,11.09 20.42,11.3L21.7,12.58C21.91,12.79 21.91,13.14 21.7,13.35M12,18.94L18.06,12.88L20.11,14.93L14.06,21H12V18.94M12,14C7.58,14 4,15.79 4,18V20H10V18.11L14,14.11C13.34,14.03 12.67,14 12,14M12,4A4,4 0 0,0 8,8A4,4 0 0,0 12,12A4,4 0 0,0 16,8A4,4 0 0,0 12,4Z" />
                                    </svg>
                                </div>
                                <h3 style={styles.serviceTitle}>Update User</h3>
                                <p style={styles.serviceDescription}>Modify user information</p>
                                <div style={styles.serviceArrow}>
                                    <svg viewBox="0 0 24 24">
                                        <path fill="#4f46e5" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                                    </svg>
                                </div>
                            </Link>

                            <Link to="/user-service/delete" style={styles.serviceCard}>
                                <div style={styles.serviceIcon} className="delete-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path fill="#4f46e5" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                                    </svg>
                                </div>
                                <h3 style={styles.serviceTitle}>Delete User</h3>
                                <p style={styles.serviceDescription}>Remove a user account</p>
                                <div style={styles.serviceArrow}>
                                    <svg viewBox="0 0 24 24">
                                        <path fill="#4f46e5" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                                    </svg>
                                </div>
                            </Link>

                            <Link to="/user-service/all" style={styles.serviceCard}>
                                <div style={styles.serviceIcon} className="users-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path fill="#4f46e5" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6M12,13C14.67,13 20,14.33 20,17V20H4V17C4,14.33 9.33,13 12,13M12,14.9C9.03,14.9 5.9,16.36 5.9,17V18.1H18.1V17C18.1,16.36 14.97,14.9 12,14.9Z" />
                                    </svg>
                                </div>
                                <h3 style={styles.serviceTitle}>All Users</h3>
                                <p style={styles.serviceDescription}>View and manage all users</p>
                                <div style={styles.serviceArrow}>
                                    <svg viewBox="0 0 24 24">
                                        <path fill="#4f46e5" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                                    </svg>
                                </div>
                            </Link>
                        </>
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
        ':hover': {
            transform: "translateY(-5px)",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
            borderColor: "#c7d2fe",
        }
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
    .update-icon:hover {
        background-color: #e0e7ff;
    }
    .view-icon:hover {
        background-color: #e0f2fe;
    }
    .delete-icon:hover {
        background-color: #fee2e2;
    }
    .users-icon:hover {
        background-color: #ecfdf5;
    }
`;
document.head.appendChild(styleTag);

export default UserOverview;