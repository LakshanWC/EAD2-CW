import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Home from "./Home";

const TransactionHistory = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const apiUrl = 'http://localhost:8081/transaction-service/transactions?accountNumber=ACCT1234567890123456';

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Fetched data:", data); // Log the fetched data
                setData(data);  // Set the array of transactions
                setLoading(false);
            })
            .catch(error => {
                console.error("Fetch error:", error); // Log the error
                setError(error);
                setLoading(false);
            });
    }, []);

    const handleHome = () => {
        navigate("/home");
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <div className={"nav-bar-line"}>
                <button className={"nav-button"} onClick={handleHome}>Home</button>
            </div>
            <h1>Transaction History</h1>
            {data.length > 0 ? (
                <table border="1" style={{ width: "100%", marginTop: "20px", textAlign: "left" }}>
                    <thead>
                    <tr>
                        <th><strong>Transaction ID</strong></th>
                        <th><strong>Account Number</strong></th>
                        <th><strong>Destination Account Number</strong></th>
                        <th><strong>Transaction Type</strong></th>
                        <th><strong>Amount</strong></th>
                        <th><strong>Status</strong></th>
                        <th><strong>Created At</strong></th>

                    </tr>
                    </thead>
                    <tbody>
                    {data.map(item => (
                        <tr key={item.transactionId}>
                            <td>{item.transactionId}</td>
                            <td>{item.accountNumber}</td>
                            <td>{item.destinationAccountNumber || "N/A"}</td>
                            <td>{item.transactionType}</td>
                            <td>{item.amount}</td>
                            <td>{item.status}</td>
                            <td>{item.createdAt}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No transactions found.</p>
            )}
        </div>
    );
};

export default TransactionHistory;
