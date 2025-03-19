import React, { useState, useEffect } from 'react';

const UserUpdate = () => {
    const [userData, setUserData] = useState({
        username: '',
        password: '',
        name: '',
        address: '',
        email: '', // Added email field
    });

    const [usernameExists, setUsernameExists] = useState(null);
    const [updateStatus, setUpdateStatus] = useState(null); // To track update status

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (usernameExists) {
            try {
                const response = await fetch('http://localhost:8086/users/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: userData.username,
                        password: userData.password,
                        fullName: userData.name,
                        email: userData.email,
                        role: 'user',
                    }),
                });

                if (response.ok) {
                    setUpdateStatus('success');
                    // Clear the form fields
                    setUserData({
                        username: '',
                        password: '',
                        name: '',
                        address: '',
                        email: '',
                    });
                } else {
                    setUpdateStatus('error');
                }
            } catch (error) {
                console.error('Error updating user:', error);
                setUpdateStatus('error');
            }
        } else {
            alert('Username does not exist. Please enter a valid username.');
        }
    };

    // Check username existence whenever it changes
    useEffect(() => {
        if (userData.username) {
            checkUsernameExists(userData.username);
        } else {
            setUsernameExists(null); // Reset if username is empty
        }
    }, [userData.username]);

    // Function to check if username exists
    const checkUsernameExists = async (username) => {
        try {
            const response = await fetch(`http://localhost:8086/users?userName=${username}`);
            const data = await response.json();
            setUsernameExists(data); // Assuming the endpoint returns true or false
        } catch (error) {
            console.error('Error checking username:', error);
            setUsernameExists(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <h2>Update User Information</h2>
                {updateStatus === 'success' && <p style={{ color: 'green' }}>User updated successfully!</p>}
                {updateStatus === 'error' && <p style={{ color: 'red' }}>Failed to update user. Please try again.</p>}
                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={userData.username}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                        {usernameExists !== null && (
                            <p style={{ color: usernameExists ? 'green' : 'red' }}>
                                {usernameExists ? 'Username exists.' : 'Username does not exist.'}
                            </p>
                        )}
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={userData.password}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={userData.name}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="address">Address</label>
                        <textarea
                            id="address"
                            name="address"
                            value={userData.address}
                            onChange={handleChange}
                            required
                            style={styles.textarea}
                        />
                    </div>

                    <button type="submit" style={styles.button}>Update</button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0',
    },
    box: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '400px',
    },
    formGroup: {
        marginBottom: '15px',
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '16px',
    },
    textarea: {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '16px',
        resize: 'vertical',
    },
    button: {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#007bff',
        color: '#fff',
        fontSize: '16px',
        cursor: 'pointer',
    },
};

export default UserUpdate;