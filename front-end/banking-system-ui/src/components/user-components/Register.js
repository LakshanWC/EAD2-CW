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
            usernameAvailable: true,
            isCheckingUsername: false,
            focusedField: null
        };
    }

    handleChange = async (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });

        if (name === 'username') {
            this.setState({ isCheckingUsername: true });
            const isAvailable = await this.checkUsernameAvailability(value);
            this.setState({ usernameAvailable: isAvailable, isCheckingUsername: false });
        }
    };

    checkUsernameAvailability = async (username) => {
        if (!username) return true;

        try {
            const response = await fetch(`http://localhost:8765/user-service/users/check/${username}`);
            const data = await response.json();
            return data === null;
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
            const response = await fetch('http://localhost:8765/user-service/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registrationData)
            });

            if (response.ok) {
                const data = await response.json();
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

    handleFocus = (fieldName) => {
        this.setState({ focusedField: fieldName });
    };

    handleBlur = () => {
        this.setState({ focusedField: null });
    };

    render() {
        const { username, password, fullName, email, errorMessage, successMessage,
            usernameAvailable, isCheckingUsername, focusedField } = this.state;

        const styles = {
            page: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0077b6, #00b4d8)',
                padding: '20px',
                fontFamily: "'Poppins', sans-serif"
            },
            container: {
                width: '100%',
                maxWidth: '500px',
                background: '#fff',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
            },
            header: {
                padding: '30px',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #0077b6, #00b4d8)',
                color: 'white'
            },
            bankLogo: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '15px',
                fontSize: '24px',
                fontWeight: '600'
            },
            logoIcon: {
                marginRight: '10px',
                fontSize: '28px'
            },
            title: {
                fontSize: '24px',
                marginBottom: '8px'
            },
            subtitle: {
                fontSize: '14px',
                opacity: '0.9'
            },
            formContainer: {
                padding: '30px'
            },
            form: {
                display: 'flex',
                flexDirection: 'column'
            },
            formGroup: {
                marginBottom: '20px'
            },
            label: {
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                fontSize: '14px',
                color: '#555',
                fontWeight: '500'
            },
            input: {
                width: '100%',
                padding: '12px 15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'all 0.3s ease'
            },
            inputFocus: {
                borderColor: '#0077b6',
                boxShadow: '0 0 0 3px rgba(0, 119, 182, 0.1)',
                outline: 'none'
            },
            usernameWrapper: {
                position: 'relative'
            },
            usernameInput: {
                paddingRight: '40px'
            },
            statusIcon: {
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '16px'
            },
            checkingIcon: {
                color: '#0077b6'
            },
            successIcon: {
                color: '#28a745'
            },
            errorIcon: {
                color: '#dc3545'
            },
            usernameAvailability: {
                fontSize: '12px',
                color: '#dc3545',
                marginTop: '5px'
            },
            formActions: {
                marginTop: '30px'
            },
            registerButton: {
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #28a745, #218838)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
            },
            buttonHover: {
                background: 'linear-gradient(135deg, #218838, #1e7e34)',
                transform: 'translateY(-2px)',
                boxShadow: '0 5px 15px rgba(40, 167, 69, 0.2)'
            },
            formFooter: {
                marginTop: '20px',
                textAlign: 'center',
                fontSize: '14px',
                color: '#666'
            },
            loginLink: {
                background: 'none',
                border: 'none',
                color: '#0077b6',
                fontWeight: '500',
                cursor: 'pointer',
                padding: '0',
                textDecoration: 'underline',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
            },
            footer: {
                padding: '15px',
                textAlign: 'center',
                fontSize: '12px',
                color: '#888',
                borderTop: '1px solid #eee',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
            },
            securityInfo: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                color: '#4CAF50'
            },
            errorMessage: {
                backgroundColor: '#f8d7da',
                color: '#721c24',
                padding: '10px 15px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px',
                border: '1px solid #f5c6cb'
            },
            successMessage: {
                backgroundColor: '#d4edda',
                color: '#155724',
                padding: '10px 15px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px',
                border: '1px solid #c3e6cb'
            },
            getInputStyle: (fieldName) => {
                const baseStyle = styles.input;
                const focusStyle = focusedField === fieldName ? styles.inputFocus : {};
                return {...baseStyle, ...focusStyle};
            },
            getUsernameInputStyle: () => {
                const baseStyle = {...styles.input, ...styles.usernameInput};
                const focusStyle = focusedField === 'username' ? styles.inputFocus : {};
                return {...baseStyle, ...focusStyle};
            }
        };

        return (
            <div style={styles.page}>
                <div style={styles.container}>
                    <div style={styles.header}>
                        <div style={styles.bankLogo}>
                            <i className="fas fa-university" style={styles.logoIcon}></i>
                            <span>ABC Bank</span>
                        </div>
                        <h1 style={styles.title}>Create Your Account</h1>
                        <p style={styles.subtitle}>Join ABC Bank today</p>
                    </div>

                    <div style={styles.formContainer}>
                        {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
                        {successMessage && <div style={styles.successMessage}>{successMessage}</div>}

                        <form onSubmit={this.handleSubmit} style={styles.form}>
                            <div style={styles.formGroup}>
                                <label htmlFor="fullName" style={styles.label}>
                                    <i className="fas fa-user"></i> Full Name
                                </label>
                                <input
                                    id="fullName"
                                    type="text"
                                    name="fullName"
                                    value={fullName}
                                    onChange={this.handleChange}
                                    placeholder="Enter your full name"
                                    style={styles.getInputStyle('fullName')}
                                    onFocus={() => this.handleFocus('fullName')}
                                    onBlur={this.handleBlur}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label htmlFor="email" style={styles.label}>
                                    <i className="fas fa-envelope"></i> Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={this.handleChange}
                                    placeholder="Enter your email"
                                    style={styles.getInputStyle('email')}
                                    onFocus={() => this.handleFocus('email')}
                                    onBlur={this.handleBlur}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label htmlFor="username" style={styles.label}>
                                    <i className="fas fa-user-circle"></i> Username
                                </label>
                                <div style={styles.usernameWrapper}>
                                    <input
                                        id="username"
                                        type="text"
                                        name="username"
                                        value={username}
                                        onChange={this.handleChange}
                                        placeholder="Choose a username"
                                        style={styles.getUsernameInputStyle()}
                                        onFocus={() => this.handleFocus('username')}
                                        onBlur={this.handleBlur}
                                    />
                                    {isCheckingUsername && (
                                        <i className="fas fa-spinner fa-spin" style={{...styles.statusIcon, ...styles.checkingIcon}}></i>
                                    )}
                                    {!isCheckingUsername && username && (
                                        <i className={`fas ${usernameAvailable ? 'fa-check' : 'fa-times'}`}
                                           style={{...styles.statusIcon, ...(usernameAvailable ? styles.successIcon : styles.errorIcon)}}></i>
                                    )}
                                </div>
                                {!usernameAvailable && username && (
                                    <div style={styles.usernameAvailability}>Username is not available</div>
                                )}
                            </div>

                            <div style={styles.formGroup}>
                                <label htmlFor="password" style={styles.label}>
                                    <i className="fas fa-key"></i> Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={this.handleChange}
                                    placeholder="Create a password"
                                    style={styles.getInputStyle('password')}
                                    onFocus={() => this.handleFocus('password')}
                                    onBlur={this.handleBlur}
                                />
                            </div>

                            <div style={styles.formActions}>
                                <button
                                    type="submit"
                                    style={styles.registerButton}
                                    onMouseEnter={(e) => e.target.style = {...styles.registerButton, ...styles.buttonHover}}
                                    onMouseLeave={(e) => e.target.style = styles.registerButton}
                                >
                                    <i className="fas fa-user-plus"></i> Register
                                </button>
                            </div>

                            <div style={styles.formFooter}>
                                <p>
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        style={styles.loginLink}
                                        onClick={this.props.handleLoginClick}
                                    >
                                        <i className="fas fa-sign-in-alt"></i> Login here
                                    </button>
                                </p>
                            </div>
                        </form>
                    </div>

                    <div style={styles.footer}>
                        <p>© 2025 ABC Bank. All rights reserved.</p>
                        <div style={styles.securityInfo}>
                            <i className="fas fa-lock"></i>
                            <span>Secure registration</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function RegisterWithNavigation(props) {
    const navigate = useNavigate();
    const handleLoginClick = () => navigate('/');
    return <Register {...props} handleLoginClick={handleLoginClick} />;
}

export default RegisterWithNavigation;