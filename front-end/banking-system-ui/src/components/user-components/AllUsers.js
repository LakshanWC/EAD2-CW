import React, { useEffect, useState } from 'react';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch data from the API
        fetch('http://localhost:8765/user-service/users/all')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    if (error) {
        return <div style={styles.error}>Error: {error}</div>;
    }

    return (
        <div style={styles.usersContainer}>
            <h1 style={styles.title}>All Users</h1>
            <div style={styles.tableContainer}>
                <table style={styles.usersTable}>
                    <thead>
                    <tr>
                        <th style={styles.tableHeader}>ID</th>
                        <th style={styles.tableHeader}>Username</th>
                        <th style={styles.tableHeader}>Password</th>
                        <th style={styles.tableHeader}>Full Name</th>
                        <th style={styles.tableHeader}>Email</th>
                        <th style={styles.tableHeader}>Role</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.id} style={styles.tableRow}>
                            <td style={styles.tableCell}>{user.id}</td>
                            <td style={styles.tableCell}>{user.username}</td>
                            <td style={styles.tableCell}>{user.password}</td>
                            <td style={styles.tableCell}>{user.fullName}</td>
                            <td style={styles.tableCell}>{user.email}</td>
                            <td style={styles.tableCell}>{user.role}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllUsers;

// Inline styles
const styles = {
    usersContainer: {
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        maxWidth: '90%',
        margin: '0 auto',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    title: {
        textAlign: 'center',
        fontSize: '2rem',
        color: '#333',
        marginBottom: '20px',
    },
    tableContainer: {
        overflowX: 'auto',
    },
    usersTable: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    tableHeader: {
        backgroundColor: '#007BFF',
        color: '#fff',
        padding: '12px',
        textAlign: 'left',
        fontSize: '1rem',
    },
    tableRow: {
        borderBottom: '1px solid #ddd',
        transition: 'background-color 0.3s ease',
    },
    tableRowHover: {
        backgroundColor: '#f1f1f1',
    },
    tableCell: {
        padding: '12px',
        textAlign: 'left',
        fontSize: '0.9rem',
    },
    loading: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#666',
        marginTop: '20px',
    },
    error: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#e74c3c',
        marginTop: '20px',
    },
};