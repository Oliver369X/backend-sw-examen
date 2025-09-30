package com.example.finaltest.repository;

import com.example.finaltest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    List<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByUsername(String username);
    boolean existsByUsername(String username);

}