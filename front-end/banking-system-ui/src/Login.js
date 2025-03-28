// src/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // New CSS file for enhanced styling

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginType, setLoginType] = useState("user");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Hardcoded admin credentials
    const adminCredentials = {
        username: "admin",
        password: "admin123",
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Admin login logic
        if (loginType === "admin") {
            if (username === adminCredentials.username && password === adminCredentials.password) {
                const user = { username, role: "ADMIN" };
                onLogin(user);
                navigate("/home");
            } else {
                alert("Invalid admin credentials.");
            }
            setIsLoading(false);
            return;
        }

        // User login logic
        if (username && password) {
            try {
                const response = await fetch(
                    `http://localhost:8086/user-service/users/validate/?userName=${username}&password=${password}`
                );
                const result = await response.text();

                if (result === "Success") {
                    const user = { username, role: "USER" };
                    onLogin(user);
                    navigate("/home");
                } else if (result === "Wrong Credentials") {
                    alert("Invalid username or password.");
                } else {
                    alert("An error occurred. Please try again.");
                }
            } catch (error) {
                console.error("Error during login:", error);
                alert("An error occurred. Please try again.");
            }
        } else {
            alert("Please enter username and password.");
        }
        setIsLoading(false);
    };

    const handleRegisterClick = () => {
        navigate("/register");
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <div className="bank-logo">
                        <i className="fas fa-university"></i>
                        <span>ABC Bank</span>
                    </div>
                    <h1>Welcome Back!</h1>
                    <p>Please login to access your account</p>
                </div>

                <div className="login-form-container">
                    <div className="login-type-toggle">
                        <button
                            className={loginType === "user" ? "active" : ""}
                            onClick={() => setLoginType("user")}
                        >
                            <i className="fas fa-user"></i> User Login
                        </button>
                        <button
                            className={loginType === "admin" ? "active" : ""}
                            onClick={() => setLoginType("admin")}
                        >
                            <i className="fas fa-lock"></i> Admin Login
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="username">
                                <i className="fas fa-user-circle"></i> Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">
                                <i className="fas fa-key"></i> Password
                            </label>
                            <div className="password-input-wrapper">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                </button>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="login-button"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i> Logging in...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-sign-in-alt"></i> Login
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="form-footer">
                            <p>
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    className="register-link"
                                    onClick={handleRegisterClick}
                                >
                                    Register here
                                </button>
                            </p>
                        </div>
                    </form>
                </div>

                <div className="login-footer">
                    <p>© 2025 ABC Bank. All rights reserved.</p>
                    <div className="security-info">
                        <i className="fas fa-lock"></i>
                        <span>Secure login</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;