import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

// Constants for configuration
const TRANSACTION_SERVICE_URL = "http://localhost:8765/transaction-service";
const ACCOUNT_SERVICE_URL = "http://localhost:8765/account-service";
const LARGE_TRANSACTION_THRESHOLD = 300000;
const TRANSACTION_TYPES = {
    WITHDRAW: "WITHDRAW",
    DEPOSIT: "DEPOSIT"
};

function WithdrawDepositPage() {
    const location = useLocation();
    const [formData, setFormData] = useState({
        accountNumber: "",
        amount: ""
    });
    const [transactionState, setTransactionState] = useState({
        error: "",
        successMessage: "",
        status: "",
        isLoading: false,
        accountMessage: ""
    });
    const [serviceStatus, setServiceStatus] = useState({
        transactionService: false,
        accountService: false
    });

    const isWithdraw = location.pathname === "/transaction-service/withdraw";
    const isDeposit = location.pathname === "/transaction-service/deposit";

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        // Clear account message when typing
        if (id === "accountNumber") {
            setTransactionState(prev => ({ ...prev, accountMessage: "" }));
        }
    };

    const checkServiceHealth = async () => {
        try {
            setTransactionState(prev => ({ ...prev, isLoading: true }));

            console.log("Checking Transaction Service health...");
            const transactionHealthResponse = await axios.get(
                `${TRANSACTION_SERVICE_URL}/transactions/health`
            );
            const transactionHealth = transactionHealthResponse.data;
            console.log("Transaction Service Response:", transactionHealth);

            console.log("Checking Account Service health...");
            const accountHealthResponse = await axios.get(
                `${ACCOUNT_SERVICE_URL}/accounts/health`
            );
            const accountHealth = accountHealthResponse.data;
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
                setTransactionState(prev => ({
                    ...prev,
                    error: errorMsg,
                    isLoading: false
                }));
                return false;
            }

            console.log("All services are healthy - proceeding with transaction");
            return true;
        } catch (error) {
            console.error("Error checking service health:", error);
            const errorMsg = "Failed to connect to services. Please try again later.";
            setTransactionState(prev => ({
                ...prev,
                error: errorMsg,
                isLoading: false
            }));
            return false;
        }
    };

    const validateAccount = async (accountNumber) => {
        try {
            console.log(`Validating account: ${accountNumber}`);
            const response = await axios.get(
                `${TRANSACTION_SERVICE_URL}/accounts/${accountNumber}`
            );
            const result = response.data;
            console.log("Account validation result:", result);

            if (result === "Account Not Found") {
                const msg = "Account Number: Not Found";
                setTransactionState(prev => ({ ...prev, accountMessage: msg }));
                console.warn(msg);
                return false;
            }

            if (result === "Account is Valid and Active") {
                setTransactionState(prev => ({ ...prev, accountMessage: "" }));
                console.log("Account is valid and active");
                return true;
            }

            if (result === "Account Not Active") {
                const msg = "Account Number: is not active";
                setTransactionState(prev => ({ ...prev, accountMessage: msg }));
                console.warn(msg);
                return false;
            }

            const msg = "Account Number: Unexpected validation response";
            setTransactionState(prev => ({ ...prev, accountMessage: msg }));
            console.warn(msg);
            return false;
        } catch (error) {
            console.error("Error validating account:", error);
            const msg = "Account Number: Validation failed";
            setTransactionState(prev => ({ ...prev, accountMessage: msg }));
            console.error(msg);
            return false;
        }
    };

    const checkBalance = async (accountNumber, amount) => {
        try {
            console.log(`Checking balance for account ${accountNumber} with amount ${amount}`);
            const response = await axios.get(
                `${TRANSACTION_SERVICE_URL}/accounts/${accountNumber}`,
                { params: { amount } }
            );
            const result = response.data;
            console.log("Balance check result:", result);

            if (result === "Insufficient Balance") {
                console.warn("Insufficient balance for transaction");
                return false;
            } else if (result === "Sufficient Balance") {
                console.log("Sufficient balance available");
                return true;
            } else if (result === "Account Not Found") {
                throw new Error("Account not found.");
            } else {
                throw new Error(`Unexpected response from server: ${result}`);
            }
        } catch (error) {
            console.error("Error checking balance:", error);
            return false;
        }
    };

    const saveTransaction = async (accountNumber, transactionType, amount, status) => {
        try {
            const transactionPayload = {
                accountNumber,
                destinationAccountNumber: null,
                transactionType: transactionType.toUpperCase(),
                amount,
                status,
                createdAt: new Date().toISOString(),
                isActive: 1
            };

            console.log("Saving transaction:", transactionPayload);
            const response = await axios.post(
                `${TRANSACTION_SERVICE_URL}/transactions`,
                transactionPayload
            );

            if (response.status === 200) {
                console.log("Transaction saved:", response.data);
                return true;
            }
            console.error("Transaction save failed:", response.data);
            return false;
        } catch (error) {
            console.error("Transaction save error:", error);
            throw error;
        }
    };

    const updateAccountBalance = async (accountNumber, amount, operation) => {
        try {
            console.log(`Updating account balance for ${accountNumber}, operation: ${operation}`);

            // Correct operation values for the backend
            const backendOperation = operation === TRANSACTION_TYPES.WITHDRAW ? "withdrawal" : "deposit";

            const response = await axios.put(
                `${ACCOUNT_SERVICE_URL}/accounts`,
                null,
                {
                    params: {
                        accountNumber,
                        amount,
                        operation: backendOperation
                    }
                }
            );
            return response.status === 200;
        } catch (error) {
            console.error("Error updating account balance:", error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTransactionState({
            error: "",
            successMessage: "",
            status: "",
            isLoading: true,
            accountMessage: ""
        });

        // Input validation
        if (!formData.accountNumber || !formData.amount) {
            setTransactionState(prev => ({
                ...prev,
                error: "Please fill in all fields",
                isLoading: false
            }));
            return;
        }

        const amountValue = parseFloat(formData.amount);
        if (isNaN(amountValue) || amountValue <= 0) {
            setTransactionState(prev => ({
                ...prev,
                error: "Amount must be a positive number",
                isLoading: false
            }));
            return;
        }

        try {
            // Service health check
            const servicesHealthy = await checkServiceHealth();
            if (!servicesHealthy) return;

            // Account validation
            const isAccountValid = await validateAccount(formData.accountNumber);
            if (!isAccountValid) {
                setTransactionState(prev => ({ ...prev, isLoading: false }));
                return;
            }

            // Balance check for withdrawals
            if (isWithdraw) {
                const hasSufficientBalance = await checkBalance(formData.accountNumber, formData.amount);
                if (!hasSufficientBalance) {
                    setTransactionState(prev => ({
                        ...prev,
                        error: "Insufficient balance for withdrawal.",
                        isLoading: false
                    }));
                    return;
                }
            }

            // Determine transaction status
            const status = amountValue > LARGE_TRANSACTION_THRESHOLD
                ? "ON HOLD"
                : "SUCCESS";

            setTransactionState(prev => ({ ...prev, status }));

            // Process transaction
            const transactionType = isWithdraw ? TRANSACTION_TYPES.WITHDRAW : TRANSACTION_TYPES.DEPOSIT;

            // Save transaction first
            await saveTransaction(
                formData.accountNumber,
                transactionType,
                amountValue,
                status
            );

            // Only update balances if the transaction is not on hold
            if (status !== "ON HOLD") {
                const operation = isWithdraw ? TRANSACTION_TYPES.WITHDRAW : TRANSACTION_TYPES.DEPOSIT;
                const balanceUpdated = await updateAccountBalance(
                    formData.accountNumber,
                    amountValue,
                    operation
                );

                if (!balanceUpdated) {
                    throw new Error("Failed to update account balance");
                }
            }

            // Set success message based on status
            if (status === "ON HOLD") {
                setTransactionState({
                    error: "",
                    successMessage: "Your transaction has been placed on hold as it has been flagged as suspicious behavior. Please contact support or wait for an admin to confirm your transaction.",
                    status: "ON HOLD",
                    isLoading: false
                });
            } else {
                setTransactionState({
                    error: "",
                    successMessage: `${isWithdraw ? "Withdrawal" : "Deposit"} successful!`,
                    status: "SUCCESS",
                    isLoading: false
                });
            }

            // Reset form
            setFormData({ accountNumber: "", amount: "" });
        } catch (error) {
            console.error("Transaction error:", error);
            setTransactionState(prev => ({
                ...prev,
                error: "An error occurred during the transaction. Please try again.",
                isLoading: false
            }));
        }
    };

    // ... (rest of the component code remains the same)
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>{isWithdraw ? "Withdraw" : "Deposit"}</h1>
            <p style={styles.subtitle}>Please enter the details for your transaction.</p>

            {transactionState.error && (
                <p style={styles.error}>{transactionState.error}</p>
            )}

            {transactionState.accountMessage && (
                <p style={styles.error}>{transactionState.accountMessage}</p>
            )}

            {transactionState.successMessage && (
                <p style={transactionState.status === "ON HOLD"
                    ? styles.onHoldMessage
                    : styles.success
                }>
                    {transactionState.successMessage}
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
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        onBlur={() => validateAccount(formData.accountNumber)}
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
                        value={formData.amount}
                        onChange={handleInputChange}
                        required
                        min="0.01"
                        step="0.01"
                        style={styles.input}
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        ...styles.button,
                        backgroundColor: transactionState.isLoading ? "#cccccc" : "#4CAF50"
                    }}
                    disabled={transactionState.isLoading}
                >
                    {transactionState.isLoading ? (
                        <>
                            <span style={{ marginRight: "8px" }}>Processing...</span>
                            <i className="fa fa-spinner fa-spin"></i>
                        </>
                    ) : "Submit"}
                </button>
            </form>
        </div>
    );
}

