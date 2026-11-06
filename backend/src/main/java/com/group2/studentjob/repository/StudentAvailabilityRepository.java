package com.group2.studentjob.repository;

import com.group2.studentjob.entity.StudentAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface StudentAvailabilityRepository extends JpaRepository<StudentAvailability, Long> {

    // ค้นหาเวลาว่างของ Student จาก Student ID
    List<StudentAvailability> findByStudentStudentId(Long studentId);

    // ค้นหาเวลาว่างจาก Availability ID และ Student ID
    Optional<StudentAvailability> findByAvailabilityIdAndStudentStudentId(Long availabilityId, Long studentId);

    // ค้นหาเฉพาะรายการเวลาว่างที่เปิดใช้งานของนักศึกษาจาก Student ID
    List<StudentAvailability> findByStudentStudentIdAndIsAvailableTrue(Long studentId);
}