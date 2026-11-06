package com.group2.studentjob.service;

import com.group2.studentjob.dto.officer.EmployerVerificationRequest;
import com.group2.studentjob.dto.officer.EmployerVerificationResponse;
import com.group2.studentjob.entity.Employer;
import com.group2.studentjob.entity.EmployerVerification;
import com.group2.studentjob.entity.UniversityOfficer;
import com.group2.studentjob.entity.enums.EmployerVerificationStatus;
import com.group2.studentjob.repository.EmployerRepository;
import com.group2.studentjob.repository.EmployerVerificationRepository;
import com.group2.studentjob.repository.UniversityOfficerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployerVerificationService {

    private final EmployerRepository employerRepository;
    private final EmployerVerificationRepository employerVerificationRepository;
    private final UniversityOfficerRepository universityOfficerRepository;

    // ดึงข้อมูลผู้ประกอบการทั้งหมด
    public List<EmployerVerificationResponse> getAllEmployers() {

        return employerRepository.findAll().stream().map(this::mapToResponse).toList();
    }

    // ดึงข้อมูลผู้ประกอบการจาก ID
    public EmployerVerificationResponse getEmployerById(Long employerId) {

        Employer employer = employerRepository.findById(employerId).orElseThrow(() -> new RuntimeException("ไม่พบผู้ประกอบการ ID: " + employerId));

        return mapToResponse(employer);
    }

    // ดึงข้อมูลผู้ประกอบการตามสถานะการตรวจสอบ
    public List<EmployerVerificationResponse> getEmployersByStatus(EmployerVerificationStatus status) {

        return employerRepository.findByVerificationStatus(status).stream().map(this::mapToResponse).toList();
    }

    // ตรวจสอบและอนุมัติหรือปฏิเสธผู้ประกอบการ
    public EmployerVerificationResponse verifyEmployer(Long employerId, Long officerUserId, EmployerVerificationRequest request) {

        // ตรวจสอบข้อมูล Officer
        UniversityOfficer officer = universityOfficerRepository.findByUserUserId(officerUserId).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลเจ้าหน้าที่มหาวิทยาลัย"));

        // ตรวจสอบข้อมูล Employer
        Employer employer = employerRepository.findById(employerId).orElseThrow(() -> new RuntimeException("ไม่พบผู้ประกอบการ ID: " + employerId));

        // ตรวจสอบสถานะที่ส่งเข้ามา
        if (request == null || request.getStatus() == null || request.getStatus().trim().isEmpty()) {

            throw new RuntimeException("กรุณาระบุสถานะการตรวจสอบ");
        }

        EmployerVerificationStatus newStatus;

        try {
            newStatus = EmployerVerificationStatus.valueOf(request.getStatus().trim().toUpperCase());

        } catch (IllegalArgumentException e) {
            throw new RuntimeException("สถานะไม่ถูกต้อง");
        }

        // Officer สามารถอนุมัติหรือปฏิเสธได้เท่านั้น
        if (newStatus != EmployerVerificationStatus.APPROVED && newStatus != EmployerVerificationStatus.REJECTED) {

            throw new RuntimeException("สามารถอนุมัติหรือปฏิเสธผู้ประกอบการเท่านั้น");
        }

        // หากปฏิเสธ ต้องระบุเหตุผล
        if (newStatus == EmployerVerificationStatus.REJECTED) {

            if (request.getRemark() == null || request.getRemark().trim().isEmpty()) {

                throw new RuntimeException("กรุณาระบุเหตุผลที่ปฏิเสธ");
            }
        }

        // อัปเดตสถานะการตรวจสอบของ Employer
        employer.setVerificationStatus(newStatus);

        employerRepository.save(employer);

        // บันทึกประวัติการตรวจสอบ
        EmployerVerification verification = new EmployerVerification();

        verification.setEmployer(employer);
        verification.setOfficer(officer);
        verification.setStatus(newStatus);
        verification.setRemark(request.getRemark());
        verification.setVerifiedAt(LocalDateTime.now());

        employerVerificationRepository.save(verification);

        return mapToResponse(employer);
    }

    // ดึงประวัติการตรวจสอบผู้ประกอบการ
    public List<EmployerVerification> getVerificationHistory(Long employerId) {

        return employerVerificationRepository.findByEmployerEmployerIdOrderByVerifiedAtDesc(employerId);
    }

    // แปลงข้อมูล Employer เป็น Response
    private EmployerVerificationResponse mapToResponse(Employer employer) {

        return new EmployerVerificationResponse(
                employer.getEmployerId(),
                employer.getUser().getUserId(),
                employer.getCompanyName(),
                employer.getContactName(),
                employer.getPhone(),
                employer.getEmail(),
                employer.getAddress(),
                employer.getCompanyDescription(),
                employer.getVerificationStatus().name(),
                employer.getVerifiedBy() != null ? employer.getVerifiedBy().getOfficerId() : null,
                employer.getVerifiedAt());
    }
}