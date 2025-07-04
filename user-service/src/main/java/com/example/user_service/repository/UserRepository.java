package com.example.user_service.repository;

import com.example.user_service.model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);


    @Query("select Count(u) from User u where u.username=?1 and u.password=?2")
    public int validateCredentials(String userName,String password);
}
