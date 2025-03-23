import React from "react";
import { useNavigate } from "react-router-dom";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false, // State to track loading status
            errorMessage: null, // Store error messages
        };
    }

    // Function to handle the refresh button click
    handleRefresh = async () => {
        this.setState({ isLoading: true, errorMessage: null }); // Reset error message

        try {
            // Step 1: Fetch data from the account-service endpoint
            console.log("Fetching account data...");
            const accountResponse = await fetch("http://localhost:8080/account-service/accounts");

            if (!accountResponse.ok) {
                throw new Error(`Account Service Error: ${accountResponse.statusText}`);
            }

            const accountData = await accountResponse.json();

            // Step 2: Transform the fetched data into the required format
            const transformedData = accountData.map(account => ({
                accountNumber: account.accountNumber,
                balance: account.balance,
                accountType: account.accountType,
                status: account.status,
                lastUpdatedAt: new Date().toISOString() // Add current datetime
            }));

            // Print the transformed data to the console
            console.log("Transformed Data:", transformedData);

            // Step 3: Send the transformed data to the transaction-service endpoint
            console.log("Sending data to transaction-service...");
            const transactionResponse = await fetch("http://localhost:8085/transaction-service/accounts/batch", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(transformedData)
            });

            if (!transactionResponse.ok) {
                throw new Error(`Transaction Service Error: ${transactionResponse.statusText}`);
            }

            console.log("Account data refreshed and updated in transaction-service!");
        } catch (error) {
            console.error("Failed to refresh account data:", error);
            this.setState({ errorMessage: error.message });
        } finally {
            this.setState({ isLoading: false });
        }
    };

    // Call the handleRefresh function once the component mounts
    componentDidMount() {
        this.handleRefresh();
    }

    render() {
        const { user } = this.props; // Destructure the user prop
        const { isLoading, errorMessage } = this.state; // Destructure state

        return (
            <div>
                <h1>Welcome to ABC Bank</h1>
                {user && <p>Hello, {user.username}!</p>} {/* Display the username if user is logged in */}

                {/* Conditionally render a button if the user role is ADMIN */}
                {user && user.role === "ADMIN" && (
                    <div>
                        <button onClick={this.handleRefresh} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    <span className="ms-2">Refreshing...</span>
                                </>
                            ) : (
                                "Refresh Account Data"
                            )}
                        </button>

                        {/* Display error message if there is one */}
                        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                    </div>
                )}
            </div>
        );
    }
}

function HomeWithNavigate(props) {
    const navigate = useNavigate();
    return <Home {...props} navigate={navigate} />;
}

export default HomeWithNavigate;
