package com.group2.studentjob.service;

import com.group2.studentjob.dto.employer.JobRequest;
import com.group2.studentjob.dto.employer.JobResponse;
import com.group2.studentjob.entity.Category;
import com.group2.studentjob.entity.Employer;
import com.group2.studentjob.entity.Job;
import com.group2.studentjob.entity.enums.EmployerVerificationStatus;
import com.group2.studentjob.entity.enums.JobStatus;
import com.group2.studentjob.entity.enums.JobVerificationStatus;
import com.group2.studentjob.repository.CategoryRepository;
import com.group2.studentjob.repository.EmployerRepository;
import com.group2.studentjob.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

// บริการจัดการประกาศงานสำหรับผู้ประกอบการ
@Service
@RequiredArgsConstructor
public class EmployerJobService {

    private final JobRepository jobRepository;
    private final EmployerRepository employerRepository;
    private final CategoryRepository categoryRepository;

    // ดึงรายการงานของผู้ประกอบการทั้งหมด
    public List<JobResponse> getMyJobs(Long userId) {

        Employer employer = getEmployer(userId);

        return jobRepository.findByEmployerEmployerId(employer.getEmployerId()).stream().map(this::mapToResponse).toList();
    }

    // สร้างประกาศงานใหม่ (ต้องผ่านการอนุมัติการยืนยันตัวตนตามเงื่อนไข FR-03, FR-04)
    public JobResponse createJob(Long userId, JobRequest request) {

        Employer employer = getEmployer(userId);

        // ตรวจสอบการยืนยันตัวตนของผู้ประกอบการก่อนอนุญาตให้ประกาศงาน
        if (employer.getVerificationStatus() != EmployerVerificationStatus.APPROVED) {
            throw new RuntimeException("ผู้ประกอบการต้องผ่านการยืนยันตัวตนจากเจ้าหน้าที่มหาวิทยาลัยก่อน จึงจะสามารถประกาศงานได้");
        }

        Category category = categoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new RuntimeException("ไม่พบหมวดหมู่"));

        validateJob(request);

        Job job = new Job();

        job.setEmployer(employer);
        job.setCategory(category);
        job.setJobTitle(request.getJobTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setSalary(request.getSalary());
        job.setQualification(request.getQualification());
        job.setJobDate(request.getJobDate());
        job.setStartTime(request.getStartTime());
        job.setEndTime(request.getEndTime());

        // กำหนดสถานะเริ่มต้นของงานเป็นแบบร่าง
        job.setStatus(JobStatus.DRAFT);

        // ส่งงานให้ Officer ตรวจสอบความถูกต้อง
        job.setVerificationStatus(JobVerificationStatus.PENDING);

        Job saved = jobRepository.save(job);

        return mapToResponse(saved);
    }

    // แก้ไขข้อมูลประกาศงาน
    public JobResponse updateJob(Long userId, Long jobId, JobRequest request) {

        Employer employer = getEmployer(userId);

        Job job = jobRepository.findByJobIdAndEmployerEmployerId(jobId, employer.getEmployerId()).orElseThrow(() -> new RuntimeException("ไม่พบงาน"));

        Category category = categoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new RuntimeException("ไม่พบหมวดหมู่"));

        validateJob(request);

        job.setCategory(category);
        job.setJobTitle(request.getJobTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setSalary(request.getSalary());
        job.setQualification(request.getQualification());
        job.setJobDate(request.getJobDate());
        job.setStartTime(request.getStartTime());
        job.setEndTime(request.getEndTime());

        // หากงานถูกปฏิเสธ หลังแก้ไขต้องส่งตรวจสอบใหม่
        if (job.getVerificationStatus() == JobVerificationStatus.REJECTED) {

            job.setVerificationStatus(JobVerificationStatus.PENDING);
            job.setVerificationRemark(null);
            job.setVerifiedBy(null);
            job.setVerifiedAt(null);
            job.setStatus(JobStatus.DRAFT);
        }

        // หากแก้ไขงานที่ผ่านการตรวจสอบแล้ว ต้องส่งตรวจสอบใหม่
        else if (job.getVerificationStatus() == JobVerificationStatus.APPROVED) {

            job.setVerificationStatus(JobVerificationStatus.PENDING);
            job.setVerificationRemark(null);
            job.setVerifiedBy(null);
            job.setVerifiedAt(null);
            job.setStatus(JobStatus.DRAFT);
        }

        Job saved = jobRepository.save(job);

        return mapToResponse(saved);
    }

    // เปิดรับสมัครงาน (ต้องได้รับการอนุมัติจากเจ้าหน้าที่ก่อน)
    public JobResponse openJob(Long userId, Long jobId) {

        Employer employer = getEmployer(userId);

        Job job = jobRepository.findByJobIdAndEmployerEmployerId(jobId, employer.getEmployerId()).orElseThrow(() -> new RuntimeException("ไม่พบงาน"));

        // งานต้องผ่านการตรวจสอบจาก Officer ก่อน
        if (job.getVerificationStatus() != JobVerificationStatus.APPROVED) {
            throw new RuntimeException("งานต้องได้รับการอนุมัติจากเจ้าหน้าที่ก่อนเริ่มดำเนินการ");
        }

        job.setStatus(JobStatus.OPEN);

        Job saved = jobRepository.save(job);

        return mapToResponse(saved);
    }

    // ปิดรับสมัครงาน
    public JobResponse closeJob(Long userId, Long jobId) {

        Employer employer = getEmployer(userId);

        Job job = jobRepository.findByJobIdAndEmployerEmployerId(jobId, employer.getEmployerId()).orElseThrow(() -> new RuntimeException("ไม่พบงาน"));

        job.setStatus(JobStatus.CLOSED);

        Job saved = jobRepository.save(job);

        return mapToResponse(saved);
    }

    // ลบประกาศงาน
    public void deleteJob(Long userId, Long jobId) {

        Employer employer = getEmployer(userId);

        Job job = jobRepository.findByJobIdAndEmployerEmployerId(jobId, employer.getEmployerId()).orElseThrow(() -> new RuntimeException("ไม่พบงาน"));

        jobRepository.delete(job);
    }

    // ค้นหาข้อมูลผู้ประกอบการจาก User ID
    private Employer getEmployer(Long userId) {

        return employerRepository.findByUserUserId(userId).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลผู้ประกอบการ"));
    }

    // ตรวจสอบความถูกต้องของข้อมูลประกาศงาน
    private void validateJob(JobRequest request) {

        if (request.getCategoryId() == null) {
            throw new RuntimeException("จำเป็นต้องระบุหมวดหมู่");
        }

        if (request.getJobTitle() == null || request.getJobTitle().isBlank()) {

            throw new RuntimeException("จำเป็นต้องระบุชื่อตำแหน่งงาน");
        }

        if (request.getDescription() == null || request.getDescription().isBlank()) {

            throw new RuntimeException("จำเป็นต้องระบุคำอธิบาย");
        }

        // ตรวจสอบว่าเวลาเริ่มต้นต้องมาก่อนเวลาสิ้นสุด
        if (request.getStartTime() != null && request.getEndTime() != null && !request.getStartTime().isBefore(request.getEndTime())) {

            throw new RuntimeException("เวลาเริ่มต้นต้องมาก่อนเวลาสิ้นสุด");
        }
    }

    // แปลงข้อมูล Job เป็น Response DTO
    private JobResponse mapToResponse(Job job) {

        return new JobResponse(
                job.getJobId(),
                job.getEmployer().getEmployerId(),
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
                job.getVerificationRemark());
    }
}
