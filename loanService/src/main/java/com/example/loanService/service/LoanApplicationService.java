package com.example.loanService.service;

import com.example.loanService.entity.LoanApplication;
import com.example.loanService.entity.LoanStatus;
import com.example.loanService.repository.LoanApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class LoanApplicationService {

    private final LoanApplicationRepository repository;

    @Autowired
    public LoanApplicationService(LoanApplicationRepository repository) {
        this.repository = repository;
    }

    // Save a new loan application with default status as PENDING
    public LoanApplication saveLoanApplication(LoanApplication loanApplication) {
        loanApplication.setStatus(LoanStatus.PENDING); // Set default status to PENDING
        return repository.save(loanApplication);
    }

    // Retrieve all loan applications
    public List<LoanApplication> getAllLoanApplications() {
        return repository.findAll();
    }

    // Retrieve a loan application by ID
    public LoanApplication getLoanApplicationById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan application not found"));
    }

    // Calculate loan details (amount, interest, total amount, etc.)
    public Map<String, Object> calculateLoanDetails(Integer id) {
        LoanApplication loanApplication = getLoanApplicationById(id);

        double amount = loanApplication.getAmount().doubleValue();
        double interestRate = loanApplication.getLoanType().getInterestRate();
        double interest = (amount * interestRate) / 100; // Calculate interest
        double totalAmount = amount + interest; // Calculate total amount

        // Prepare response
        Map<String, Object> response = new HashMap<>();
        response.put("firstName", loanApplication.getFirstName());
        response.put("amount", amount);
        response.put("totalAmount", totalAmount);
        response.put("loanType", loanApplication.getLoanType().getDescription());
        response.put("interest", interest);
        response.put("status", loanApplication.getStatus()); // Include status in the response

        return response;
    }

    // Update the status of a loan applications
    public LoanApplication updateLoanStatus(Integer id, LoanStatus status) {
        LoanApplication loanApplication = getLoanApplicationById(id);
        loanApplication.setStatus(status); // Update the status
        return repository.save(loanApplication); // Save the updated application
    }

    //delete an application
    public void deleteLoanApplication(Integer id) {
        if (repository.existsById(id)) {
            repository.deleteById(id); // Delete the loan application
        } else {
            throw new RuntimeException("Loan application not found with ID: " + id);
        }
    }


}