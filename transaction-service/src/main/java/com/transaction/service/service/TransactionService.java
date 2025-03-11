package com.transaction.service.service;

import com.transaction.service.controller.TransactionController;
import com.transaction.service.entity.Transaction;
import com.transaction.service.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    public List<Transaction> getAllTransactionsByAccountNumberAndType(String accountNumber, String transactionType, LocalDate createdAt) {
        return transactionRepository.getAllTransactionsByAccountNumberAndType(accountNumber,transactionType,createdAt);
    }

    public Transaction addTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public String deleteTransactionById(int id) {
        boolean isExisting = transactionRepository.existsById(id);
        if (isExisting) {transactionRepository.deleteById(id) ;return "Transaction with id " + id + " was deleted";}
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
}
