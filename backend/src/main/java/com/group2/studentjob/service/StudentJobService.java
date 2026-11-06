package com.group2.studentjob.service;

import com.group2.studentjob.dto.student.JobApplicationResponse;
import com.group2.studentjob.dto.student.StudentJobResponse;
import com.group2.studentjob.entity.Job;
import com.group2.studentjob.entity.JobApplication;
import com.group2.studentjob.entity.Student;
import com.group2.studentjob.entity.StudentAvailability;
import com.group2.studentjob.entity.enums.ApplicationStatus;
import com.group2.studentjob.entity.enums.DayOfWeek;
import com.group2.studentjob.entity.enums.JobStatus;
import com.group2.studentjob.entity.enums.JobVerificationStatus;
import com.group2.studentjob.repository.JobApplicationRepository;
import com.group2.studentjob.repository.JobRepository;
import com.group2.studentjob.repository.StudentAvailabilityRepository;
import com.group2.studentjob.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

// บริการค้นหาและสมัครงานพาร์ตไทม์สำหรับนักศึกษา
@Service
@RequiredArgsConstructor
public class StudentJobService {

    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;
    private final StudentAvailabilityRepository availabilityRepository;
    private final JobApplicationRepository jobApplicationRepository;

    // ค้นหางานแบบพื้นฐานตามชื่อและเวลาว่าง (Backward Compatibility)
    public List<StudentJobResponse> searchJobs(Long userId, String title, boolean filterByAvailability) {
        return searchJobs(userId, title, null, null, filterByAvailability);
    }

    // ค้นหาและกรองงานตามชื่อ หมวดหมู่ พื้นที่บริเวณ ม.รามคำแหง และเวลาว่าง (FR-02, NFR-01)
    public List<StudentJobResponse> searchJobs(Long userId, String title, Long categoryId, String location, boolean filterByAvailability) {

        // ตรวจสอบและค้นหาข้อมูล Student จาก User ID
        Student student = studentRepository.findByUserUserId(userId)
                .orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลนักศึกษา"));

        // ค้นหางานทั้งหมดที่เปิดรับสมัครและผ่านการอนุมัติ
        List<Job> jobs = jobRepository.findByStatusAndVerificationStatus(JobStatus.OPEN, JobVerificationStatus.APPROVED);

        // กรองตามคำค้นหาชื่องานหรือคำอธิบาย
        if (title != null && !title.trim().isEmpty()) {
            String query = title.trim().toLowerCase();
            jobs = jobs.stream()
                    .filter(job -> (job.getJobTitle() != null && job.getJobTitle().toLowerCase().contains(query))
                            || (job.getDescription() != null && job.getDescription().toLowerCase().contains(query))
                            || (job.getEmployer() != null && job.getEmployer().getCompanyName() != null && job.getEmployer().getCompanyName().toLowerCase().contains(query)))
                    .toList();
        }

        // กรองตามหมวดหมู่งาน
        if (categoryId != null) {
            jobs = jobs.stream()
                    .filter(job -> job.getCategory() != null && job.getCategory().getCategoryId().equals(categoryId))
                    .toList();
        }

        // กรองตามสถานที่/พื้นที่ เช่น บริเวณ ม.รามคำแหง หัวหมาก หรือ บางนา
        if (location != null && !location.trim().isEmpty() && !location.equalsIgnoreCase("ALL")) {
            String locQuery = location.trim().toLowerCase();
            jobs = jobs.stream()
                    .filter(job -> job.getLocation() != null && job.getLocation().toLowerCase().contains(locQuery))
                    .toList();
        }

        // ตรวจสอบว่าต้องการกรองเฉพาะงานที่ตรงกับช่วงเวลาว่างหรือไม่
        if (filterByAvailability) {
            List<StudentAvailability> availabilities = availabilityRepository.findByStudentStudentIdAndIsAvailableTrue(student.getStudentId());
            jobs = jobs.stream().filter(job -> isJobAvailable(job, availabilities)).toList();
        }

        // แปลงข้อมูล Job เป็น StudentJobResponse
        return jobs.stream().map(job -> mapToJobResponse(job, null)).toList();
    }

    // ดึงรายละเอียดงานจาก Job ID พร้อมสถานะการสมัครของนักศึกษา
    public StudentJobResponse getJobDetail(Long userId, Long jobId) {

        // ตรวจสอบและค้นหาข้อมูล Student จาก User ID
        Student student = studentRepository.findByUserUserId(userId)
                .orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลนักศึกษา"));

        // ค้นหาข้อมูลงานจาก Job ID
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลงาน"));

        // นักศึกษาสามารถดูได้เฉพาะงานที่เปิดและผ่านการอนุมัติแล้ว
        if (job.getStatus() != JobStatus.OPEN || job.getVerificationStatus() != JobVerificationStatus.APPROVED) {
            throw new RuntimeException("ไม่สามารถดูงานนี้ได้ เนื่องจากงานยังไม่เปิดรับสมัครหรือยังไม่ผ่านการอนุมัติ");
        }

        // ตรวจสอบว่านักศึกษาเคยสมัครงานนี้แล้วหรือไม่
        String applicationStatus = jobApplicationRepository.findByJobJobIdAndStudentStudentId(jobId, student.getStudentId())
                .map(application -> application.getStatus().name())
                .orElse(null);

        return mapToJobResponse(job, applicationStatus);
    }

