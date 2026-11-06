package com.group2.studentjob.repository;

import com.group2.studentjob.entity.JobVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobVerificationRepository extends JpaRepository<JobVerification, Long> {

    // ค้นหาประวัติการตรวจสอบงาน
    List<JobVerification> findByJobJobIdOrderByVerifiedAtDesc(Long jobId);
}