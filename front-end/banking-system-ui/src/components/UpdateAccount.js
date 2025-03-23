import React, { useState } from "react";
import axios from "axios";
import "./CreateAccount.css"; // Reuse the same CSS for styling

function UpdateAccount({ fetchAllAccounts }) {
    const [accID, setAccID] = useState("");
    const [updatedAccountData, setUpdatedAccountData] = useState({
        accountNumber: "",
        accountType: "SAVINGS",
        balance: "",
        status: "ACTIVE",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateAccount = async (e) => {
        e.preventDefault();
        console.log("Sending data:", updatedAccountData);

        if (!accID) {
            setError("Please enter an account ID to update.");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await axios.put(
                `http://localhost:8080/account-service/accounts/${accID}`,
                updatedAccountData
            );

            if (response.status === 200) {
                console.log("Account updated:", response.data);
                setError("Account updated successfully!");
                fetchAllAccounts(); // Refresh the account list
            } else {
                setError("Failed to update account. Please try again.");
            }
        } catch (error) {
            console.error("Error updating account:", error);
            setError("Failed to update account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="create-account-form">
            <h2>Update Account</h2>
            <form onSubmit={handleUpdateAccount}>
                <div className="form-group">
                    <label>Account ID to Update:</label>
                    <input
                        type="number"
                        value={accID}
                        onChange={(e) => setAccID(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>New Account Number:</label>
                    <input
                        type="text"
                        value={updatedAccountData.accountNumber}
                        onChange={(e) =>
                            setUpdatedAccountData({
                                ...updatedAccountData,
                                accountNumber: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="form-group">
                    <label>New Account Type:</label>
                    <select
                        value={updatedAccountData.accountType}
                        onChange={(e) =>
                            setUpdatedAccountData({
                                ...updatedAccountData,
                                accountType: e.target.value,
                            })
                        }
                    >
                        <option value="SAVINGS">SAVINGS</option>
                        <option value="CURRENT">CURRENT</option>
                        <option value="FIXED">FIXED</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>New Balance:</label>
                    <input
                        type="number"
                        value={updatedAccountData.balance}
                        onChange={(e) =>
                            setUpdatedAccountData({
                                ...updatedAccountData,
                                balance: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="form-group">
                    <label>New Status:</label>
                    <select
                        value={updatedAccountData.status}
                        onChange={(e) =>
                            setUpdatedAccountData({
                                ...updatedAccountData,
                                status: e.target.value,
                            })
                        }
                    >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                        <option value="BLOCKED">BLOCKED</option>
                        <option value="CLOSED">CLOSED</option>
                    </select>
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Account"}
                </button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
}

export default UpdateAccount;