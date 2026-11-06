package com.group2.studentjob.service;

import com.group2.studentjob.dto.employer.ApplicationReviewRequest;
import com.group2.studentjob.dto.employer.EmployerApplicationResponse;
import com.group2.studentjob.dto.employer.StudentApplicantResponse;
import com.group2.studentjob.entity.Employer;
import com.group2.studentjob.entity.JobApplication;
import com.group2.studentjob.entity.Student;
import com.group2.studentjob.entity.enums.ApplicationStatus;
import com.group2.studentjob.repository.EmployerRepository;
import com.group2.studentjob.repository.JobApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployerApplicationService {

    private final EmployerRepository employerRepository;
    private final JobApplicationRepository jobApplicationRepository;

    // ดึงรายการใบสมัครของงาน
    public List<EmployerApplicationResponse> getApplications(Long employerUserId, Long jobId) {

        Employer employer = getEmployer(employerUserId);

        return jobApplicationRepository.findByJobJobIdAndJobEmployerEmployerIdOrderByAppliedAtDesc(jobId, employer.getEmployerId()).stream().map(this::mapToApplicationResponse).toList();
    }

    // ดึงข้อมูลผู้สมัคร
    public StudentApplicantResponse getApplicant(Long employerUserId, Long applicationId) {

        Employer employer = getEmployer(employerUserId);

        JobApplication application = jobApplicationRepository.findByApplicationIdAndJobEmployerEmployerId(applicationId, employer.getEmployerId()).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลใบสมัคร"));

        Student student = application.getStudent();

        return mapToStudentResponse(student);
    }

    // พิจารณาใบสมัครและอนุมัติหรือปฏิเสธ
    @Transactional
    public EmployerApplicationResponse reviewApplication(Long employerUserId, Long applicationId, ApplicationReviewRequest request) {

        Employer employer = getEmployer(employerUserId);

        JobApplication application = jobApplicationRepository.findByApplicationIdAndJobEmployerEmployerId(applicationId, employer.getEmployerId()).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลใบสมัคร"));

        // ตรวจสอบ Status
        if (request.getStatus() == null || request.getStatus().trim().isEmpty()) {

            throw new RuntimeException("กรุณาระบุสถานะการสมัคร");
        }

        ApplicationStatus newStatus;

        try {

            newStatus = ApplicationStatus.valueOf(request.getStatus().trim().toUpperCase());

        } catch (IllegalArgumentException e) {

            throw new RuntimeException("สถานะต้องเป็น ACCEPTED หรือ REJECTED");
        }

        // อนุญาตเฉพาะ ACCEPTED / REJECTED
        if (newStatus != ApplicationStatus.ACCEPTED && newStatus != ApplicationStatus.REJECTED) {

            throw new RuntimeException("สามารถเปลี่ยนสถานะเป็น ACCEPTED หรือ REJECTED เท่านั้น");
        }

        // ตรวจสอบใบสมัครที่จัดการไปแล้ว
        if (application.getStatus() != ApplicationStatus.PENDING) {

            throw new RuntimeException("ใบสมัครนี้ได้รับการพิจารณาแล้ว");
        }

        // REJECT ต้องมีหมายเหตุ
        if (newStatus == ApplicationStatus.REJECTED && (request.getEmployerRemark() == null || request.getEmployerRemark().trim().isEmpty())) {

            throw new RuntimeException("กรุณาระบุเหตุผลในการปฏิเสธ");
        }

        application.setStatus(newStatus);
        application.setReviewedAt(LocalDateTime.now());
        application.setEmployerRemark(request.getEmployerRemark());

        JobApplication saved = jobApplicationRepository.save(application);

        return mapToApplicationResponse(saved);
    }

    // ค้นหา Employer จาก User ID
    private Employer getEmployer(Long userId) {

        return employerRepository.findByUserUserId(userId).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลผู้ประกอบการ"));
    }

    // แปลงข้อมูล JobApplication เป็น Response
    private EmployerApplicationResponse mapToApplicationResponse(JobApplication application) {

        Student student = application.getStudent();

        return new EmployerApplicationResponse(
                application.getApplicationId(),
                application.getJob().getJobId(),
                application.getJob().getJobTitle(),
                student.getStudentId(),
                student.getStudentCode(),
                student.getFirstName(),
                student.getLastName(),
                student.getProfileImage(),
                application.getStatus().name(),
                application.getAppliedAt(),
                application.getReviewedAt(),
                application.getEmployerRemark()
        );
    }

    // แปลงข้อมูล Student เป็น Response
    private StudentApplicantResponse mapToStudentResponse(Student student) {

        return new StudentApplicantResponse(
                student.getStudentId(),
                student.getStudentCode(),
                student.getFirstName(),
                student.getLastName(),
                student.getPhone(),
                student.getEmail(),
                student.getFaculty(),
                student.getMajor(),
                student.getYearOfStudy(),
                student.getProfileImage()
        );
    }
}