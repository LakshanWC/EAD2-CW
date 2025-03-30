package com.example.loanService.controller;
import org.springframework.web.bind.annotation.*;

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
//@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
public class LoanApplicationController {

    private final LoanApplicationService service;

    @Autowired //automatically provide service when creating controller
    public LoanApplicationController(LoanApplicationService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<LoanApplication> applyForLoan(@RequestBody LoanApplication loanApplication) {
        LoanApplication savedApplication = service.saveLoanApplication(loanApplication);
        return new ResponseEntity<>(savedApplication, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<LoanApplication>> getAllLoans() {
        List<LoanApplication> loans = service.getAllLoanApplications();
        return new ResponseEntity<>(loans, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getLoanDetails(@PathVariable Integer id) {
        Map<String, Object> details = service.calculateLoanDetails(id);// call the calculate function in service method
        return new ResponseEntity<>(details, HttpStatus.OK); //return the response
    }

    @PutMapping("/{id}")
    public ResponseEntity<LoanApplication> updateLoanStatus(
            @PathVariable Integer id,
            @RequestParam LoanStatus status) {
        LoanApplication updatedApplication = service.updateLoanStatus(id, status);
        return new ResponseEntity<>(updatedApplication, HttpStatus.OK);
    }//get url and status then update the db using updateLoanStatus method in service


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLoanApplication(@PathVariable Integer id) {
        try {
            service.deleteLoanApplication(id); // Delete the loan application
            return new ResponseEntity<>("Loan application deleted successfully", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        //delete loan applcation using the id and if it is not found display the error message
    }

}