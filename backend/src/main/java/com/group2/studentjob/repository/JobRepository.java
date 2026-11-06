package com.group2.studentjob.repository;

import com.group2.studentjob.entity.Job;
import com.group2.studentjob.entity.enums.JobStatus;
import com.group2.studentjob.entity.enums.JobVerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface JobRepository extends JpaRepository<Job, Long> {

    // ดึงงานของผู้ประกอบการ
    List<Job> findByEmployerEmployerId(Long employerId);

    // ดึงงานของผู้ประกอบการตาม JobID
    Optional<Job> findByJobIdAndEmployerEmployerId(Long jobId, Long employerId);

    // ดึงงานตาม Verification Status
    List<Job> findByVerificationStatus(JobVerificationStatus verificationStatus);

    // ดึงงานที่เปิดรับสมัครและผ่านการตรวจสอบ
    List<Job> findByStatusAndVerificationStatus(JobStatus status, JobVerificationStatus verificationStatus);

    // ค้นหางานตามชื่อ โดยไม่สนใจตัวพิมพ์เล็ก/ใหญ่
    List<Job> findByJobTitleContainingIgnoreCaseAndStatusAndVerificationStatus(String jobTitle, JobStatus status, JobVerificationStatus verificationStatus);
}