package com.example.loanService.controller;

import com.example.loanService.entity.LoanApplication;
import com.example.loanService.entity.LoanStatus;
import com.example.loanService.service.LoanApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/loan")
public class LoanApplicationController {

    private final LoanApplicationService service;

    @Autowired
    public LoanApplicationController(LoanApplicationService service) {
        this.service = service;
    }

    @PostMapping("/apply")
    public ResponseEntity<LoanApplication> applyForLoan(@RequestBody LoanApplication loanApplication) {
        LoanApplication savedApplication = service.saveLoanApplication(loanApplication);
        return new ResponseEntity<>(savedApplication, HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<LoanApplication>> getAllLoans() {
        List<LoanApplication> loans = service.getAllLoanApplications();
        return new ResponseEntity<>(loans, HttpStatus.OK);
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<Map<String, Object>> getLoanDetails(@PathVariable Integer id) {
        Map<String, Object> details = service.calculateLoanDetails(id);
        return new ResponseEntity<>(details, HttpStatus.OK);
    }

    @PutMapping("/updateStatus/{id}")
    public ResponseEntity<LoanApplication> updateLoanStatus(
            @PathVariable Integer id,
            @RequestParam LoanStatus status) {
        LoanApplication updatedApplication = service.updateLoanStatus(id, status);
        return new ResponseEntity<>(updatedApplication, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteLoanApplication(@PathVariable Integer id) {
        try {
            service.deleteLoanApplication(id); // Delete the loan application
            return new ResponseEntity<>("Loan application deleted successfully", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}