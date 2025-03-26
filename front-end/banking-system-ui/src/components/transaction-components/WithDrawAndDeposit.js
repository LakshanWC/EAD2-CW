import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

// Constants for configuration
const TRANSACTION_SERVICE_URL = "http://localhost:8085/transaction-service";
const ACCOUNT_SERVICE_URL = "http://localhost:8080/account-service";
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
        isLoading: false
    });

    const isWithdraw = location.pathname === "/transaction/withdraw";
    const isDeposit = location.pathname === "/transaction/deposit";

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    // Enhanced service health check with better logging
    const checkServiceHealth = async () => {
        try {
            setTransactionState(prev => ({ ...prev, isLoading: true }));

            const endpoints = [
                `${TRANSACTION_SERVICE_URL}/transactions/health`,
                `${ACCOUNT_SERVICE_URL}/accounts/health`
            ];

            const [transactionHealth, accountHealth] = await Promise.all(
                endpoints.map(endpoint =>
                    axios.get(endpoint)
                        .then(res => {
                            console.log(`${endpoint} Health:`, res.data);
                            return res;
                        })
                        .catch(err => {
                            console.error(`${endpoint} Health Check Failed:`, err);
                            throw err;
                        })
                )
            );

            if (transactionHealth.data !== "Health check OK" || accountHealth.data !== "Health check OK") {
                const errorMsg = "One or more services are unavailable. Please try again later.";
                setTransactionState(prev => ({
                    ...prev,
                    error: errorMsg,
                    isLoading: false
                }));
                return false;
            }

            return true;
        } catch (error) {
            console.error("Service health check failed:", error);
            setTransactionState(prev => ({
                ...prev,
                error: "Unable to connect to services. Please try again later.",
                isLoading: false
            }));
            return false;
        }
    };

    // Account validation function using the specified endpoint
    const validateAccount = async (accountNumber, setMessage, label = "Account") => {
        try {
            console.log(`Validating ${label.toLowerCase()} account: ${accountNumber}`);
            const response = await axios.get(
                `${TRANSACTION_SERVICE_URL}/accounts/${accountNumber}`
            );

            const result = response.data;
            console.log(`${label} account validation result:`, result);

            if (result === "Account Not Found") {
                const msg = `${label}  Number: Not Found`;
                setMessage(msg);
                console.warn(msg);
                return false;
            }

            if (result === "Account is Valid and Active") {
                setMessage("");
                console.log(`${label} account is valid and active`);
                return true;
            }

            if (result === "Account Not Active") {
                const msg = `${label} Account Number: is not active`;
                setMessage(msg);
                console.warn(msg);
                return false;
            }

            const msg = `${label} Account Number: Unexpected validation response`;
            setMessage(msg);
            console.warn(msg);
            return false;
        } catch (error) {
            console.error(`Error validating ${label.toLowerCase()} account:`, error);
            const msg = `${label} Account Number: Validation failed`;
            setMessage(msg);
            console.error(msg);
            return false;
        }
    };

    // Account validation wrapper
    const checkAccountValidity = async (accountNumber) => {
        const isValid = await validateAccount(
            accountNumber,
            (msg) => {
                setTransactionState(prev => ({
                    ...prev,
                    error: msg,
                    isLoading: false // Reset loading state here
                }));
            }
        );

        return isValid;
    };


    // Enhanced transaction saving
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

    // Enhanced form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setTransactionState({
            error: "",
            successMessage: "",
            status: "",
            isLoading: true
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

        if (parseFloat(formData.amount) <= 0) {
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

            // Account validation using the validateAccount function
            const isAccountValid = await checkAccountValidity(formData.accountNumber);
            if (!isAccountValid) return;

            // Balance check for withdrawals
            if (isWithdraw) {
                const balanceResponse = await axios.get(
                    `${ACCOUNT_SERVICE_URL}/accounts/${formData.accountNumber}/balance`,
                    { params: { amount: formData.amount } }
                );

                if (balanceResponse.data !== "Sufficient Balance") {
                    setTransactionState(prev => ({
                        ...prev,
                        error: "Insufficient balance for withdrawal.",
                        isLoading: false
                    }));
                    return;
                }
            }

            // Determine transaction status
            const status = parseFloat(formData.amount) > LARGE_TRANSACTION_THRESHOLD
                ? "ON HOLD"
                : "SUCCESS";

            setTransactionState(prev => ({ ...prev, status }));

            // Process transaction
            const transactionType = isWithdraw ? TRANSACTION_TYPES.WITHDRAW : TRANSACTION_TYPES.DEPOSIT;

            if (status === "ON HOLD") {
                await saveTransaction(
                    formData.accountNumber,
                    transactionType,
                    formData.amount,
                    status
                );

                setTransactionState({
                    error: "",
                    successMessage: "Your transaction has been placed on hold as it has been flagged as suspicious behavior. Please contact support or wait for an admin to confirm your transaction.",
                    status: "ON HOLD",
                    isLoading: false
                });

                setFormData({ accountNumber: "", amount: "" });
                return;
            }

            // Normal transaction processing
            const addAmount = isDeposit;
            const updateResponse = await axios.patch(
                `${ACCOUNT_SERVICE_URL}/accounts/${formData.accountNumber}`,
                {},
                { params: { amount: formData.amount, addAmount } }
            );

            if (updateResponse.status === 200) {
                await saveTransaction(
                    formData.accountNumber,
                    transactionType,
                    formData.amount,
                    status
                );

                setTransactionState({
                    error: "",
                    successMessage: `${isWithdraw ? "Withdrawal" : "Deposit"} successful!`,
                    status: "SUCCESS",
                    isLoading: false
                });

                setFormData({ accountNumber: "", amount: "" });
            } else {
                setTransactionState(prev => ({
                    ...prev,
                    error: "Transaction failed. Please try again.",
                    isLoading: false
                }));
            }
        } catch (error) {
            console.error("Transaction error:", error);
            setTransactionState(prev => ({
                ...prev,
                error: "An error occurred during the transaction.",
                isLoading: false
            }));
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>{isWithdraw ? "Withdraw" : "Deposit"}</h1>
            <p style={styles.subtitle}>Please enter the details for your transaction.</p>

            {transactionState.error && (
                <p style={styles.error}>{transactionState.error}</p>
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

// Styles remain the same as previous version
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