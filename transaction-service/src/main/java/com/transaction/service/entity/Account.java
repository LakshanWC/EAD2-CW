package com.transaction.service.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "account_info")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "account_number")
    private String accountNumber;

    @Column(name = "balance")
    private float balance;

    @Column(name = "account_type")
    private String accountType;

    @Column(name = "status")
    private String status;

    @Column(name = "last_updated_at")
    private LocalDateTime lastUpdatedAt;

    public int getId() {return id;}

    public void setId(int id) {this.id = id;}

    public String getAccountNumber() {return accountNumber;}

    public void setAccountNumber(String accountNumber) {this.accountNumber = accountNumber;}

    public float getBalance() {return balance;}

    public void setBalance(float balance) {this.balance = balance;}

    public String getAccountType() {return accountType;}

    public void setAccountType(String accountType) {this.accountType = accountType;}

    public String getStatus() {return status;}

    public void setStatus(String status) {this.status = status;}

    public LocalDateTime getLastUpdatedAt() {return lastUpdatedAt;}

    public void setLastUpdatedAt(LocalDateTime lastUpdatedAt) {this.lastUpdatedAt = lastUpdatedAt;}
}
