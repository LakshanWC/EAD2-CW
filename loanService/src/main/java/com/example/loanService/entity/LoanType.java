package com.example.loanService.entity;

public enum LoanType {
    PERSONAL("Personal Loan", 10.0),  // 10% interest
    HOME("Home Loan", 12.0),         // 12% interest
    CAR("Car Loan", 6.0),            // 6% interest
    EDUCATION("Education Loan", 5.0),// 5% interest
    BUSINESS("Business Loan", 10.0); // 10% interest

    private final String description;
    private final double interestRate;

    LoanType(String description, double interestRate) {
        this.description = description;
        this.interestRate = interestRate;
    }

    public String getDescription() {
        return description;
    }

    public double getInterestRate() {
        return interestRate;
    }
}