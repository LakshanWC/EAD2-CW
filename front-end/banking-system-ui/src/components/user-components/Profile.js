import React, { useEffect, useState } from 'react';

const Profile = ({ currentUser }) => {
    const [userDetails, setUserDetails] = useState(null); // State to store fetched user details
    const [loading, setLoading] = useState(false); // State to handle loading state
    const [error, setError] = useState(null); // State to handle errors

    useEffect(() => {
        if (currentUser && currentUser.username) {
            // Construct the URL with the current user's username
            const url = `http://localhost:8765/user-service/users?userName=${currentUser.username}`;

            setLoading(true); // Set loading to true before making the API call
            setError(null); // Reset any previous errors

            // Make the API call
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('User details:', data);
                    setUserDetails(data); // Store the fetched data in state
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                    setError(error.message); // Store the error message in state
                })
                .finally(() => {
                    setLoading(false); // Set loading to false after the API call completes
                });
        }
    }, [currentUser]); // Dependency array ensures this runs when currentUser changes

    if (!currentUser) {
        return <div>No user data found</div>;
    }

    if (loading) {
        return <div>Loading...</div>; // Display a loading message while fetching data
    }

    if (error) {
        return <div>Error: {error}</div>; // Display an error message if something went wrong
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Profile</h1>
            <div style={styles.profileInfo}>
                <p style={styles.label}>Username:</p>
                <p style={styles.value}>{currentUser.username}</p>

                <p style={styles.label}>Full Name:</p>
                <p style={styles.value}>{userDetails?.fullName}</p>

                <p style={styles.label}>Email:</p>
                <p style={styles.value}>{userDetails?.email}</p>
            </div>
        </div>
    );
};

// Styles for the component
const styles = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
    },
    header: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '20px',
    },
    profileInfo: {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '10px',
        padding: '10px',
        marginTop: '20px', // Added margin to move details down
    },
    label: {
        fontWeight: 'bold',
        color: '#555',
        margin: '0',
    },
    value: {
        margin: '0',
        color: '#333',
    },
};

export default Profile;