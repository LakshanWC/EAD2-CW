package com.example.account_service.service;

import com.example.account_service.entity.Account;
import com.example.account_service.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

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
        return response;
    }

    //update the balance
    //http://localhost:8080/accounts/upBalance?accountNumber=11110&amount=2000&operation=deposit/withdrawal
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
    }

    //check status
    /*
    public String checkStatus(String accountNumber){
        Account account = accountRepository.findByAccountNumber(accountNumber);
        if(account == null){
            throw new RuntimeException("Account not found : " + accountNumber);
        }
        return account.getStatus();
    }*/

    //update status
    //http://localhost:8080/accounts/upStatus?accountNumber=11110&status=blocked/inactive/closed
    public void updateStatus(String accountNumber, String status){
        Account account = accountRepository.findByAccountNumber(accountNumber);
        if(account == null){
            throw new RuntimeException("Account not found : " + accountNumber);
        }
        account.setStatus(status);
        accountRepository.save(account);
    }

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
    public Account createAccount(Account account) {
        return accountRepository.save(account);
    }

    // Update an existing account
    public Account updateAccount(int accId, Account updatedAccount) {
        Optional<Account> existingAccount = accountRepository.findById(accId);
        if (existingAccount.isPresent()) {
            Account account = existingAccount.get();
            account.setUserId(updatedAccount.getUserId());
            account.setAccountNumber(updatedAccount.getAccountNumber());
            account.setAccountType(updatedAccount.getAccountType());
            account.setBalance(updatedAccount.getBalance());
            account.setStatus(updatedAccount.getStatus());
            return accountRepository.save(account);
        }
        return null;
    }

    // Delete an account
    public void deleteAccount(int accId) {
        accountRepository.deleteById(accId);
    }
}