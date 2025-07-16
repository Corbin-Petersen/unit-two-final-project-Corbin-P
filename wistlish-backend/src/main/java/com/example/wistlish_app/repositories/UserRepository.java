package com.example.wistlish_app.repositories;

import com.example.wistlish_app.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {

}
