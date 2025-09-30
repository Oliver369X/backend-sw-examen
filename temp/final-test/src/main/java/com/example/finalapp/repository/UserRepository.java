package com.example.finalapp.repository;

import com.example.finalapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    List<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByUsername(String username);
    boolean existsByUsername(String username);

}

