import React, { useState } from "react";
import axios from "axios";
import "./CreateAccount.css";

function DeleteAccount({ fetchAllAccounts }) {
    const [deleteAccountId, setDeleteAccountId] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteAccount = async (e) => {
        e.preventDefault();

        if (!deleteAccountId) {
            setError("Please enter an account ID to delete.");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await axios.delete(
                `http://localhost:8765/account-service/accounts/${deleteAccountId}`
            );

            // If the backend returns a 200 OK response
            if (response.status === 200) {
                console.log("Account deleted:", deleteAccountId);
                setError("Account deleted successfully!");
                fetchAllAccounts(); // Refresh the account list
            }
        } catch (error) {
            // If the backend returns an error (e.g., 400 Bad Request)
            console.error("Error deleting account:", error);
            if (error.response && error.response.data) {
                // Display the backend's error message
                setError(error.response.data);
            } else {
                setError("Failed to delete account. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="create-account-form">
            <h2>Delete Account</h2>
            <form onSubmit={handleDeleteAccount}>
                <div className="form-group">
                    <label>Account ID to Delete:</label>
                    <input
                        type="number"
                        value={deleteAccountId}
                        onChange={(e) => setDeleteAccountId(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Deleting..." : "Delete Account"}
                </button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
}

export default DeleteAccount;