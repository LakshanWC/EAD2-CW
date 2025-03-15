<<<<<<< Updated upstream
import React, { useState } from "react";
import axios from "axios";
import "./AccountList.css"; // CSS for styling

function AccountList() {
    const [accountNumber, setAccountNumber] = useState("");
    const [accountDetails, setAccountDetails] = useState(null);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false); // Track whether to show the form
    const [isLoading, setIsLoading] = useState(false); // Track loading state

    const handleViewBalance = async (e) => {
        e.preventDefault();
        if (!accountNumber) {
            setError("Please enter an account number.");
            return;
        }

        setIsLoading(true); // Start loading
        setError(""); // Clear previous errors
        setAccountDetails(null); // Clear previous account details

        try {
            console.log("Fetching account details for:", accountNumber);

            // Make the API call to fetch account details
            const response = await axios.get(
                `http://localhost:8080/account-service/accounts/balance?accountNumber=${accountNumber}`
            );

            console.log("Response from backend:", response);

            if (response.data) {
                setAccountDetails(response.data);
            } else {
                setError("Account not found. Please enter a valid account number.");
            }
        } catch (error) {
            console.error("Error fetching account details:", error);
            setError("Failed to fetch account details. Please try again.");
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <div className="account-list-container">
            <h1>All Accounts</h1>
            <button onClick={() => setShowForm(!showForm)} className="view-balance-button">
                {showForm ? "Hide Form" : "View Balance"}
            </button>

            {showForm && (
                <form onSubmit={handleViewBalance} className="view-balance-form">
                    <div className="form-group">
                        <label>Account Number:</label>
                        <input
                            type="text"
                            placeholder="Enter account number"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            disabled={isLoading} // Disable input while loading
                        />
                    </div>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Loading..." : "Submit"}
                    </button>

                    {accountDetails && (
                        <div className="account-details">
                            <h2>Account Details</h2>
                            <div className="details-group">
                                <label>Account Number:</label>
                                <span>{accountDetails.accountNumber}</span>
                            </div>
                            <div className="details-group">
                                <label>Account Type:</label>
                                <span>{accountDetails.accountType}</span>
                            </div>
                            <div className="details-group">
                                <label>Balance:</label>
                                <span>{accountDetails.balance}</span>
                            </div>
                            <div className="details-group">
                                <label>Status:</label>
                                <span>{accountDetails.status}</span>
                            </div>
                        </div>
                    )}

                    {error && <p className="error-message">{error}</p>}
                </form>
            )}
=======
import React, { useEffect, useState } from "react";
import axios from "axios";

function AccountList() {
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        // Fetch accounts from the backend
        axios.get("http://localhost:8080/accounts")
            .then((response) => setAccounts(response.data))
            .catch((error) => console.error("Error fetching accounts:", error));
    }, []);

    return (
        <div>
            <h1>All Accounts</h1>
            <ul>
                {accounts.map((account) => (
                    <li key={account.accId}>
                        <strong>Account Number:</strong> {account.accountNumber} <br />
                        <strong>Balance:</strong> {account.balance} <br />
                        <strong>Status:</strong> {account.status} <br />
                        <hr />
                    </li>
                ))}
            </ul>
>>>>>>> Stashed changes
        </div>
    );
}

export default AccountList;