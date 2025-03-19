// src/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UiStyel.css"; // Use the same CSS file from your previous Login page

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginType, setLoginType] = useState("user"); // Track login type (user or admin)
    const navigate = useNavigate();

    // Hardcoded admin credentials
    const adminCredentials = {
        username: "admin",
        password: "admin123",
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Admin login logic
        if (loginType === "admin") {
            if (username === adminCredentials.username && password === adminCredentials.password) {
                const user = { username, role: "ADMIN" }; // Set role to ADMIN
                onLogin(user); // Notify App.js that login was successful
                navigate("/home"); // Navigate to the home page
            } else {
                alert("Invalid admin credentials.");
            }
        }

        // User login logic
        else if (loginType === "user") {
            if (username && password) {
                const user = { username, role: "USER" }; // Set role to USER
                onLogin(user); // Notify App.js that login was successful
                navigate("/home"); // Navigate to the home page
            } else {
                alert("Please enter username and password.");
            }
        }
    };

    const handleRegisterClick = () => {
        navigate("/register"); // Navigate to the register page
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Welcome to ABC Bank</h1>
            <div className="login-bar"></div>
            <div className="center-middle">
                <div className="center-box">
                    {/* Dropdown to select login type */}
                    <select
                        value={loginType}
                        onChange={(e) => setLoginType(e.target.value)}
                        className="login-dropdown"
                    >
                        <option value="user">User Login</option>
                        <option value="admin">Admin Login</option>
                    </select>

                    <br />
                    <br />

                    {/* Login form */}
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Name:</label>
                            <input
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Password:</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <br />
                        <button type="button" onClick={handleRegisterClick}>Register</button>{" "}
                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
            <div className="page-footer">Welcome to ABC Bank</div>
        </div>
    );
}

export default Login;