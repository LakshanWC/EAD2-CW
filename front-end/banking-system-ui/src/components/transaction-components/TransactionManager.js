import React, { useEffect, useState } from 'react';

const TransactionPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(''); // State for messages

    // Reusable function to fetch transactions
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

    useEffect(() => {
        fetchTransactions();
    }, []);

    // Handle approve button click
    const handleApprove = async (transaction) => {
        const { transactionId, accountNumber, destinationAccountNumber, transactionType, amount } = transaction;

        try {
            if (transactionType === 'DEPOSIT') {
                // Handle deposit
                const response = await fetch(`http://localhost:8085/transaction-service/accounts/${accountNumber}?amount=${amount}&addAmount=true`, {
                    method: 'PATCH',
                });
                if (!response.ok) {
                    throw new Error('Failed to process deposit');
                }
            } else if (transactionType === 'WITHDRAW') {
                // Handle withdrawal
                const response = await fetch(`http://localhost:8085/transaction-service/accounts/${accountNumber}?amount=${amount}&addAmount=false`, {
                    method: 'PATCH',
                });
                if (!response.ok) {
                    throw new Error('Failed to process withdrawal');
                }
            } else if (transactionType === 'TRANSFER') {
                // Handle transfer
                // Check if the account has sufficient balance
                const balanceCheckResponse = await fetch(`http://localhost:8085/transaction-service/accounts/${accountNumber}/balance?amount=${amount}`);
                const balanceCheckText = await balanceCheckResponse.text(); // Handle response as plain text

                if (balanceCheckText !== 'Sufficient Balance') {
                    throw new Error('Insufficient Account Balance');
                }

                // Deduct amount from the source account
                const deductResponse = await fetch(`http://localhost:8085/transaction-service/accounts/${accountNumber}?amount=${amount}&addAmount=false`, {
                    method: 'PATCH',
                });
                if (!deductResponse.ok) {
                    throw new Error('Failed to deduct amount from source account');
                }

                // Add amount to the destination account
                const addResponse = await fetch(`http://localhost:8085/transaction-service/accounts/${destinationAccountNumber}?amount=${amount}&addAmount=true`, {
                    method: 'PATCH',
                });
                if (!addResponse.ok) {
                    throw new Error('Failed to add amount to destination account');
                }
            }

            // Update the transaction status on the server
            const updateStatusResponse = await fetch(`http://localhost:8085/transaction-service/transactions/update/${transactionId}?transactionStatus=APPROVED`, {
                method: 'PATCH',
            });
            if (!updateStatusResponse.ok) {
                throw new Error('Failed to update transaction status');
            }

            // Update the transaction status locally
            setTransactions((prevTransactions) =>
                prevTransactions.map((t) =>
                    t.transactionId === transactionId
                        ? { ...t, status: 'APPROVED' }
                        : t
                )
            );

            setMessage({ text: `Transaction ${transactionId} approved!`, color: 'green' }); // Success message

            // Refetch transactions to update the list
            fetchTransactions();
        } catch (error) {
            setMessage({ text: `Error: ${error.message}`, color: 'red' }); // Error message
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', fontSize: '18px' }}>Loading...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center', fontSize: '18px' }}>Error: {error}</div>;
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ textAlign: 'center', color: '#333' }}>Transactions with Status "ON HOLD"</h1>

            {/* Displaying message */}
            {message && (
                <div style={{ color: message.color, textAlign: 'center', fontSize: '18px', marginBottom: '20px' }}>
                    {message.text}
                </div>
            )}

            <table
                border="1"
                cellPadding="10"
                cellSpacing="0"
                style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    marginTop: '20px',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                }}
            >
                <thead>
                <tr style={{ backgroundColor: '#f2f2f2', color: '#333', fontWeight: 'bold' }}>
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
                    <tr
                        key={transaction.transactionId}
                        style={{
                            backgroundColor: '#fff',
                            textAlign: 'center',
                            transition: 'background-color 0.3s',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
                    >
                        <td>{transaction.transactionId}</td>
                        <td>{transaction.accountNumber}</td>
                        <td>{transaction.destinationAccountNumber || 'N/A'}</td>
                        <td>{transaction.transactionType}</td>
                        <td>{transaction.amount}</td>
                        <td>{transaction.status}</td>
                        <td>{transaction.createdAt}</td>
                        <td>
                            <button
                                onClick={() => handleApprove(transaction)}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#4CAF50',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s',
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#45a049')}
                                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4CAF50')}
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