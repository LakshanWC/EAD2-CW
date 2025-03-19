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
            return !data;
        } catch (error) {
            console.error('Error checking username availability:', error);
            return true;
        }
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password, fullName, email, usernameAvailable } = this.state;

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
            username: username,
            password: password,
            fullName: fullName,
            email: email,
            role: "user"
        };

        try {
            const response = await fetch('http://localhost:8086/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
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

        const containerStyle = {
            width: '100%',
            maxWidth: '400px',
            margin: '0 auto',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        };

        const formBoxStyle = {
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        };

        const formGroupStyle = {
            marginBottom: '15px'
        };

        const inputStyle = {
            width: '100%',
            padding: '8px',
            marginTop: '5px',
            borderRadius: '4px',
            border: '1px solid #ccc'
        };

        const buttonStyle = {
            width: '100%',
            padding: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            marginBottom: '10px' // Added margin to create space between buttons
        };

        const loginButtonStyle = {
            width: '100%',
            padding: '10px',
            backgroundColor: '#007BFF', // Different color for the Login button
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '10px' // Added margin to create space above the Login button
        };

        const errorMessageStyle = {
            color: 'red',
            fontSize: '14px',
            marginBottom: '15px'
        };

        const successMessageStyle = {
            color: 'green',
            fontSize: '14px',
            marginBottom: '15px'
        };

        return (
            <div style={containerStyle}>
                <h2>User Registration</h2>
                {errorMessage && <div style={errorMessageStyle}>{errorMessage}</div>}
                {successMessage && <div style={successMessageStyle}>{successMessage}</div>}
                <div style={formBoxStyle}>
                    <form onSubmit={this.handleSubmit}>
                        <div style={formGroupStyle}>
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={username}
                                onChange={this.handleChange}
                                style={inputStyle}
                            />
                            {!usernameAvailable && (
                                <div style={{ color: 'red', fontSize: '12px' }}>
                                    Username is already taken
                                </div>
                            )}
                        </div>

                        <div style={formGroupStyle}>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={this.handleChange}
                                style={inputStyle}
                            />
                        </div>

                        <div style={formGroupStyle}>
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={fullName}
                                onChange={this.handleChange}
                                style={inputStyle}
                            />
                        </div>

                        <div style={formGroupStyle}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={this.handleChange}
                                style={inputStyle}
                            />
                        </div>

                        <button type="submit" style={buttonStyle}>Register</button>
                        <button
                            type="button"
                            onClick={this.props.handleLoginClick}
                            style={loginButtonStyle}
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

function RegisterWithNavigation(props) {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/');
    };

    return <Register {...props} handleLoginClick={handleLoginClick} />;
}

export default RegisterWithNavigation;