package com.example.account_service.service;

import com.example.account_service.entity.Account;
import com.example.account_service.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service

public class AccountService {
    @Autowired
    private AccountRepository accountRepository;

    //check balance
    //http://localhost:8080/accounts/balance?accountNumber=11110
    public Map<String, Object> checkBalance(String accountNumber){
        Account account = accountRepository.findByAccountNumber(accountNumber);
        if (account == null){
            throw new RuntimeException("Account not found : " + accountNumber);
        }
        Map<String, Object> response = new HashMap<>();
        response.put ("accountNumber", account.getAccountNumber());
        response.put ("accountType", account.getAccountType());
        response.put ("balance", account.getBalance());
        response.put ("status", account.getStatus());
        return response;
    }

    //update the balance
    //http://localhost:8080/accounts/upBalance?accountNumber=11110&amount=2000&operation=deposit/withdrawal
    /*
    public ResponseEntity<String> updateBalance
    (String accountNumber, BigDecimal amount, String operation){
        Account account = accountRepository.findByAccountNumber(accountNumber);
        if (account == null){
            return ResponseEntity.badRequest().body("Account is not found. Invalid account number " + accountNumber);
        }
        //check account status
        String status = account.getStatus();
        if ("INACTIVE".equalsIgnoreCase(status)|| "BLOCKED".equalsIgnoreCase(status) || "CLOSED".equalsIgnoreCase(status)){
            return ResponseEntity.badRequest().body("Account is " + status + ".No transaction allowed.");
        }
        BigDecimal currentBalance = account.getBalance();

        //deposit or withdrawal process
        if("deposit".equalsIgnoreCase(operation)){
            account.setBalance(currentBalance.add(amount));
            accountRepository.save(account);
            return ResponseEntity.ok("Deposit successful. New balance is: " + account.getBalance());
        }else if("withdrawal".equalsIgnoreCase(operation)) {
            if (currentBalance.compareTo(amount) <0) {
                return ResponseEntity.badRequest().body("Insufficient balance. Your current balance is: " + account.getBalance());
            }
            account.setBalance(currentBalance.subtract(amount));
            accountRepository.save(account);
            return ResponseEntity.ok("Withdrawal is successful. New balance is: " + account.getBalance());
        }else{
            return ResponseEntity.badRequest().body("Invalid operation. ");
        }
    }*/

    // Get all accounts
    //http://localhost:8080/accounts
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    // Get account by ID
    //http://localhost:8080/accounts/1
    public Account getAccountById(int accId) {
        Optional<Account> account = accountRepository.findById(accId);
        return account.orElse(null);
    }

    // Create a new account
    /*
    public Account createAccount(Account account) {
        if (!"ADMIN".equals(account.getRole())){
            throw new RuntimeException("Unauthorized access. Only admins can create accounts");
        }
        return accountRepository.save(account);
    }*/
    public Account createAccount(Account account) {
        System.out.println("Creating account: " + account); // Log the account details
        return accountRepository.save(account);
    }

    // Update an existing account
    /*
    public ResponseEntity<String> updateAccount(int accId, Account updatedAccount){
        Optional<Account> existingAccount = accountRepository.findById(accId);
        if(existingAccount.isEmpty()){
            return ResponseEntity.badRequest().body("Account not found.");
        }
        Account account = existingAccount.get();

        if(!"ADMIN".equals(account.getRole())){
            return ResponseEntity.badRequest().body("Unauthorized access. Only admins can update accounts.");
        }
        account.setAccountNumber(updatedAccount.getAccountNumber());
        account.setAccountType(updatedAccount.getAccountType());
        account.setBalance(updatedAccount.getBalance());
        account.setStatus(updatedAccount.getStatus());
        account.setRole(updatedAccount.getRole());

        accountRepository.save(account);
        return ResponseEntity.ok("Account updated successfully.");
    }*/
    @Transactional
    public ResponseEntity<String> updateAccount(int accId, Account updatedAccount) {
        System.out.println("Received data: " + updatedAccount);
        Optional<Account> existingAccount = accountRepository.findById(accId);

        if (existingAccount.isEmpty()) {
            return ResponseEntity.badRequest().body("Account not found.");
        }

        Account account = existingAccount.get();

        // Check if account is deleted
        if ("DELETED".equalsIgnoreCase(account.getStatus())) {
            return ResponseEntity.badRequest().body("Cannot update a deleted account.");
        }

        // Validate updated fields
        if (updatedAccount.getAccountNumber() == null || updatedAccount.getAccountNumber().isEmpty()) {
            return ResponseEntity.badRequest().body("Account number cannot be empty.");
        }

        // Update account details
        account.setAccountNumber(updatedAccount.getAccountNumber());
        account.setAccountType(updatedAccount.getAccountType());
        account.setBalance(updatedAccount.getBalance());
        account.setStatus(updatedAccount.getStatus());


        // Log the updated account details
        System.out.println("Updated account details: " + account);

        // Save the updated account
        accountRepository.save(account);
        System.out.println("Account saved successfully: " + account);

        return ResponseEntity.ok("Account updated successfully.");
    }

    // Delete an account
    /*
    public ResponseEntity<String> deleteAccount(int accId){
        Optional<Account> account = accountRepository.findById(accId);
        if(account.isEmpty()){
            return ResponseEntity.badRequest().body("Account not found.");
        }
        if(!"ADMIN".equals(account.get().getRole())){
            return ResponseEntity.badRequest().body("Unauthorized access. Only admins can delete accounts.");
        }
        accountRepository.deleteById(accId);
        return ResponseEntity.ok("Account deleted successfully.");
    }*/

    @Transactional
    public ResponseEntity<String> deleteAccount(int accId) {
        System.out.println("Searching for account with ID: " + accId); // Log the account ID being searched
        Optional<Account> account = accountRepository.findById(accId);

        if (account.isEmpty()) {
            System.out.println("Account not found with ID: " + accId); // Log account not found
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body("Account not found.");
        }

        Account acc = account.get();
        System.out.println("Account found: " + acc); // Log the account details
        String accountStatus = acc.getStatus();

        if ("ACTIVE".equalsIgnoreCase(accountStatus)) {
            System.out.println("Cannot delete active account with ID: " + accId); // Log active account
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body("Account is active. Cannot delete.");
        }

        accountRepository.deleteById(accId);
        System.out.println("Account deleted successfully: " + accId); // Log successful deletion
        return ResponseEntity.ok("Account deleted successfully.");
    }
}