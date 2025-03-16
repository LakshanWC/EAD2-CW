import React, { useState } from "react";
import axios from "axios"; // For making HTTP requests

const LoanApplicationForm = () => {
    // State to store form data
    const [formData, setFormData] = useState({
        firstName: "",
        secondName: "",
        dob: "",
        telNo: "",
        idNumber: "",
        amount: "",
        loanType: "PERSONAL", // Default loan type
        applyDate: "",
    });

    // State to handle form submission status
    const [submissionStatus, setSubmissionStatus] = useState({
        success: false,
        error: false,
        message: "",
    });

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (
            !formData.firstName ||
            !formData.secondName ||
            !formData.dob ||
            !formData.telNo ||
            !formData.idNumber ||
            !formData.amount ||
            !formData.applyDate
        ) {
            setSubmissionStatus({
                success: false,
                error: true,
                message: "All fields are required.",
            });
            return;
        }

        // Validate date format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(formData.dob) || !dateRegex.test(formData.applyDate)) {
            setSubmissionStatus({
                success: false,
                error: true,
                message: "Date must be in the format YYYY-MM-DD.",
            });
            return;
        }

        // Validate amount (must be a positive number)
        if (isNaN(formData.amount)) {
            setSubmissionStatus({
                success: false,
                error: true,
                message: "Amount must be a number.",
            });
            return;
        }

        try {
            // Send data to the backend
            const response = await axios.post(
                "http://localhost:8080/loan-service/loan/apply",
                {
                    firstName: formData.firstName,
                    secondName: formData.secondName,
                    dob: formData.dob,
                    telNo: formData.telNo,
                    idNumber: formData.idNumber,
                    amount: parseFloat(formData.amount), // Convert to number
                    loanType: formData.loanType,
                    applyDate: formData.applyDate,
                }
            );

            // Handle success response
            setSubmissionStatus({
                success: true,
                error: false,
                message: "Loan application submitted successfully!",
            });

            // Clear the form
            setFormData({
                firstName: "",
                secondName: "",
                dob: "",
                telNo: "",
                idNumber: "",
                amount: "",
                loanType: "PERSONAL",
                applyDate: "",
            });
        } catch (error) {
            // Handle error response
            setSubmissionStatus({
                success: false,
                error: true,
                message: "Failed to submit the loan application. Please try again.",
            });
            console.error("Error submitting loan application:", error);
        }
    };

    return (
        <div>
            <h2>Apply for a Loan</h2>
            <form onSubmit={handleSubmit}>
                {/* First Name */}
                <div>
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter your first name"
                        required
                    />
                </div>

                {/* Second Name */}
                <div>
                    <label>Second Name:</label>
                    <input
                        type="text"
                        name="secondName"
                        value={formData.secondName}
                        onChange={handleInputChange}
                        placeholder="Enter your second name"
                        required
                    />
                </div>

                {/* Date of Birth */}
                <div>
                    <label>Date of Birth (YYYY-MM-DD):</label>
                    <input
                        type="text"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        placeholder="Enter your date of birth"
                        required
                    />
                </div>

                {/* Telephone Number */}
                <div>
                    <label>Telephone Number:</label>
                    <input
                        type="text"
                        name="telNo"
                        value={formData.telNo}
                        onChange={handleInputChange}
                        placeholder="Enter your telephone number"
                        required
                    />
                </div>

                {/* ID Number */}
                <div>
                    <label>ID Number:</label>
                    <input
                        type="text"
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={handleInputChange}
                        placeholder="Enter your ID number"
                        required
                    />
                </div>

                {/* Loan Amount */}
                <div>
                    <label>Loan Amount:</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        placeholder="Enter the loan amount"
                        required
                    />
                </div>

                {/* Loan Type */}
                <div>
                    <label>Loan Type:</label>
                    <select
                        name="loanType"
                        value={formData.loanType}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="PERSONAL">Personal Loan</option>
                        <option value="BUSINESS">Business Loan</option>
                        <option value="CAR">Car Loan</option>
                        <option value="EDUCATION">Education Loan</option>
                        <option value="HOME">Home Loan</option>
                    </select>
                </div>

                {/* Apply Date */}
                <div>
                    <label>Apply Date (YYYY-MM-DD):</label>
                    <input
                        type="text"
                        name="applyDate"
                        value={formData.applyDate}
                        onChange={handleInputChange}
                        placeholder="Enter the application date"
                        required
                    />
                </div>

                {/* Submit Button */}
                <button type="submit">Apply</button>
            </form>

            {/* Display success or error message */}
            {submissionStatus.message && (
                <div style={{ color: submissionStatus.error ? "red" : "green" }}>
                    {submissionStatus.message}
                </div>
            )}
        </div>
    );
};

export default LoanApplicationForm;