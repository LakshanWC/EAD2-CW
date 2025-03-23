import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios"; // Import axios for making HTTP requests

function WithdrawDepositPage() {
    const location = useLocation();
    const [accountNumber, setAccountNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [transactionStatus, setTransactionStatus] = useState(""); // Track transaction status

    const isWithdraw = location.pathname === "/transaction/withdraw";
    const isDeposit = location.pathname === "/transaction/deposit";

    // Function to check if the account is valid
    const checkAccountValidity = async (accountNumber) => {
        try {
            const response = await axios.get(`http://localhost:8085/transaction-service/accounts/${accountNumber}`);
            const accountStatus = response.data;

            if (accountStatus === "Account Not Found") {
                setError("Account not found. Please check the account number.");
                return false;
            } else if (accountStatus === "Account is Valid and Active") {
                return true; // Account is valid and active
            } else if (accountStatus === "Account Not Active") {
                setError("Account is not active. Please contact support.");
                return false;
            } else {
                setError("Unexpected response from the server.");
                return false;
            }
        } catch (error) {
            console.error("Error checking account validity:", error);
            setError("An error occurred while checking the account. Please try again.");
            return false;
        }
    };

    // Function to save the transaction
    const saveTransaction = async (accountNumber, transactionType, amount, status) => {
        try {
            // Get the current date and time
            const now = new Date();

            // Format the date and time as a string (e.g., "2023-10-05T14:30:00")
            const formattedDateTime = now.toISOString(); // This includes both date and time

            const transactionPayload = {
                accountNumber: accountNumber,
                destinationAccountNumber: null, // No destination account for withdrawals/deposits
                transactionType: transactionType.toUpperCase(), // "WITHDRAW" or "DEPOSIT"
                amount: amount,
                status: status, // "SUCCESS" or "ON HOLD"
                createdAt: formattedDateTime, // Include both date and time
                isActive: 1
            };

            const response = await axios.post(
                "http://localhost:8085/transaction-service/transactions",
                transactionPayload
            );

            if (response.status === 200) {
                console.log("Transaction saved successfully:", response.data);
            } else {
                console.error("Failed to save transaction:", response.data);
            }
        } catch (error) {
            console.error("Error saving transaction:", error);
            throw error; // Propagate the error to handle it in the main function
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        setSuccessMessage(""); // Clear previous success message

        // Validate amount (cannot be negative or zero)
        if (amount <= 0) {
            setError("Amount must be a positive number.");
            return;
        }

        // Check if the account is valid for both deposit and withdraw
        const isAccountValid = await checkAccountValidity(accountNumber);
        if (!isAccountValid) {
            // Error message is already set in checkAccountValidity
            return;
        }

        // If it's a withdrawal, check if the account has sufficient balance
        if (isWithdraw) {
            try {
                const response = await axios.get(`http://localhost:8085/transaction-service/accounts/${accountNumber}/balance`, {
                    params: { amount: amount }
                });
                console.log("Balance check response:", response.data); // Debugging line
                if (response.data !== "Sufficient Balance") { // Check for "Sufficient Balance"
                    setError("Insufficient balance for withdrawal.");
                    return;
                }
            } catch (error) {
                console.error("Error checking balance sufficiency:", error);
                setError("An error occurred while checking the balance.");
                return;
            }
        }

        // Define a threshold for large transactions
        const largeTransactionThreshold = 300000; // Threshold set to 300,000

        // Determine the transaction status based on the amount
        const status = amount > largeTransactionThreshold ? "ON HOLD" : "SUCCESS";
        setTransactionStatus(status); // Set transaction status

        // If the transaction is ON HOLD, save it and notify the user
        if (status === "ON HOLD") {
            try {
                const transactionType = isWithdraw ? "WITHDRAW" : "DEPOSIT";
                await saveTransaction(accountNumber, transactionType, amount, status);

                // Call the additional endpoint for deposit or withdrawal
                if (isWithdraw) {
                    await axios.get(
                        `http://localhost:8080/accounts/upBalance?accountNumber=${accountNumber}&amount=${amount}&operation=withdrawal`
                    );
                } else {
                    await axios.get(
                        `http://localhost:8080/accounts/upBalance?accountNumber=${accountNumber}&amount=${amount}&operation=deposit`
                    );
                }

                // Clear the input fields
                setAccountNumber("");
                setAmount("");

                // Display ON HOLD message
                setSuccessMessage(
                    "Your transaction has been placed on hold as it has been flagged as suspicious behavior. " +
                    "Please contact support or wait for an admin to confirm your transaction."
                );
            } catch (error) {
                console.error("Error saving transaction:", error);
                setError("An error occurred while saving the transaction.");
            }
            return; // Exit the function after placing the transaction ON HOLD
        }

        // If the transaction is below the threshold, proceed as usual
        try {
            const addAmount = isDeposit; // true for deposit, false for withdrawal
            const response = await axios.patch(
                `http://localhost:8085/transaction-service/accounts/${accountNumber}`,
                {}, // No request body needed
                {
                    params: {
                        amount: amount,
                        addAmount: addAmount
                    }
                }
            );

            if (response.status === 200) {
                // Save the transaction after a successful withdrawal or deposit
                const transactionType = isWithdraw ? "WITHDRAW" : "DEPOSIT";
                await saveTransaction(accountNumber, transactionType, amount, status);

                // Call the additional endpoint for deposit or withdrawal
                if (isWithdraw) {
                    await axios.post(
                        `http://localhost:8080/account-service/accounts/upBalance?accountNumber=${accountNumber}&amount=${amount}&operation=withdrawal`
                    );
                } else {
                    await axios.post(
                        `http://localhost:8080/account-service/accounts/upBalance?accountNumber=${accountNumber}&amount=${amount}&operation=deposit`
                    );
                }

                // Clear the input fields
                setAccountNumber("");
                setAmount("");

                // Display success message
                setSuccessMessage(`${isWithdraw ? "Withdrawal" : "Deposit"} successful!`);
            } else {
                setError("Transaction failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during transaction:", error);
            setError("An error occurred during the transaction.");
        }
    };


    return (
        <div style={styles.container}>
            <h1 style={styles.title}>{isWithdraw ? "Withdraw" : "Deposit"}</h1>
            <p style={styles.subtitle}>Please enter the details for your transaction.</p>
            {error && <p style={styles.error}>{error}</p>}
            {successMessage && (
                <p style={transactionStatus === "ON HOLD" ? styles.onHoldMessage : styles.success}>
                    {successMessage}
                </p>
            )}
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label htmlFor="accountNumber" style={styles.label}>
                        Account Number:
                    </label>
                    <input
                        type="text"
                        id="accountNumber"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="amount" style={styles.label}>
                        Amount:
                    </label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        min="0" // Prevent negative values in the input
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={styles.button}>
                    Submit
                </button>
            </form>
        </div>
    );
}

// Styles for the component
const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        fontFamily: "'Arial', sans-serif",
    },
    title: {
        fontSize: "2rem",
        color: "#333",
        marginBottom: "10px",
    },
    subtitle: {
        fontSize: "1.2rem",
        color: "#666",
        marginBottom: "20px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "400px",
        padding: "20px",
        borderRadius: "8px",
        backgroundColor: "#f8f8f8",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    },
    inputGroup: {
        marginBottom: "15px",
    },
    label: {
        fontSize: "1rem",
        color: "#333",
        marginBottom: "5px",
    },
    input: {
        width: "100%",
        padding: "10px",
        fontSize: "1rem",
        borderRadius: "4px",
        border: "1px solid #ccc",
        boxSizing: "border-box",
    },
    button: {
        padding: "10px 20px",
        fontSize: "1rem",
        backgroundColor: "#4CAF50",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        transition: "background-color 0.3s",
    },
    error: {
        color: "red",
        marginBottom: "15px",
    },
    success: {
        color: "green",
        marginBottom: "15px",
    },
    onHoldMessage: {
        color: "red",
        fontWeight: "bold",
        marginBottom: "15px",
    },
};

export default WithdrawDepositPage;
