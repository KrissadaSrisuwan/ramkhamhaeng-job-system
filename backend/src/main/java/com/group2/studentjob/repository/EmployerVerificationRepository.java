package com.group2.studentjob.repository;

import com.group2.studentjob.entity.EmployerVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EmployerVerificationRepository extends JpaRepository<EmployerVerification, Long> {

    // ค้นหาประวัติการตรวจสอบของ Employer
    List<EmployerVerification> findByEmployerEmployerIdOrderByVerifiedAtDesc(Long employerId);
}