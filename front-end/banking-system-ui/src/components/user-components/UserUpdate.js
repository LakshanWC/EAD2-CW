import React, { useState } from 'react';

const UserUpdate = () => {
    const [searchUsername, setSearchUsername] = useState('');
    const [userData, setUserData] = useState({
        id: null,
        username: '',
        password: '',
        name: '',
        email: '',
        role: '',
    });

    const [usernameExists, setUsernameExists] = useState(null);
    const [updateStatus, setUpdateStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSearchChange = (e) => {
        setSearchUsername(e.target.value);
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8765/user-service/users?userName=${searchUsername}`);
            const data = await response.json();

            console.log('Received Data:', data);

            if (data) {
                setUsernameExists(true);
                setUserData({
                    id: data.id,
                    username: data.username,
                    password: '',
                    name: data.fullName,
                    email: data.email,
                    role: data.role,
                });
            } else {
                setUsernameExists(false);
            }
        } catch (error) {
            console.error('Error checking username:', error);
            setUsernameExists(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (usernameExists) {
            const payload = {
                id: userData.id,
                username: userData.username,
                password: userData.password,
                fullName: userData.name,
                email: userData.email,
                role: userData.role,
            };

            console.log('Sending Data:', payload);

            try {
                const response = await fetch('http://localhost:8765/user-service/users', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    setUpdateStatus('success');
                    // Reset the form and state after successful update
                    setSearchUsername('');
                    setUserData({
                        id: null,
                        username: '',
                        password: '',
                        name: '',
                        email: '',
                        role: '',
                    });
                    setUsernameExists(null);
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

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <h2>Update User Information</h2>
                {updateStatus === 'success' && <p style={{ color: 'green' }}>User updated successfully!</p>}
                {updateStatus === 'error' && <p style={{ color: 'red' }}>Failed to update user. Please try again.</p>}

                <form onSubmit={handleSearchSubmit}>
                    <div style={styles.formGroup}>
                        <label htmlFor="searchUsername">Enter Username</label>
                        <input
                            type="text"
                            id="searchUsername"
                            value={searchUsername}
                            onChange={handleSearchChange}
                            required
                            style={styles.input}
                        />
                        <button type="submit" style={styles.button}>Search</button>
                    </div>
                </form>

                {usernameExists === false && (
                    <p style={{ color: 'red' }}>Username does not exist. Please enter a valid username.</p>
                )}

                {usernameExists && (
                    <form onSubmit={handleSubmit}>
                        <div style={styles.formGroup}>
                            <label htmlFor="username">Username</label>
                            <input type="text" id="username" name="username" value={userData.username} readOnly style={styles.input} />
                        </div>

                        <div style={styles.formGroup}>
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" name="password" value={userData.password} onChange={handleChange} required style={styles.input} />
                        </div>

                        <div style={styles.formGroup}>
                            <label htmlFor="name">Full Name</label>
                            <input type="text" id="name" name="name" value={userData.name} onChange={handleChange} required style={styles.input} />
                        </div>

                        <div style={styles.formGroup}>
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" value={userData.email} onChange={handleChange} required style={styles.input} />
                        </div>

                        <button type="submit" style={styles.button}>Update</button>
                    </form>
                )}
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