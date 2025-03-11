package com.example.account_service.service;

import com.example.account_service.entity.Account;
import com.example.account_service.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
    public void updateBalance(String accountNumber, BigDecimal amount, String operation){
        Account account = accountRepository.findByAccountNumber(accountNumber);
        if(account == null){
            throw new RuntimeException("Account not found : " + accountNumber);
        }
        BigDecimal currentBalance = account.getBalance();
        if("deposit".equalsIgnoreCase(operation)){
            account.setBalance(currentBalance.add(amount));
        }
        else if("withdrawl".equalsIgnoreCase(operation)){
            if(currentBalance.compareTo(amount) < 0){
                throw new RuntimeException("Insufficient balance for withdrawl");
            }
            account.setBalance(currentBalance.subtract(amount));
        }
        else{
            throw new RuntimeException("Invalid operation. Use deposit or withdrawl");
        }
        accountRepository.save(account);
    }

    //check status
    public String checkStatus(String accountNumber){
        Account account = accountRepository.findByAccountNumber(accountNumber);
        if(account == null){
            throw new RuntimeException("Account not found : " + accountNumber);
        }
        return account.getStatus();
    }

    //update status
    public void updateStatus(String accountNumber, String status){
        Account account = accountRepository.findByAccountNumber(accountNumber);
        if(account == null){
            throw new RuntimeException("Account not found : " + accountNumber);
        }
        account.setStatus(status);
        accountRepository.save(account);
    }

    // Get all accounts
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    // Get account by ID
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