package com.group2.studentjob.repository;

import com.group2.studentjob.entity.Employer;
import com.group2.studentjob.entity.enums.EmployerVerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface EmployerRepository extends JpaRepository<Employer, Long> {

    // ค้นหา Employer จาก User ID
    Optional<Employer> findByUserUserId(Long userId);

    // ค้นหา Employer จาก Email
    Optional<Employer> findByEmail(String email);

    // ค้นหา Employer ตามสถานะการตรวจสอบ
    List<Employer> findByVerificationStatus(EmployerVerificationStatus status);
}