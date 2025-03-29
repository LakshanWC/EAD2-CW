package com.transaction.service.controller;

import com.transaction.service.entity.Account;
import com.transaction.service.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
//@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @GetMapping(path = "/{accountNumber}")
    public String isValidAccount(@PathVariable("accountNumber") String accountNumber) {
        return accountService.isValidAccount(accountNumber);
    }

    @GetMapping(path = {"/{accountNumber}/balance"},params = {"amount"})
    public String isBalanceSufficient(@PathVariable("accountNumber") String accountNumber,
                                      @RequestParam(value = "amount") float amount) {
        return accountService.isBalanceSufficient(accountNumber,amount);
    }
    
    //http://localhost:8085/transaction-service/accounts/ACCT1234567890123456?amount=550&addAmount=true

    @PatchMapping(path = {"/{accountNumber}"},params = {"amount","addAmount"})
    public String updateBalanceAdd(@PathVariable String accountNumber,
                                @RequestParam(value = "amount") float amount,
                                @RequestParam boolean addAmount) {
        return accountService.updateBalanceAdd(accountNumber,amount,addAmount);
    }

    //http://localhost:8085/transaction-service/accounts/batch
    @PatchMapping(path = "/batch")
    public ResponseEntity updateAccountData(@RequestBody List<Account> accounts) {
        List<Account> updatedAccounts = accountService.updateOrAddAccounts(accounts);
        return ResponseEntity.ok(updatedAccounts);
    }
}
