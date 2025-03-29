import React, { useState } from "react";

function TransferPage() {
    const [sourceAccount, setSourceAccount] = useState("");
    const [destinationAccount, setDestinationAccount] = useState("");
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");
    const [sourceMessage, setSourceMessage] = useState("");
    const [destinationMessage, setDestinationMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [transactionStatus, setTransactionStatus] = useState("");
    const [serviceStatus, setServiceStatus] = useState({
        transactionService: false,
        accountService: false
    });

    // Function to check service health
    const checkServiceHealth = async () => {
        setError("");
        try {
            console.log("Initiating service health check...");

            // Check transaction service health
            console.log("Checking Transaction Service health...");
            const transactionHealthResponse = await fetch("http://localhost:8765/transaction-service/transactions/health");
            const transactionHealth = await transactionHealthResponse.text();
            console.log("Transaction Service Response:", transactionHealth);

            // Check account service health
            console.log("Checking Account Service health...");
            const accountHealthResponse = await fetch("http://localhost:8765/account-service/accounts/health");
            const accountHealth = await accountHealthResponse.text();
            console.log("Account Service Response:", accountHealth);

            // Exact match check (case-sensitive)
            const isTransactionServiceOK = transactionHealth.trim() === "Health check OK";
            const isAccountServiceOK = accountHealth.trim() === "Health check OK";

            setServiceStatus({
                transactionService: isTransactionServiceOK,
                accountService: isAccountServiceOK
            });

            console.log("Service Status Summary:", {
                transactionService: isTransactionServiceOK ? "HEALTHY" : "UNHEALTHY",
                accountService: isAccountServiceOK ? "HEALTHY" : "UNHEALTHY"
            });

            if (!isTransactionServiceOK || !isAccountServiceOK) {
                const errorMsg = "One or more services are unavailable. Please try again later.";
                console.error("Service health check failed:", errorMsg);
                setError(errorMsg);
                return false;
            }

            console.log("All services are healthy - proceeding with transaction");
            return true;
        } catch (error) {
            console.error("Error checking service health:", error);
            const errorMsg = "Failed to connect to services. Please try again later.";
            setError(errorMsg);
            return false;
        }
    };

    // Function to validate an account number
    const validateAccount = async (accountNumber, setMessage, label) => {
        try {
            console.log(`Validating ${label.toLowerCase()} account: ${accountNumber}`);
            const response = await fetch(`http://localhost:8765/transaction-service/accounts/${accountNumber}`);
            if (!response.ok) {
                throw new Error("Account validation failed");
            }
            const result = await response.text();
            console.log(`${label} account validation result:`, result);

            if (result === "Account Not Found") {
                const msg = `${label} Account Number: Not Found`;
                setMessage(msg);
                console.warn(msg);
            } else if (result === "Account is Valid and Active") {
                setMessage("");
                console.log(`${label} account is valid and active`);
            } else {
                const msg = `${label} Account Number: is not active`;
                setMessage(msg);
                console.warn(msg);
            }
        } catch (error) {
            console.error(`Error validating ${label.toLowerCase()} account:`, error);
            const msg = `${label} Account Number: Validation failed`;
            setMessage(msg);
            console.error(msg);
        }
    };

    // Function to check if the source account has sufficient balance
    const checkBalance = async (accountNumber, amount) => {
        try {
            console.log(`Checking balance for account ${accountNumber} with amount ${amount}`);
            const response = await fetch(
                `http://localhost:8765/transaction-service/accounts/${accountNumber}/balance?amount=${amount}`
            );

            if (!response.ok) {
                throw new Error(`Balance check failed with status: ${response.status}`);
            }

            const result = await response.text();
            console.log("Balance check result:", result);

            if (result === "Insufficient Balance") {
                console.warn("Insufficient balance for transaction");
                return false;
            } else if (result === "Sufficient Balance") {
                console.log("Sufficient balance available");
                return true;
            } else if (result === "Account Not Found") {
                throw new Error("Source account not found.");
            } else {
                throw new Error(`Unexpected response from server: ${result}`);
            }
        } catch (error) {
            console.error("Error checking balance:", error);
            return false;
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        console.log("Transfer submission initiated");
        console.log("Form data:", {
            sourceAccount,
            destinationAccount,
            amount
        });

        // First check service health
        console.log("Performing pre-transfer service health check...");
        const servicesHealthy = await checkServiceHealth();
        if (!servicesHealthy) {
            console.log("Transfer aborted due to service health issues");
            return;
        }

        // Validate amount
        if (amount <= 0) {
            const errorMsg = "Amount must be a positive number.";
            console.error("Amount validation failed:", errorMsg);
            setError(errorMsg);
            return;
        }

        // Validate source and destination accounts
        console.log("Validating accounts...");
        await validateAccount(sourceAccount, setSourceMessage, "Source");
        await validateAccount(destinationAccount, setDestinationMessage, "Destination");

        // Check if there are any validation errors
        if (sourceMessage || destinationMessage) {
            const errorMsg = "Please resolve account issues before proceeding.";
            console.error("Account validation issues:", errorMsg);
            setError(errorMsg);
            return;
        }

        // Check if source account has sufficient balance
        console.log("Checking source account balance...");
        const hasSufficientBalance = await checkBalance(sourceAccount, amount);
        if (!hasSufficientBalance) {
            const errorMsg = "Insufficient balance in the source account.";
            console.error("Balance check failed:", errorMsg);
            setError(errorMsg);
            return;
        }

        // Define a threshold for large transactions
        const largeTransactionThreshold = 300000;
        const status = amount > largeTransactionThreshold ? "ON HOLD" : "SUCCESS";
        setTransactionStatus(status);
        console.log(`Transaction status determined: ${status}`);

        // Prepare the transaction data
        const transactionData = {
            accountNumber: sourceAccount,
            destinationAccountNumber: destinationAccount,
            transactionType: "TRANSFER",
            amount: parseFloat(amount),
            status: status,
            createdAt: new Date().toISOString(),
            isActive: 1,
        };

        console.log("Prepared transaction data:", transactionData);

        try {
            // Save the transaction
            console.log("Saving transaction...");
            const response = await fetch("http://localhost:8765/transaction-service/transactions", {
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

            // Only update balances if the transaction is not on hold
            if (status !== "ON HOLD") {
                console.log("Updating account balances...");

                // Deduct the amount from the source account (new endpoint)
                console.log("Deducting from source account (account-service)...");
                const withdrawResponse = await fetch(
                    `http://localhost:8765/account-service/accounts/upBalance?accountNumber=${sourceAccount}&amount=${amount}&operation=withdrawal`,
                    {
                        method: "POST",
                    }
                );

                if (!withdrawResponse.ok) {
                    throw new Error("Failed to deduct amount from source account");
                }

                // Subtract the amount from the source account (existing endpoint)
                console.log("Deducting from source account (transaction-service)...");
                const subtractResponse = await fetch(
                    `http://localhost:8765/transaction-service/accounts/${sourceAccount}?amount=${amount}&addAmount=false`,
                    {
                        method: "PATCH",
                    }
                );

                if (!subtractResponse.ok) {
                    throw new Error("Failed to subtract amount from source account");
                }

                // Add the amount to the destination account (new endpoint)
                console.log("Adding to destination account (account-service)...");
                const depositResponse = await fetch(
                    `http://localhost:8765/account-service/accounts/upBalance?accountNumber=${destinationAccount}&amount=${amount}&operation=deposit`,
                    {
                        method: "POST",
                    }
                );

                if (!depositResponse.ok) {
                    throw new Error("Failed to add amount to destination account");
                }

                // Add the amount to the destination account (existing endpoint)
                console.log("Adding to destination account (transaction-service)...");
                const addResponse = await fetch(
                    `http://localhost:8765/transaction-service/accounts/${destinationAccount}?amount=${amount}&addAmount=true`,
                    {
                        method: "PATCH",
                    }
                );

                if (!addResponse.ok) {
                    throw new Error("Failed to add amount to destination account");
                }

                console.log("All balance updates completed successfully.");
            }

            // Reset form fields
            setSourceAccount("");
            setDestinationAccount("");
            setAmount("");
            setError("");

            // Set success message based on status
            if (status === "ON HOLD") {
                const successMsg = "Your transaction has been placed on hold as it has been flagged as suspicious behavior. Please contact support or wait for an admin to confirm your transaction.";
                setSuccessMessage(successMsg);
                console.warn("Transaction placed on hold:", successMsg);
            } else {
                const successMsg = "Transfer successful!";
                setSuccessMessage(successMsg);
                console.log("Transfer completed successfully");
            }

        } catch (error) {
            console.error("Error processing transaction:", error);
            const errorMsg = "Failed to process the transaction. Please try again.";
            setError(errorMsg);
            console.error(errorMsg);
        }
    };

    // Rest of the component remains the same...
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Transfer Page</h1>
            <p style={styles.subtitle}>Here you can transfer money between accounts.</p>
            {error && <p style={styles.error}>{error}</p>}
            {successMessage && (
                <p style={transactionStatus === "ON HOLD" ? styles.onHoldMessage : styles.success}>
                    {successMessage}
                </p>
            )}
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
                            setSourceMessage("");
                        }}
                        onBlur={(e) => validateAccount(e.target.value, setSourceMessage, "Source")}
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
                            setDestinationMessage("");
                        }}
                        onBlur={(e) => validateAccount(e.target.value, setDestinationMessage, "Destination")}
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
                        min="0"
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

// Styles remain the same...
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

export default TransferPage;