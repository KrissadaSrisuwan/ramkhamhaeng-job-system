package com.group2.studentjob.repository;

import com.group2.studentjob.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    // ค้นหา Student จาก User ID
    Optional<Student> findByUserUserId(Long userId);

    // ตรวจสอบรหัสนักศึกษาว่ามีอยู่แล้วหรือไม่
    boolean existsByStudentCode(String studentCode);
}