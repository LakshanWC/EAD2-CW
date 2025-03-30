package com.transaction.service.controller;

import com.netflix.discovery.EurekaNamespace;
import com.transaction.service.entity.Transaction;
import com.transaction.service.repository.TransactionRepository;
import com.transaction.service.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@RestController
//@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("transactions")
public class TransactionController {

    private static final Logger log = LoggerFactory.getLogger(TransactionController.class);

    //to filter out the recodes
    @Autowired
    private TransactionService transactionService;


    @GetMapping
    public List<Transaction> getTransactionsByFilters(
            @Validated @RequestParam(required = false)String accountNumber,
            @Validated @RequestParam(required = false) String transactionType){
        return transactionService.getTransactionsByFilters(accountNumber, transactionType);
    }

    //save the hole recode
    @PostMapping
    public Transaction saveTransaction(@Validated @RequestBody Transaction transaction) {
        return transactionService.saveTransaction(transaction);
    }

    /*
    //mark as hidden in the column in  the given recode by the id
    @PatchMapping(path = "{id}")
    public String hideTransactionById(@PathVariable int id) {
       return transactionService.hideTransactionById(id,0);
    }*/

    //get a transaction recode by the id
    @GetMapping(path = "/{id}")
    public Transaction getTransactionById(@PathVariable int id) {
        return transactionService.getTransactionById(id);
    }

    //this will update transactoinStatus only from a given id
    @PatchMapping(path = "/{id}")
    public String updateTransactionStatusById(@Validated @PathVariable int id ,@RequestParam String transactionStatus){
        return transactionService.updateTransactionStatusById(id,transactionStatus);
    }

    @PatchMapping(path = {"{accountNumber}"}, params = "resetHidden")
    public String resetHiddenTransactions(@PathVariable String accountNumber,@RequestParam boolean resetHidden) {
        return transactionService.resetHiddenTransactions(accountNumber,resetHidden);
    }


    @GetMapping( "/health")
    public ResponseEntity<String> checkHealth(){
        log.info("Health check received at transaction-service");
        return ResponseEntity.ok("Health check OK");}
}
