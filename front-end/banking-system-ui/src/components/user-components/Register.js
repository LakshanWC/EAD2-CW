import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            fullName: '',
            email: '',
            errorMessage: '',
            successMessage: '',
            usernameAvailable: true
        };
    }

    handleChange = async (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });

        if (name === 'username') {
            const isAvailable = await this.checkUsernameAvailability(value);
            this.setState({ usernameAvailable: isAvailable });
        }
    };

    checkUsernameAvailability = async (username) => {
        if (!username) return true;

        try {
            const response = await fetch(`http://localhost:8086/users?userName=${username}`);
            const data = await response.json();
            return data === null; // If API returns null, the username is available
        } catch (error) {
            console.error('Error checking username availability:', error);
            return true;
        }
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password, fullName, email } = this.state;

        if (!username || !password || !fullName || !email) {
            this.setState({ errorMessage: 'All fields are required' });
            return;
        }

        const isAvailable = await this.checkUsernameAvailability(username);
        if (!isAvailable) {
            this.setState({ errorMessage: 'Username is already taken' });
            return;
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            this.setState({ errorMessage: 'Please enter a valid email address' });
            return;
        }

        this.setState({ errorMessage: '', successMessage: '' });

        const registrationData = {
            username,
            password,
            fullName,
            email,
            role: "user"
        };

        try {
            const response = await fetch('http://localhost:8086/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registrationData)
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Registration successful:', data);
                this.setState({
                    successMessage: 'Registration successful! You can now log in.',
                    username: '',
                    password: '',
                    fullName: '',
                    email: '',
                    errorMessage: '',
                    usernameAvailable: true
                });
            } else {
                const errorData = await response.json();
                this.setState({ errorMessage: errorData.message || 'Registration failed. Please try again.' });
            }
        } catch (error) {
            console.error('Error during registration:', error);
            this.setState({ errorMessage: 'Something went wrong. Please try again later.' });
        }
    };

    render() {
        const { username, password, fullName, email, errorMessage, successMessage, usernameAvailable } = this.state;
        return (
            <div style={styles.container}>
                <h2 style={styles.heading}>User Registration</h2>
                {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
                {successMessage && <div style={styles.successMessage}>{successMessage}</div>}
                <form onSubmit={this.handleSubmit} style={styles.form}>
                    <label style={styles.label}>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={this.handleChange}
                        style={styles.input}
                    />
                    {!usernameAvailable && <div style={styles.usernameError}>Username is already taken</div>}

                    <label style={styles.label}>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={this.handleChange}
                        style={styles.input}
                    />

                    <label style={styles.label}>Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={fullName}
                        onChange={this.handleChange}
                        style={styles.input}
                    />

                    <label style={styles.label}>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={this.handleChange}
                        style={styles.input}
                    />
                    <button type="submit" style={styles.button}>Register</button>
                    <button
                        type="button"
                        onClick={this.props.handleLoginClick}
                        style={{ ...styles.button, backgroundColor: '#007BFF', marginTop: '10px' }}
                    >
                        Login
                    </button>
                </form>
            </div>
        );
    }
}

function RegisterWithNavigation(props) {
    const navigate = useNavigate();
    const handleLoginClick = () => navigate('/');
    return <Register {...props} handleLoginClick={handleLoginClick} />;
}

const styles = {
    container: {
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff'
    },
    heading: {
        textAlign: 'center',
        fontSize: '24px',
        marginBottom: '20px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column'
    },
    label: {
        fontSize: '14px',
        marginBottom: '6px',
        color: '#333'
    },
    input: {
        padding: '10px',
        marginBottom: '15px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '14px'
    },
    button: {
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        fontSize: '14px',
        color: '#fff',
        backgroundColor: '#28a745',
        cursor: 'pointer',
        transition: 'background-color 0.3s'
    },
    usernameError: {
        color: 'red',
        fontSize: '12px',
        marginTop: '-10px',
        marginBottom: '10px'
    },
    errorMessage: {
        color: 'red',
        fontSize: '14px',
        marginBottom: '15px',
        textAlign: 'center'
    },
    successMessage: {
        color: 'green',
        fontSize: '14px',
        marginBottom: '15px',
        textAlign: 'center'
    }
};

export default RegisterWithNavigation;
