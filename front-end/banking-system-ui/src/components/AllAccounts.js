import axios from "axios";
import {useState} from "react";

// eslint-disable-next-line react-hooks/rules-of-hooks
const [allAccounts, setAllAccounts] = useState([]); // State to store all accounts
// eslint-disable-next-line react-hooks/rules-of-hooks
const [showAllAccounts, setShowAllAccounts] = useState(false); // State to toggle visibility

// Function to fetch all accounts
const handleViewAllAccounts = async () => {
    try {
        const response = await axios.get("http://localhost:8080/account-service/accounts");
        setAllAccounts(response.data); // Store fetched accounts in state
        setShowAllAccounts(true); // Show the form
    } catch (error) {
        console.error("Error fetching all accounts:", error);
    }
};