package com.transaction.service.service;

import com.transaction.service.entity.Account;
import com.transaction.service.repository.AccountRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;
import java.util.List;
import java.util.Optional;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    public String isValidAccount(String accountNumber) {
        String accountStatus = accountRepository.isValidAccount(accountNumber);
        if (accountStatus == null){return "Account Not Found";}
        else if (accountStatus.equals("ACTIVE")) {return "Account is Valid and Active";}
        else {return "Account Not Active";}
    }

    public String isBalanceSufficient(String accountNumber, float balance) {
        float currentBalance = accountRepository.isBalanceSufficient(accountNumber);
        if (currentBalance >= balance) {return "Sufficient Balance";}
        else {return "Insufficient Account Balance";}
    }

    @Transactional
    public String updateBalanceAdd(String accountNumber, float balance,boolean addAmount) {
        int isSuccs;
        if(addAmount) {
            isSuccs = accountRepository.updateBalanceAdd(accountNumber, balance);
            if (isSuccs == 1) {return "Account Updated Successfully";}
            else {return "Account Not Updated";}
        }
        else{
           isSuccs = accountRepository.updateBalanceSubtract(accountNumber, balance);
            if (isSuccs == 1) {return "Subtract Successfully";}
            else {return "Subtract failed";}
        }
    }

    public String updateAcountData(Account account) {
        try {
            Account savedAccount = accountRepository.save(account);
            if (savedAccount != null) {
                return "Account saved successfully!";
            } else {
                return "Failed to save account.";
            }
        } catch (Exception e) {
            return "Error occurred while saving account: " + e.getMessage();
        }
    }


    @Transactional
    public List<Account> updateOrAddAccounts(List<Account> accounts) {
        List<Account> updatedAccounts = new ArrayList<>();
        Set<String> incomingAccountNumbers = new HashSet<>();

        // First pass: collect all incoming account numbers to check for duplicates in the input
        for (Account account : accounts) {
            if (!incomingAccountNumbers.add(account.getAccountNumber())) {
                // This account number was already seen in the input list - skip it
                continue;
            }

            // Check for duplicates in database
            List<Account> duplicateAccounts = accountRepository.findAllByAccountNumber(account.getAccountNumber());

            // If duplicate, keep the most recent one and delete others
            if (duplicateAccounts.size() > 1) {
                // Sort by lastUpdatedAt descending to get the most recent
                duplicateAccounts.sort((a1, a2) -> a2.getLastUpdatedAt().compareTo(a1.getLastUpdatedAt()));

                // Keep most recent and delete the rest
                for (int i = 1; i < duplicateAccounts.size(); i++) {
                    accountRepository.delete(duplicateAccounts.get(i));
                }
            }

            Optional<Account> existingAccount = accountRepository.findByAccountNumber(account.getAccountNumber());

            if (existingAccount.isPresent()) {
                // update existing account
                Account updatedAccount = existingAccount.get();
                updatedAccount.setBalance(account.getBalance());
                updatedAccount.setAccountType(account.getAccountType());
                updatedAccount.setStatus(account.getStatus());
                updatedAccount.setLastUpdatedAt(LocalDateTime.now());
                updatedAccounts.add(accountRepository.save(updatedAccount));
            } else {
                // add new account
                account.setLastUpdatedAt(LocalDateTime.now());
                updatedAccounts.add(accountRepository.save(account));
            }
        }

        // Delete accounts are not in incoming list
        List<Account> allExistingAccounts = accountRepository.findAll();
        for (Account existingAccount : allExistingAccounts) {
            if (!incomingAccountNumbers.contains(existingAccount.getAccountNumber())) {
                accountRepository.delete(existingAccount);
            }
        }

        return updatedAccounts;
    }

}
