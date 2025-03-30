package com.transaction.service.repository;

import com.transaction.service.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {

    @Query("select a.status from Account a where a.accountNumber=?1")
    public String isValidAccount(String accountNumber);

    @Query("select a.balance from Account a where a.accountNumber=?1")
    public float isBalanceSufficient(String accountNumber);

    @Modifying
    @Query("update Account a set a.balance = a.balance + ?2 where a.accountNumber = ?1")
    public int updateBalanceAdd(String accountNumber, float balance);

    @Modifying
    @Query("update Account a set a.balance = a.balance - ?2 where a.accountNumber = ?1")
    public int updateBalanceSubtract(String accountNumber, float balance);

    Optional<Account> findByAccountNumber(String accountNumber);

    @Query("SELECT a FROM Account a WHERE a.accountNumber = :accountNumber")
    List<Account> findAllByAccountNumber(String accountNumber);
}
