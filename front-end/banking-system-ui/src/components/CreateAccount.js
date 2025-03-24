import React, { useState } from "react";
import axios from "axios";
import "./CreateAccount.css"; // Import CSS for styling

function CreateAccount({ fetchAllAccounts }) {
    const [userId, setUserId] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountType, setAccountType] = useState("SAVINGS");
    const [balance, setBalance] = useState("");
    const [status, setStatus] = useState("ACTIVE");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!userId || !accountNumber || !balance) {
            setError("Please fill in all fields.");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await axios.post("http://localhost:8080/account-service/accounts", {
                userId: parseInt(userId),
                accountNumber,
                accountType,
                balance: parseFloat(balance),
                status,
            });

            console.log("Account created:", response.data);
            setError("Account created successfully!");
            fetchAllAccounts(); // Refresh the account list
        } catch (error) {
            console.error("Error creating account:", error);
            setError("Failed to create account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="create-account-form">
            <h2>Create New Account</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>User ID:</label>
                    <input
                        type="number"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Account Number:</label>
                    <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Account Type:</label>
                    <select
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)}
                    >
                        <option value="SAVINGS">SAVINGS</option>
                        <option value="CURRENT">CURRENT</option>
                        <option value="FIXED">FIXED</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Initial Balance:</label>
                    <input
                        type="number"
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Status:</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                        <option value="BLOCKED">BLOCKED</option>
                        <option value="CLOSED">CLOSED</option>
                    </select>
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Account"}
                </button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
}

export default CreateAccount;