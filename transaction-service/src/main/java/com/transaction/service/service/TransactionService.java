package com.transaction.service.service;

import com.transaction.service.controller.TransactionController;
import com.transaction.service.entity.Transaction;
import com.transaction.service.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    public List<Transaction> getTransactionsByFilters(String accountNumber, String transactionType) {
        return transactionRepository.getTransactionsByFilters(accountNumber,transactionType);
    }

    public Transaction saveTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public String hideTransactionById(int id,int isActive) {
        boolean isExisting = transactionRepository.existsById(id);
        if (isExisting) {transactionRepository.hideTransactionById(id,isActive);
            return "Transaction with id " + id + " was soft deleted";}
        return "Transaction with id " + id + " was not found";
    }

    public Transaction getTransactionById(int id) {
        Optional<Transaction> transaction = transactionRepository.findById(id);
        if(transaction.isPresent()) {return transaction.get();}
        return null;
    }

    public String updateTransactionStatusById(int id,String status) {
       int affectedRows = transactionRepository.updateTransactionStatusById(id,status);
       if(affectedRows == 1) {return "Transaction Status with id " + id + " was updated";}
       return "Transaction Status with id " + id + " was not found";
    }

    public String resetHiddenTransactions(String accountNumber,boolean resetHidden) {
        if (resetHidden) {
            int rows = transactionRepository.resetHiddenTransactions(accountNumber);
            if (rows == 1) {
                return rows+" Transactions are now visible";
            } else if (rows == 0) {
                return "No Trasnactions are hidden";
            }
        }
        throw new IllegalArgumentException("Invalid request: resetHidden must be true");
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
}
