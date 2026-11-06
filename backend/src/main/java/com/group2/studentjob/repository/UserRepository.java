package com.group2.studentjob.repository;

import com.group2.studentjob.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // ค้นหา User จาก Username
    Optional<User> findByUsername(String username);

    // ตรวจสอบ Username ว่ามีอยู่แล้วหรือไม่
    boolean existsByUsername(String username);
}