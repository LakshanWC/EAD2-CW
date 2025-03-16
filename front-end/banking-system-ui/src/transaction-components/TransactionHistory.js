import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

import axios from "axios";

const TransactionHistory = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]); // Initially empty
    const [loading, setLoading] = useState(false); // Initially not loading
    const [error, setError] = useState(null); // Initially no error
    const [accountNumber, setAccountNumber] = useState(""); // Initially empty
    const [transactionType, setTransactionType] = useState(""); // Filter by transaction type
    const [createdAt, setCreatedAt] = useState(""); // Filter by date
    const [isFormSubmitted, setIsFormSubmitted] = useState(false); // Track if form is submitted

    const fetchData = () => {
        setLoading(true);
        setError(null);

        // Build the API URL with query parameters
        let apiUrl = `http://localhost:8081/transaction-service/transactions?accountNumber=${accountNumber}`;
        if (transactionType) {
            apiUrl += `&transactionType=${transactionType}`;
        }
        if (createdAt) {
            apiUrl += `&createdAt=${createdAt}`;
        }

        axios.get(apiUrl)
            .then(response => {
                console.log("Fetched data:", response.data);
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Axios error:", error);
                setError("Failed to fetch transaction history. Please try again later.");
                setLoading(false);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent form submission from reloading the page
        if (!accountNumber) {
            setError("Please enter an account number.");
            return;
        }
        setIsFormSubmitted(true); // Mark form as submitted
        fetchData(); // Fetch data only when the "Apply Filters" button is pressed
    };

    const handleHome = () => {
        navigate("/home");
    };

    if (loading) {
        return (
            <div style={styles.centered}>
                Loading...
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // If the form hasn't been submitted yet, show the input form
    if (!isFormSubmitted) {
        return (
            <div>
                <h1>Transaction History</h1>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div>
                        <label>
                            Account Number:
                            <input
                                type="text"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                required
                                style={styles.input}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Transaction Type:
                            <select
                                value={transactionType}
                                onChange={(e) => setTransactionType(e.target.value)}
                                style={styles.input}
                            >
                                <option value="">All</option>
                                <option value="WITHDRAW">Withdraw</option>
                                <option value="TRANSFER">Transfer</option>
                                <option value="DEPOSIT">Deposit</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label>
                            Created At:
                            <input
                                type="date"
                                value={createdAt}
                                onChange={(e) => setCreatedAt(e.target.value)}
                                style={styles.input}
                            />
                        </label>
                    </div>
                    <button type="submit" style={styles.button}>Apply Filters</button>
                </form>
            </div>
        );
    }

    // Filter the transactions into categories (use uppercase for transactionType)
    const withdrawals = data.filter(item => item.transactionType === "WITHDRAW");
    const transfers = data.filter(item => item.transactionType === "TRANSFER");
    const deposits = data.filter(item => item.transactionType === "DEPOSIT");

    return (
        <div>
            <h1>Transaction History</h1>

            {/* Form for account number and filters */}
            <form onSubmit={handleSubmit} style={styles.form}>
                <div>
                    <label>
                        Account Number:
                        <input
                            type="text"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Transaction Type:
                        <select
                            value={transactionType}
                            onChange={(e) => setTransactionType(e.target.value)}
                            style={styles.input}
                        >
                            <option value="">All</option>
                            <option value="WITHDRAW">Withdraw</option>
                            <option value="TRANSFER">Transfer</option>
                            <option value="DEPOSIT">Deposit</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Created At:
                        <input
                            type="date"
                            value={createdAt}
                            onChange={(e) => setCreatedAt(e.target.value)}
                            style={styles.input}
                        />
                    </label>
                </div>
                <button type="submit" style={styles.button}>Apply Filters</button>
            </form>

            {/* Display Withdrawals */}
            {withdrawals.length > 0 && (
                <div>
                    <h2>Withdrawals</h2>
                    <table border="1" style={styles.table}>
                        <thead>
                        <tr>
                            <th><strong>Transaction ID</strong></th>
                            <th><strong>Account Number</strong></th>
                            <th><strong>Transaction Type</strong></th>
                            <th><strong>Amount</strong></th>
                            <th><strong>Status</strong></th>
                            <th><strong>Created At</strong></th>
                        </tr>
                        </thead>
                        <tbody>
                        {withdrawals.map((item, index) => (
                            <tr key={item.transactionId}
                                style={{backgroundColor: index % 2 === 0 ? "#f2f2f2" : "white"}}>
                                <td>{item.transactionId}</td>
                                <td>{item.accountNumber}</td>
                                <td>{item.transactionType}</td>
                                <td>{item.amount}</td>
                                <td>{item.status}</td>
                                <td>{item.createdAt}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Display Transfers */}
            {transfers.length > 0 && (
                <div>
                    <h2>Transfers</h2>
                    <table border="1" style={styles.table}>
                        <thead>
                        <tr>
                            <th><strong>Transaction ID</strong></th>
                            <th><strong>Account Number</strong></th>
                            <th><strong>Transaction Type</strong></th>
                            <th><strong>Destination Account Number</strong></th>
                            <th><strong>Amount</strong></th>
                            <th><strong>Status</strong></th>
                            <th><strong>Created At</strong></th>
                        </tr>
                        </thead>
                        <tbody>
                        {transfers.map((item, index) => (
                            <tr key={item.transactionId}
                                style={{backgroundColor: index % 2 === 0 ? "#f2f2f2" : "white"}}>
                                <td>{item.transactionId}</td>
                                <td>{item.accountNumber}</td>
                                <td>{item.transactionType}</td>
                                <td>{item.destinationAccountNumber || "N/A"}</td>
                                <td>{item.amount}</td>
                                <td>{item.status}</td>
                                <td>{item.createdAt}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Display Deposits */}
            {deposits.length > 0 && (
                <div>
                    <h2>Deposits</h2>
                    <table border="1" style={styles.table}>
                        <thead>
                        <tr>
                            <th><strong>Transaction ID</strong></th>
                            <th><strong>Account Number</strong></th>
                            <th><strong>Transaction Type</strong></th>
                            <th><strong>Amount</strong></th>
                            <th><strong>Status</strong></th>
                            <th><strong>Created At</strong></th>
                        </tr>
                        </thead>
                        <tbody>
                        {deposits.map((item, index) => (
                            <tr key={item.transactionId}
                                style={{backgroundColor: index % 2 === 0 ? "#f2f2f2" : "white"}}>
                                <td>{item.transactionId}</td>
                                <td>{item.accountNumber}</td>
                                <td>{item.transactionType}</td>
                                <td>{item.amount}</td>
                                <td>{item.status}</td>
                                <td>{item.createdAt}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* If no transactions found */}
            {withdrawals.length === 0 && transfers.length === 0 && deposits.length === 0 && (
                <p>No transactions found.</p>
            )}
        </div>
    );
};

const styles = {
    centered: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
        fontSize: "24px",
    },
    form: {
        marginBottom: "20px",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        backgroundColor: "#f9f9f9",
    },
    input: {
        margin: "5px",
        padding: "8px",
        borderRadius: "4px",
        border: "1px solid #ccc",
    },
    button: {
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    table: {
        width: "100%",
        marginTop: "20px",
        textAlign: "left",
        borderCollapse: "collapse",
    },
};

export default TransactionHistory;