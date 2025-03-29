package com.example.loanService.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "loanapplication")
public class LoanApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)//id is auto increatement and primarykey
    private Integer id;

    private String firstName;
    private String secondName;

    @Temporal(TemporalType.DATE)//take only the data without taking the time
    private Date dob;

    private String telNo;
    private String idNumber;

    private BigDecimal amount;

    @Enumerated(EnumType.STRING)//store enum values
    private LoanType loanType;

    @Temporal(TemporalType.DATE)
    private Date applyDate;

    @Enumerated(EnumType.STRING)
    private LoanStatus status = LoanStatus.PENDING; // Default status is PENDING

    public LoanApplication() {}

    public LoanApplication(String firstName, String secondName, Date dob, String telNo,
                           String idNumber, BigDecimal amount, LoanType loanType, Date applyDate) {
        this.firstName = firstName;
        this.secondName = secondName;
        this.dob = dob;
        this.telNo = telNo;
        this.idNumber = idNumber;
        this.amount = amount;
        this.loanType = loanType;
        this.applyDate = applyDate;
        this.status = LoanStatus.PENDING; // Set default status
    }

    // Getters and Setters

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getSecondName() { return secondName; }
    public void setSecondName(String secondName) { this.secondName = secondName; }

    public Date getDob() { return dob; }
    public void setDob(Date dob) { this.dob = dob; }

    public String getTelNo() { return telNo; }
    public void setTelNo(String telNo) { this.telNo = telNo; }

    public String getIdNumber() { return idNumber; }
    public void setIdNumber(String idNumber) { this.idNumber = idNumber; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public LoanType getLoanType() { return loanType; }
    public void setLoanType(LoanType loanType) { this.loanType = loanType; }

    public Date getApplyDate() { return applyDate; }
    public void setApplyDate(Date applyDate) { this.applyDate = applyDate; }

    public LoanStatus getStatus() { return status; }
    public void setStatus(LoanStatus status) { this.status = status; }
}