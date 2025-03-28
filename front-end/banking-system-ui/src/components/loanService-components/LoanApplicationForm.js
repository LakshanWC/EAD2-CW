import React, { useState } from "react";
import axios from "axios";

const LoanApplicationForm = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        secondName: "",
        dob: "",
        telNo: "",
        idNumber: "",
        amount: "",
        loanType: "PERSONAL",
        applyDate: "",
    });

    const [submissionStatus, setSubmissionStatus] = useState({
        success: false,
        error: false,
        message: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

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
            setIsSubmitting(false);
            return;
        }

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(formData.dob) || !dateRegex.test(formData.applyDate)) {
            setSubmissionStatus({
                success: false,
                error: true,
                message: "Date must be in the format YYYY-MM-DD.",
            });
            setIsSubmitting(false);
            return;
        }

        if (isNaN(formData.amount)) {
            setSubmissionStatus({
                success: false,
                error: true,
                message: "Amount must be a number.",
            });
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8080/loan-service/loan/apply",
                {
                    firstName: formData.firstName,
                    secondName: formData.secondName,
                    dob: formData.dob,
                    telNo: formData.telNo,
                    idNumber: formData.idNumber,
                    amount: parseFloat(formData.amount),
                    loanType: formData.loanType,
                    applyDate: formData.applyDate,
                }
            );

            setSubmissionStatus({
                success: true,
                error: false,
                message: "Loan application submitted successfully!",
            });

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
            setSubmissionStatus({
                success: false,
                error: true,
                message: "Failed to submit the loan application. Please try again.",
            });
            console.error("Error submitting loan application:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Loan Application</h2>
                    <p style={styles.subtitle}>Fill out the form below to apply for a loan</p>
                    <div style={styles.divider}></div>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGrid}>
                        {/* First Name */}
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                First Name
                                <span style={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                placeholder="John"
                                style={styles.input}
                                required
                            />
                        </div>

                        {/* Second Name */}
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Second Name
                                <span style={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                name="secondName"
                                value={formData.secondName}
                                onChange={handleInputChange}
                                placeholder="Doe"
                                style={styles.input}
                                required
                            />
                        </div>

                        {/* Date of Birth */}
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Date of Birth
                                <span style={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                name="dob"
                                value={formData.dob}
                                onChange={handleInputChange}
                                placeholder="YYYY-MM-DD"
                                style={styles.input}
                                required
                            />
                        </div>

                        {/* Telephone Number */}
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Telephone Number
                                <span style={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                name="telNo"
                                value={formData.telNo}
                                onChange={handleInputChange}
                                placeholder="+1234567890"
                                style={styles.input}
                                required
                            />
                        </div>

                        {/* ID Number */}
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                ID Number
                                <span style={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                name="idNumber"
                                value={formData.idNumber}
                                onChange={handleInputChange}
                                placeholder="123456789"
                                style={styles.input}
                                required
                            />
                        </div>

                        {/* Loan Amount */}
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Loan Amount
                                <span style={styles.required}>*</span>
                            </label>
                            <div style={styles.amountContainer}>
                                <span style={styles.currency}>$</span>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    placeholder="5000"
                                    style={{...styles.input, paddingLeft: '30px'}}
                                    required
                                />
                            </div>
                        </div>

                        {/* Loan Type */}
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Loan Type
                                <span style={styles.required}>*</span>
                            </label>
                            <select
                                name="loanType"
                                value={formData.loanType}
                                onChange={handleInputChange}
                                style={styles.select}
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
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Apply Date
                                <span style={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                name="applyDate"
                                value={formData.applyDate}
                                onChange={handleInputChange}
                                placeholder="YYYY-MM-DD"
                                style={styles.input}
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div style={styles.buttonContainer}>
                        <button
                            type="submit"
                            style={isSubmitting ? styles.submitButtonDisabled : styles.submitButton}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg style={styles.spinner} viewBox="0 0 50 50">
                                        <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                "Submit Application"
                            )}
                        </button>
                    </div>
                </form>

                {/* Status Message */}
                {submissionStatus.message && (
                    <div style={submissionStatus.error ? styles.errorMessage : styles.successMessage}>
                        <svg
                            style={submissionStatus.error ? styles.errorIcon : styles.successIcon}
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="currentColor"
                                d={submissionStatus.error ?
                                    "M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" :
                                    "M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
                                }
                            />
                        </svg>
                        <div>
                            <p style={styles.statusTitle}>
                                {submissionStatus.error ? "Error" : "Success"}
                            </p>
                            <p style={styles.statusText}>{submissionStatus.message}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        padding: "20px",
    },
    card: {
        width: "100%",
        maxWidth: "800px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
        padding: "40px",
        transition: "all 0.3s ease",
    },
    header: {
        marginBottom: "30px",
        textAlign: "center",
    },
    title: {
        fontSize: "28px",
        fontWeight: "700",
        color: "#2d3748",
        margin: "0 0 5px 0",
    },
    subtitle: {
        fontSize: "16px",
        color: "#718096",
        margin: "0 0 15px 0",
    },
    divider: {
        height: "3px",
        background: "linear-gradient(90deg, #4f46e5, #ec4899)",
        borderRadius: "3px",
        width: "80px",
        margin: "0 auto",
    },
    form: {
        marginTop: "20px",
    },
    formGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px",
    },
    formGroup: {
        marginBottom: "15px",
    },
    label: {
        display: "block",
        marginBottom: "8px",
        fontSize: "14px",
        fontWeight: "500",
        color: "#4a5568",
    },
    required: {
        color: "#e53e3e",
        marginLeft: "4px",
    },
    input: {
        width: "100%",
        padding: "12px 15px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        fontSize: "16px",
        transition: "all 0.3s",
        boxSizing: "border-box",
        backgroundColor: "#f8fafc",
    },
    select: {
        width: "100%",
        padding: "12px 15px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        fontSize: "16px",
        transition: "all 0.3s",
        boxSizing: "border-box",
        backgroundColor: "#f8fafc",
        appearance: "none",
        backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 10px center",
        backgroundSize: "20px",
    },
    amountContainer: {
        position: "relative",
    },
    currency: {
        position: "absolute",
        left: "15px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "#4a5568",
        fontWeight: "500",
    },
    buttonContainer: {
        marginTop: "30px",
        textAlign: "center",
    },
    submitButton: {
        padding: "15px 30px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#4f46e5",
        color: "#fff",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "600",
        transition: "all 0.2s",
        width: "100%",
        maxWidth: "300px",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
    },
    submitButtonDisabled: {
        padding: "15px 30px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#a0aec0",
        color: "#fff",
        cursor: "not-allowed",
        fontSize: "16px",
        fontWeight: "600",
        transition: "all 0.2s",
        width: "100%",
        maxWidth: "300px",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
    },
    spinner: {
        animation: "rotate 1s linear infinite",
        height: "20px",
        width: "20px",
        color: "#ffffff",
    },
    successMessage: {
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        marginTop: "25px",
        padding: "16px",
        borderRadius: "8px",
        backgroundColor: "#f0fdf4",
        borderLeft: "4px solid #10b981",
    },
    errorMessage: {
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        marginTop: "25px",
        padding: "16px",
        borderRadius: "8px",
        backgroundColor: "#fef2f2",
        borderLeft: "4px solid #ef4444",
    },
    successIcon: {
        width: "24px",
        height: "24px",
        color: "#10b981",
        flexShrink: "0",
    },
    errorIcon: {
        width: "24px",
        height: "24px",
        color: "#ef4444",
        flexShrink: "0",
    },
    statusTitle: {
        fontSize: "16px",
        fontWeight: "600",
        margin: "0 0 4px 0",
    },
    statusText: {
        fontSize: "14px",
        margin: "0",
    },
};

// Add animation for spinner
const styleTag = document.createElement('style');
styleTag.innerHTML = `
    @keyframes rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    input:focus, select:focus {
        border-color: #4f46e5 !important;
        box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2) !important;
        outline: none;
    }
    button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
`;
document.head.appendChild(styleTag);

export default LoanApplicationForm;