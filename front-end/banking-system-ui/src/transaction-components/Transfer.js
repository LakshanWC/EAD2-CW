import React, { useState } from "react";

function TransferPage() {
    const [sourceAccount, setSourceAccount] = useState("");
    const [destinationAccount, setDestinationAccount] = useState("");
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");
    const [sourceMessage, setSourceMessage] = useState("");
    const [destinationMessage, setDestinationMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState(""); // New state for success message

    // Function to validate an account number
    const validateAccount = async (accountNumber, setMessage, label) => {
        try {
            const response = await fetch(`http://localhost:8081/transaction-service/accounts/${accountNumber}`);
            if (!response.ok) {
                throw new Error("Account validation failed");
            }
            const result = await response.text(); // Use .text() instead of .json()

            if (result === "Account Not Found") {
                setMessage(`${label} Account Number: Not Found`);
            } else if (result === "Account is Valid and Active") {
                setMessage(""); // Clear message if valid
            } else {
                setMessage(`${label} Account Number: is not active`);
            }
        } catch (error) {
            console.error("Error validating account:", error);
            setMessage(`${label} Account Number: Validation failed`);
        }
    };

    // Function to check if the source account has sufficient balance
    const checkBalance = async (accountNumber, amount) => {
        try {
            const response = await fetch(
                `http://localhost:8081/transaction-service/accounts/${accountNumber}/balance?amount=${amount}`
            );

            if (!response.ok) {
                throw new Error(`Balance check failed with status: ${response.status}`);
            }

            const result = await response.text(); // Use .text() instead of .json()

            console.log("Server response for balance check:", result); // Log the server response

            // Handle the response from the server
            if (result === "Insufficient Balance") {
                return false; // Insufficient balance
            } else if (result === "Sufficient Balance") {
                return true; // Sufficient balance
            } else if (result === "Account Not Found") {
                throw new Error("Source account not found.");
            } else {
                throw new Error(`Unexpected response from server: ${result}`);
            }
        } catch (error) {
            console.error("Error checking balance:", error);
            return false; // Assume insufficient balance in case of error
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

        // Validate source and destination accounts
        await validateAccount(sourceAccount, setSourceMessage, "Source");
        await validateAccount(destinationAccount, setDestinationMessage, "Destination");

        // Check if there are any validation errors
        if (sourceMessage || destinationMessage) {
            setError("Please resolve account issues before proceeding.");
            return;
        }

        // Check if source account has sufficient balance
        const hasSufficientBalance = await checkBalance(sourceAccount, amount);
        if (!hasSufficientBalance) {
            setError("Insufficient balance in the source account.");
            return;
        }

        // If all validations pass, proceed with the transfer
        const transactionData = {
            accountNumber: sourceAccount,
            destinationAccountNumber: destinationAccount,
            transactionType: "TRANSFER",
            amount: parseFloat(amount), // Ensure amount is a number
            status: "PENDING",
            createdAt: new Date().toISOString(), // Current date and time in ISO format
            isActive: 1,
        };

        try {
            // Save the transaction
            const response = await fetch("http://localhost:8081/transaction-service/transactions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(transactionData),
            });

            if (!response.ok) {
                throw new Error("Failed to save transaction");
            }

            const result = await response.json();
            console.log("Transaction saved successfully:", result);

            // Subtract the amount from the source account
            const subtractResponse = await fetch(
                `http://localhost:8081/transaction-service/accounts/${sourceAccount}?amount=${amount}&addAmount=false`,
                {
                    method: "PATCH",
                }
            );

            if (!subtractResponse.ok) {
                throw new Error("Failed to subtract amount from source account");
            }

            // Add the amount to the destination account
            const addResponse = await fetch(
                `http://localhost:8081/transaction-service/accounts/${destinationAccount}?amount=${amount}&addAmount=true`,
                {
                    method: "PATCH",
                }
            );

            if (!addResponse.ok) {
                throw new Error("Failed to add amount to destination account");
            }

            // Reset form fields
            setSourceAccount("");
            setDestinationAccount("");
            setAmount("");
            setError(""); // Clear any errors
            setSuccessMessage("Transfer successful!"); // Set success message

            console.log("Balances updated successfully.");
        } catch (error) {
            console.error("Error processing transaction:", error);
            setError("Failed to process the transaction. Please try again.");
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Transfer Page</h1>
            <p style={styles.subtitle}>Here you can transfer money between accounts.</p>
            {error && <p style={styles.error}>{error}</p>}
            {successMessage && <p style={styles.success}>{successMessage}</p>} {/* Display success message */}
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label htmlFor="sourceAccount" style={styles.label}>
                        Source Account Number:
                    </label>
                    <input
                        type="text"
                        id="sourceAccount"
                        value={sourceAccount}
                        onChange={(e) => {
                            setSourceAccount(e.target.value);
                            validateAccount(e.target.value, setSourceMessage, "Source");
                        }}
                        required
                        style={styles.input}
                    />
                    {sourceMessage && <p style={styles.error}>{sourceMessage}</p>}
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="destinationAccount" style={styles.label}>
                        Destination Account Number:
                    </label>
                    <input
                        type="text"
                        id="destinationAccount"
                        value={destinationAccount}
                        onChange={(e) => {
                            setDestinationAccount(e.target.value);
                            validateAccount(e.target.value, setDestinationMessage, "Destination");
                        }}
                        required
                        style={styles.input}
                    />
                    {destinationMessage && <p style={styles.error}>{destinationMessage}</p>}
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="amount" style={styles.label}>
                        Amount:
                    </label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value >= 0) {
                                setAmount(value);
                            } else {
                                setError("Amount cannot be negative.");
                            }
                        }}
                        required
                        min="0" // Prevent negative values in the input
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={styles.button}>
                    Transfer
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
};

export default TransferPage;