
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AccountList.css"; // CSS for styling

function AccountList({ showAllAccounts, allAccounts, currentUser, fetchAllAccounts }) {
    const [filterAccountNumber, setFilterAccountNumber] = useState(""); // Filter by account number
    const [filterStatus, setFilterStatus] = useState(""); // Filter by status
    const [accountNumber, setAccountNumber] = useState("");
    const [accountDetails, setAccountDetails] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Track loading state

    // State for forms
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showDeleteForm, setShowDeleteForm] = useState(false);

    // Reset forms when showAllAccounts changes
    useEffect(() => {
        if (showAllAccounts) {
            setShowCreateForm(false);
            setShowUpdateForm(false);
            setShowDeleteForm(false);
        }
    }, [showAllAccounts]);

    // Filter the accounts based on the selected filters
    const filteredAccounts = allAccounts.filter((account) => {
        const matchesAccountNumber = account.accountNumber
            .toLowerCase()
            .includes(filterAccountNumber.toLowerCase());

        const matchesStatus = filterStatus === "" || account.status === filterStatus;

        return matchesAccountNumber && matchesStatus;
    });

    // Function to handle viewing balance for a single account
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
                `http://localhost:8765/account-service/accounts/balance?accountNumber=${accountNumber}`
            );

            console.log("Response from backend:", response);

            if (response.data) {
                setAccountDetails(response.data); // Set account details in state
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
            {/* Show "Click Here" form only for users */}
            {currentUser?.role === "USER" && (
                <>
                    <h1>Click Here </h1>

                    {/* View Balance Form */}
                    <form onSubmit={handleViewBalance} className="view-balance-form">
                        <div className="form-group">
                            <label>Account Number:</label>
                            <input
                                type="text"
                                placeholder="Enter your account number"
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
                                <p><strong>Account Number:</strong> {accountDetails.accountNumber}</p>
                                <p><strong>Account Type:</strong> {accountDetails.accountType}</p>
                                <p><strong>Balance:</strong> ${accountDetails.balance.toFixed(2)}</p>
                                <p><strong>Account Status:</strong> {accountDetails.status}</p>
                            </div>
                        )}

                        {error && <p className="error-message">{error}</p>}
                    </form>
                </>
            )}

            {/* Show "All Account Details" table and forms for admins */}
            {currentUser?.role === "ADMIN" && (
                <div className="admin-dashboard">
                    {/* Sidebar is handled by Navbar.js */}

                    {/* Main Content */}
                    <div className="main-content">
                        {showAllAccounts && (
                            <div className="all-accounts-form">
                                <h2>All Account Details</h2>

                                {/* Filter Inputs */}
                                <div className="filters">
                                    <div className="form-group">
                                        <label>Filter by Account Number:</label>
                                        <input
                                            type="text"
                                            placeholder="Enter account number"
                                            value={filterAccountNumber}
                                            onChange={(e) => setFilterAccountNumber(e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Filter by Status:</label>
                                        <select
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                        >
                                            <option value="">All</option>
                                            <option value="ACTIVE">ACTIVE</option>
                                            <option value="INACTIVE">INACTIVE</option>
                                            <option value="BLOCKED">BLOCKED</option>
                                            <option value="CLOSED">CLOSED</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Display Filtered Accounts */}
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Account ID</th>
                                        <th>User ID</th>
                                        <th>Account Number</th>
                                        <th>Account Type</th>
                                        <th>Balance</th>
                                        <th>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredAccounts.map((account) => (
                                        <tr key={account.accId}>
                                            <td>{account.accId}</td>
                                            <td>{account.userId}</td>
                                            <td>{account.accountNumber}</td>
                                            <td>{account.accountType}</td>
                                            <td>{account.balance.toFixed(2)}</td>
                                            <td>{account.status}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Create Account Form */}
                        {showCreateForm && (
                            <div className="create-account-form">
                                <h2>Create New Account</h2>
                                {/* Add your Create Account form here */}
                            </div>
                        )}

                        {/* Update Account Form */}
                        {showUpdateForm && (
                            <div className="update-account-form">
                                <h2>Update Account</h2>
                                {/* Add your Update Account form here */}
                            </div>
                        )}

                        {/* Delete Account Form */}
                        {showDeleteForm && (
                            <div className="delete-account-form">
                                <h2>Delete Account</h2>
                                {/* Add your Delete Account form here */}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AccountList;