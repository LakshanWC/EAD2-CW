package com.transaction.service.entity;

import jakarta.persistence.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "transaction_records")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int transactionId;

    @Column(name = "account_number")
    private String accountNumber;

    @Column(name = "destination_account_number")
    private String destinationAccountNumber;

    @Column(name = "transaction_type")
    private String transactionType;

    @Column(name = "amount")
    private double amount;

    @Column(name = "status")
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public int getIsActive() {
        return isActive;
    }

    public void setIsActive(int isActive) {
        this.isActive = isActive;
    }

    @Column(name = "is_active")
    private int isActive;

    public int getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(int transactionId) {
        this.transactionId = transactionId;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getDestinationAccountNumber() {
        return destinationAccountNumber;
    }

    public void setDestinationAccountNumber(String destinationAccountNumber) {
        this.destinationAccountNumber = destinationAccountNumber;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
