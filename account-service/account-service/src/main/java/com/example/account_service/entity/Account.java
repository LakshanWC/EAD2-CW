package com.example.account_service.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "accountservice") // Map to the correct table name
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "Acc-ID") // Map to the correct column name
    private int accId;

    @Column(name = "User-ID") // Map to the correct column name
    private int userId;

    @Column(name = "Account-Number") // Map to the correct column name
    private String accountNumber;

    @Column(name = "Account-Type") // Map to the correct column name
    private String accountType;

    @Column(name = "Balance") // Map to the correct column name
    private BigDecimal balance;

    @Column(name = "Status") // Map to the correct column name
    private String status;

    // Getters and Setters
    public int getAccId() {
        return accId;
    }

    public void setAccId(int accId) {
        this.accId = accId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}