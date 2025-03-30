package com.transaction.service.repository;

import com.transaction.service.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;


@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {

    @Query("SELECT t FROM Transaction t WHERE t.accountNumber=?1 " +
            "AND (?2 is NULL OR t.transactionType = ?2) " +
            "AND t.isActive=1")
    public List<Transaction> getTransactionsByFilters(String accountNumber,String transactionType);


    @Modifying
    @Query("UPDATE Transaction t SET t.status=?2 WHERE t.transactionId =?1")
    public int updateTransactionStatusById(int id, String status);

    @Query("select t from Transaction t where t.status=?1")
    public List<Transaction> getTransactionsByStatus(String status);

    @Modifying
    @Query("UPDATE Transaction t SET t.isActive=?2 WHERE t.transactionId=?1")
    public int hideTransactionById(int id,int is_active);

    @Modifying
    @Query("UPDATE Transaction t SET t.isActive=1 WHERE t.isActive=0 AND t.accountNumber=?1")
    public int resetHiddenTransactions(String accountNumber);
}
