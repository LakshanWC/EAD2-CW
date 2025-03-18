import React, { useEffect, useState } from 'react';

const TransactionPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch data from the API
        const fetchTransactions = async () => {
            try {
                const response = await fetch('http://localhost:8085/transaction-service/transactions/all');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                // Filter transactions with status "ON HOLD"
                const filteredTransactions = data.filter(transaction => transaction.status === 'ON HOLD');
                setTransactions(filteredTransactions);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    // Handle approve button click
    const handleApprove = (transactionId) => {
        // Simulate approval (replace with actual API call)
        alert(`Transaction ${transactionId} approved!`);
        // Update the transaction status locally (optional)
        setTransactions((prevTransactions) =>
            prevTransactions.map((transaction) =>
                transaction.transactionId === transactionId
                    ? { ...transaction, status: 'APPROVED' }
                    : transaction
            )
        );
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Transactions with Status "ON HOLD"</h1>
            <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr>
                    <th>Transaction ID</th>
                    <th>Account Number</th>
                    <th>Destination Account Number</th>
                    <th>Transaction Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {transactions.map((transaction) => (
                    <tr key={transaction.transactionId}>
                        <td>{transaction.transactionId}</td>
                        <td>{transaction.accountNumber}</td>
                        <td>{transaction.destinationAccountNumber || 'N/A'}</td>
                        <td>{transaction.transactionType}</td>
                        <td>{transaction.amount}</td>
                        <td>{transaction.status}</td>
                        <td>{transaction.createdAt}</td>
                        <td>
                            <button
                                onClick={() => handleApprove(transaction.transactionId)}
                                style={{ padding: '5px 10px', cursor: 'pointer' }}
                            >
                                Approve
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionPage;