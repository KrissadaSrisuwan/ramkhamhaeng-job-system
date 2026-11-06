package com.group2.studentjob.service;

import com.group2.studentjob.dto.officer.JobVerificationRequest;
import com.group2.studentjob.dto.officer.JobVerificationResponse;
import com.group2.studentjob.entity.Job;
import com.group2.studentjob.entity.JobVerification;
import com.group2.studentjob.entity.UniversityOfficer;
import com.group2.studentjob.entity.enums.JobVerificationStatus;
import com.group2.studentjob.repository.JobRepository;
import com.group2.studentjob.repository.JobVerificationRepository;
import com.group2.studentjob.repository.UniversityOfficerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobVerificationService {

    private final JobRepository jobRepository;
    private final JobVerificationRepository jobVerificationRepository;
    private final UniversityOfficerRepository universityOfficerRepository;

    // ดึงประกาศงานทั้งหมด
    public List<JobVerificationResponse> getAllJobs() {

        return jobRepository.findAll().stream().map(this::mapToResponse).toList();
    }

    // ดึงประกาศงานจาก ID
    public JobVerificationResponse getJobById(Long jobId) {

        Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("ไม่พบประกาศงาน ID: " + jobId));

        return mapToResponse(job);
    }

    // ดึงประกาศงานตามสถานะการตรวจสอบ
    public List<JobVerificationResponse> getJobsByStatus(JobVerificationStatus status) {

        return jobRepository.findByVerificationStatus(status).stream().map(this::mapToResponse).toList();
    }

    // ตรวจสอบและอนุมัติหรือปฏิเสธประกาศงาน
    public JobVerificationResponse verifyJob(Long jobId, Long officerUserId, JobVerificationRequest request) {

        // ตรวจสอบข้อมูล Officer
        UniversityOfficer officer = universityOfficerRepository.findByUserUserId(officerUserId).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลเจ้าหน้าที่มหาวิทยาลัย"));

        // ตรวจสอบข้อมูล Job
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("ไม่พบประกาศงาน ID: " + jobId));

        // ตรวจสอบสถานะที่ส่งเข้ามา
        if (request == null || request.getStatus() == null || request.getStatus().trim().isEmpty()) {

            throw new RuntimeException("กรุณาระบุสถานะการตรวจสอบ");
        }

        JobVerificationStatus newStatus;

        try {
            newStatus = JobVerificationStatus.valueOf(request.getStatus().trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("สถานะการตรวจสอบ Job ไม่ถูกต้อง");
        }

        // Officer อนุมัติหรือปฏิเสธได้เท่านั้น
        if (newStatus != JobVerificationStatus.APPROVED && newStatus != JobVerificationStatus.REJECTED) {

            throw new RuntimeException("สามารถอนุมัติหรือปฏิเสธประกาศงานเท่านั้น");
        }

        // หากปฏิเสธ ต้องระบุเหตุผล
        if (newStatus == JobVerificationStatus.REJECTED) {

            if (request.getRemark() == null || request.getRemark().trim().isEmpty()) {

                throw new RuntimeException("กรุณาระบุเหตุผลที่ปฏิเสธประกาศงาน");
            }
        }

        // อัปเดตข้อมูลการตรวจสอบ Job
        job.setVerificationStatus(newStatus);
        job.setVerifiedBy(officer);
        job.setVerifiedAt(LocalDateTime.now());
        job.setVerificationRemark(request.getRemark());

        jobRepository.save(job);

        // บันทึกประวัติการตรวจสอบ
        JobVerification verification = new JobVerification();

        verification.setJob(job);
        verification.setOfficer(officer);
        verification.setStatus(newStatus);
        verification.setRemark(request.getRemark());
        verification.setVerifiedAt(LocalDateTime.now());

        jobVerificationRepository.save(verification);

        return mapToResponse(job);
    }

    // ดึงประวัติการตรวจสอบ Job
    public List<JobVerification> getVerificationHistory(Long jobId) {

        return jobVerificationRepository.findByJobJobIdOrderByVerifiedAtDesc(jobId);
    }

    // แปลงข้อมูล Job เป็น Response
    private JobVerificationResponse mapToResponse(Job job) {

        return new JobVerificationResponse(
                job.getJobId(),
                job.getEmployer().getEmployerId(),
                job.getEmployer().getCompanyName(),
                job.getCategory().getCategoryId(),
                job.getCategory().getCategoryName(),
                job.getJobTitle(),
                job.getDescription(),
                job.getLocation(),
                job.getSalary(),
                job.getQualification(),
                job.getJobDate(),
                job.getStartTime(),
                job.getEndTime(),
                job.getStatus().name(),
                job.getVerificationStatus().name(),
                job.getVerifiedBy() != null ? job.getVerifiedBy().getOfficerId() : null,
                job.getVerifiedAt(),
                job.getVerificationRemark());
    }
}