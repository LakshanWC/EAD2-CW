package com.transaction.service.repository;

import com.transaction.service.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {

    @Query("select t from Transaction t where t.accountNumber=?1 " +
            "and (?2 is NULL OR t.transactionType=?2) and(?3 is NULL OR t.createdAt=?3)")
    public List<Transaction> getAllTransactionsByAccountNumberAndType(String accountNumber,String transactionType,LocalDate createdAt);


    @Query("update Transaction t set t.status=?2 where t.transactionId =?1")
    public int updateTransactionStatusById(int id, String status);
}
