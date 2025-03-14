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

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;
    @GetMapping(path = "/transactions")
    public List<Transaction> getAllTransactionsByAccountNumberAndType(
            @Validated @RequestParam String accountNumber,
            @Validated @RequestParam(required = false) String transactionType,
            @Validated @RequestParam(required = false) LocalDate createdAt) {
        return transactionService.getAllTransactionsByAccountNumberAndType(accountNumber, transactionType, createdAt);
    }

    @PostMapping(path = "/transactions")
    public Transaction saveTransaction(@Validated @RequestBody Transaction transaction) {
        return transactionService.saveTransaction(transaction);
    }

    @DeleteMapping(path = "/transactions/{id}")
    public String deleteTransactionById(@PathVariable int id) {
       return transactionService.softDeleteTransactionById(id,0);
    }

    //http://localhost:8081/transaction-service/transaction/1

    @GetMapping(path = "/transaction/{id}")
    public Transaction getTransactionById(@PathVariable int id) {
        return transactionService.getTransactionById(id);
    }

    @PatchMapping(path = "/transaction/{id}")
    public String updateTransactionStatusById(@Validated @PathVariable int id ,@RequestParam String transactionStatus){
        return transactionService.updateTransactionStatusById(id,transactionStatus);
    }

    @PatchMapping(path = "/transaction/reset-soft-delete")
    public String restSoftDeleteTransactions(){
        return transactionService.resetSoftDeletedTransactions();
    }

}