    // ดำเนินการสมัครงานพร้อมตรวจสอบเงื่อนไขเวลาว่างและการสมัครซ้ำ
    @Transactional
    public JobApplicationResponse applyJob(Long userId, Long jobId) {

        // ตรวจสอบและค้นหาข้อมูล Student
        Student student = studentRepository.findByUserUserId(userId)
                .orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลนักศึกษา"));

        // ค้นหาข้อมูลงาน
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลงาน"));

        // ตรวจสอบสถานะการเปิดรับสมัครงาน
        if (job.getStatus() != JobStatus.OPEN) {
            throw new RuntimeException("งานนี้ปิดรับสมัครแล้ว");
        }

        // ตรวจสอบว่างานผ่านการอนุมัติจาก Officer แล้วหรือไม่
        if (job.getVerificationStatus() != JobVerificationStatus.APPROVED) {
            throw new RuntimeException("งานนี้ยังไม่ได้รับการอนุมัติจากเจ้าหน้าที่มหาวิทยาลัย");
        }

        // ป้องกันการสมัครซ้ำในงานเดียวกัน
        if (jobApplicationRepository.findByJobJobIdAndStudentStudentId(jobId, student.getStudentId()).isPresent()) {
            throw new RuntimeException("คุณเคยสมัครงานนี้แล้ว");
        }

        // ตรวจสอบช่วงเวลาว่างที่ลงทะเบียนไว้
        List<StudentAvailability> availabilities = availabilityRepository.findByStudentStudentIdAndIsAvailableTrue(student.getStudentId());

        if (availabilities.isEmpty()) {
            throw new RuntimeException("กรุณาระบุช่วงเวลาว่างของคุณในเมนู 'จัดการช่วงเวลาว่าง' ก่อนสมัครงาน เพื่อให้ระบบตรวจสอบความพร้อมในการทำงาน");
        }

        if (!isJobAvailable(job, availabilities)) {
            throw new RuntimeException("ช่วงเวลาของงาน (" + (job.getStartTime() != null ? job.getStartTime() : "") + " - " + (job.getEndTime() != null ? job.getEndTime() : "") + ") ไม่ตรงกับช่วงเวลาว่างที่คุณลงทะเบียนไว้");
        }

        // สร้างข้อมูลใบสมัครงานใหม่
        JobApplication application = new JobApplication();
        application.setJob(job);
        application.setStudent(student);
        application.setStatus(ApplicationStatus.PENDING);
        application.setAppliedAt(LocalDateTime.now());

        JobApplication saved = jobApplicationRepository.save(application);
        return mapToApplicationResponse(saved);
    }

    // ดึงรายการงานที่นักศึกษาคนปัจจุบันเคยสมัครไว้ทั้งหมด
    public List<JobApplicationResponse> getMyApplications(Long userId) {

        Student student = studentRepository.findByUserUserId(userId)
                .orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลนักศึกษา"));

        return jobApplicationRepository.findByStudentStudentIdOrderByAppliedAtDesc(student.getStudentId())
                .stream()
                .map(this::mapToApplicationResponse)
                .toList();
    }

    // ตรวจสอบว่าช่วงเวลาของงานตรงกับช่วงเวลาว่างที่นักศึกษาลงทะเบียนไว้หรือไม่
    public boolean isJobAvailable(Job job, List<StudentAvailability> availabilities) {

        if (job.getJobDate() == null || job.getStartTime() == null || job.getEndTime() == null) {
            return false;
        }

        LocalDate jobDate = job.getJobDate();
        java.time.DayOfWeek javaDay = jobDate.getDayOfWeek();
        DayOfWeek customDay = DayOfWeek.valueOf(javaDay.name());

        LocalTime jobStart = job.getStartTime();
        LocalTime jobEnd = job.getEndTime();

        return availabilities.stream().anyMatch(availability ->
                availability.getDayOfWeek() == customDay
                        && !availability.getStartTime().isAfter(jobStart)
                        && !availability.getEndTime().isBefore(jobEnd));
    }

    // แปลงข้อมูล Job Entity เป็น StudentJobResponse DTO
    private StudentJobResponse mapToJobResponse(Job job, String applicationStatus) {

        return new StudentJobResponse(
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
                applicationStatus);
    }

    // แปลงข้อมูล JobApplication Entity เป็น JobApplicationResponse DTO
    private JobApplicationResponse mapToApplicationResponse(JobApplication application) {

        Job job = application.getJob();

        return new JobApplicationResponse(
                application.getApplicationId(),
                job.getJobId(),
                job.getJobTitle(),
                job.getEmployer().getCompanyName(),
                application.getStatus().name(),
                application.getAppliedAt(),
                application.getReviewedAt(),
                application.getEmployerRemark());
    }
}
