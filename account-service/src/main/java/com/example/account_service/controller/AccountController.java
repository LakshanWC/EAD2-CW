package com.example.account_service.controller;

import com.example.account_service.entity.Account;
import com.example.account_service.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/accounts")
//@CrossOrigin(origins = "http://localhost:3000")
public class AccountController {

    @Autowired
    private AccountService accountService;

    //check balance
    @GetMapping("/balance")
    public Map<String, Object> checkBalance(@RequestParam String accountNumber){
        return accountService.checkBalance(accountNumber);
    }

    //update balance

    @PostMapping("/upBalance")
    public ResponseEntity<String> updateBalance(
            @RequestParam String accountNumber,
            @RequestParam BigDecimal amount,
            @RequestParam String operation){
        return accountService.updateBalance(accountNumber, amount, operation);

    }

    //check status
    /*
    @GetMapping("/status")
    public String checkStatus(@RequestParam String accountNumber){
        return accountService.checkStatus(accountNumber);
    }*/

    //update status
    /*
    @PostMapping("/upStatus")
    public ResponseEntity<String> updateStatus(
            @RequestParam String accountNumber,
            @RequestParam String status) {
        accountService.updateStatus(accountNumber, status);
        return ResponseEntity.ok("Status updated successfully");
    }*/



    // Get all accounts
    @GetMapping
    public List<Account> getAllAccounts() {
        return accountService.getAllAccounts();
    }

    // Get account by ID
    @GetMapping("/{accId}")
    public Account getAccountById(@PathVariable int accId) {
        return accountService.getAccountById(accId);
    }

    // Create new account
    @PostMapping
    public Account createAccount(@RequestBody Account account) {
        return accountService.createAccount(account);
    }

    // Update account
    @PutMapping("/{accId}")
    public ResponseEntity<String> updateAccount(@PathVariable int accId, @RequestBody Account updatedAccount) {
        return accountService.updateAccount(accId, updatedAccount);
    }

    // Delete an account
    @DeleteMapping("/{accId}")
    public void deleteAccount(@PathVariable int accId) {
        accountService.deleteAccount(accId);
    }



    @GetMapping("/health")
    public ResponseEntity<String> checkHealth(){return ResponseEntity.ok("Health check OK");}

}