// Styles remain the same
const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#f5f5f5",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
    },
    title: {
        fontSize: "2rem",
        color: "#2c3e50",
        marginBottom: "0.5rem",
        fontWeight: "600"
    },
    subtitle: {
        fontSize: "1rem",
        color: "#7f8c8d",
        marginBottom: "2rem",
        textAlign: "center"
    },
    form: {
        width: "100%",
        padding: "1.5rem",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)"
    },
    inputGroup: {
        marginBottom: "1.5rem"
    },
    label: {
        display: "block",
        fontSize: "0.9rem",
        color: "#34495e",
        marginBottom: "0.5rem",
        fontWeight: "500"
    },
    input: {
        width: "100%",
        padding: "0.75rem",
        fontSize: "1rem",
        borderRadius: "4px",
        border: "1px solid #bdc3c7",
        boxSizing: "border-box",
        transition: "border-color 0.3s",
        ":focus": {
            borderColor: "#3498db",
            outline: "none",
            boxShadow: "0 0 0 2px rgba(52, 152, 219, 0.2)"
        }
    },
    button: {
        width: "100%",
        padding: "0.75rem",
        fontSize: "1rem",
        fontWeight: "600",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        transition: "background-color 0.3s, transform 0.2s",
        ":hover": {
            transform: "translateY(-1px)"
        },
        ":active": {
            transform: "translateY(0)"
        }
    },
    error: {
        color: "#e74c3c",
        marginBottom: "1rem",
        padding: "0.75rem",
        backgroundColor: "#fadbd8",
        borderRadius: "4px",
        width: "100%",
        textAlign: "center"
    },
    success: {
        color: "#27ae60",
        marginBottom: "1rem",
        padding: "0.75rem",
        backgroundColor: "#d5f5e3",
        borderRadius: "4px",
        width: "100%",
        textAlign: "center"
    },
    onHoldMessage: {
        color: "#e67e22",
        fontWeight: "600",
        marginBottom: "1rem",
        padding: "0.75rem",
        backgroundColor: "#fdebd0",
        borderRadius: "4px",
        width: "100%",
        textAlign: "center"
    }
};

export default WithdrawDepositPage;