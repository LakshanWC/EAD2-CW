package com.transaction.service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "account_info")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int accountId;

    @Column(name = "account_number")
    private String accountNumber;

    @Column(name = "balance")
    private float balance;

    @Column(name = "account_type")
    private String accountType;

    @Column(name = "status")
    private String status;

    public int getAccountId() {
        return accountId;
    }

    public void setAccountId(int id) {
        this.accountId = id;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public float getBalance() {
        return balance;
    }

    public void setBalance(float balance) {
        this.balance = balance;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
