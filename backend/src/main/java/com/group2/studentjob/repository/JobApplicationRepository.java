package com.group2.studentjob.repository;

import com.group2.studentjob.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    // ตรวจสอบว่านักศึกษาเคยสมัครงานนี้แล้วหรือไม่
    Optional<JobApplication> findByJobJobIdAndStudentStudentId(Long jobId, Long studentId);

    // ดึงใบสมัครทั้งหมดของนักศึกษา
    List<JobApplication> findByStudentStudentIdOrderByAppliedAtDesc(Long studentId);

    // ดึงใบสมัครของงานที่เป็นของ Employer
    List<JobApplication> findByJobJobIdAndJobEmployerEmployerIdOrderByAppliedAtDesc(Long jobId, Long employerId);

    // ตรวจสอบว่าใบสมัครเป็นของงานของ Employer คนนี้หรือไม่
    Optional<JobApplication> findByApplicationIdAndJobEmployerEmployerId(Long applicationId, Long employerId);
}