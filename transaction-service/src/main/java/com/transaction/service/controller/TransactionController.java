package com.transaction.service.controller;

import com.transaction.service.entity.Transaction;
import com.transaction.service.repository.TransactionRepository;
import com.transaction.service.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Service
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping(path = "/transactions",params ={"accountNumber","transactionType","createdAt"} )
    public List<Transaction> getAllTransactionsByAccountNumberAndType
            (@RequestParam String accountNumber,
             @RequestParam (required = false) String transactionType,
             @RequestParam(required = false) LocalDate createdAt) {
        return transactionService.getAllTransactionsByAccountNumberAndType(accountNumber, transactionType, createdAt);
    }

    @PostMapping(path = "/transactions")
    public Transaction addTransaction(@Validated @RequestBody Transaction transaction) {
        return transactionService.addTransaction(transaction);
    }

    @DeleteMapping(path = "/transactions/{id}")
    public String deleteTransactionById(@PathVariable int id) {
       return transactionService.deleteTransactionById(id);
    }

    @GetMapping(path = "/Transaction/{id}")
    public Transaction getTransactionById(@PathVariable int id) {
        return transactionService.getTransactionById(id);
    }

    @PatchMapping(path = "/Transaction/{id}")
    public String updateTransactionStatusById(@PathVariable int id ,@RequestParam String transactionStatus){
        return transactionService.updateTransactionStatusById(id,transactionStatus);
    }




}
