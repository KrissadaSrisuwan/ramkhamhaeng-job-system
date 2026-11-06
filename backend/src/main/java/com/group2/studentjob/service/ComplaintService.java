package com.group2.studentjob.service;

import com.group2.studentjob.dto.complaint.ComplaintRequest;
import com.group2.studentjob.dto.complaint.ComplaintResponse;
import com.group2.studentjob.dto.complaint.ComplaintStatusRequest;
import com.group2.studentjob.entity.*;
import com.group2.studentjob.entity.enums.ComplaintStatus;
import com.group2.studentjob.entity.enums.UserRole;
import com.group2.studentjob.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// บริการจัดการเรื่องร้องเรียนและรายงานความไม่ปลอดภัย
@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final EmployerRepository employerRepository;
    private final UniversityOfficerRepository officerRepository;
    private final JobRepository jobRepository;

    // ส่งเรื่องร้องเรียนใหม่เข้าสู่ระบบ
    @Transactional
    public ComplaintResponse createComplaint(Long userId, ComplaintRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลผู้ใช้งาน"));

        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new RuntimeException("กรุณาระบุหัวข้อเรื่องร้องเรียน");
        }
        if (request.getDescription() == null || request.getDescription().trim().isEmpty()) {
            throw new RuntimeException("กรุณาระบุรายละเอียดเรื่องร้องเรียน");
        }

        Job job = null;
        if (request.getJobId() != null) {
            job = jobRepository.findById(request.getJobId()).orElse(null);
        }

        Complaint complaint = Complaint.builder()
                .user(user)
                .job(job)
                .title(request.getTitle().trim())
                .category(request.getCategory() != null ? request.getCategory().trim() : "ทั่วไป")
                .description(request.getDescription().trim())
                .status(ComplaintStatus.PENDING)
                .build();

        Complaint saved = complaintRepository.save(complaint);
        return mapToResponse(saved);
    }

    // ดึงรายการเรื่องร้องเรียนทั้งหมดของผู้ใช้คนปัจจุบัน
    public List<ComplaintResponse> getMyComplaints(Long userId) {
        return complaintRepository.findByUserUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ดึงรายละเอียดเรื่องร้องเรียนของผู้ใช้
    public ComplaintResponse getMyComplaint(Long userId, Long complaintId) {
        Complaint complaint = complaintRepository.findByComplaintIdAndUserUserId(complaintId, userId)
                .orElseThrow(() -> new RuntimeException("ไม่พบเรื่องร้องเรียน"));
        return mapToResponse(complaint);
    }

    // ดึงรายการเรื่องร้องเรียนทั้งหมดสำหรับเจ้าหน้าที่
    public List<ComplaintResponse> getAllComplaints(Long officerUserId) {
        verifyOfficer(officerUserId);
        return complaintRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ดึงรายการเรื่องร้องเรียนตามสถานะสำหรับเจ้าหน้าที่
    public List<ComplaintResponse> getComplaintsByStatus(Long officerUserId, ComplaintStatus status) {
        verifyOfficer(officerUserId);
        return complaintRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ดึงรายละเอียดเรื่องร้องเรียนตาม ID สำหรับเจ้าหน้าที่
    public ComplaintResponse getComplaintById(Long officerUserId, Long complaintId) {
        verifyOfficer(officerUserId);
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("ไม่พบเรื่องร้องเรียน"));
        return mapToResponse(complaint);
    }

    // อัปเดตสถานะและบันทึกผลการตรวจสอบเรื่องร้องเรียนโดยเจ้าหน้าที่
    @Transactional
    public ComplaintResponse updateComplaintStatus(Long officerUserId, Long complaintId, ComplaintStatusRequest request) {
        UniversityOfficer officer = verifyOfficer(officerUserId);

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("ไม่พบเรื่องร้องเรียน"));

        if (request.getStatus() == null) {
            throw new RuntimeException("กรุณาระบุสถานะการดำเนินงาน");
        }

        complaint.setStatus(request.getStatus());
        if (request.getRemark() != null) {
            complaint.setOfficerRemark(request.getRemark().trim());
        }
        complaint.setResolvedBy(officer);

        Complaint updated = complaintRepository.save(complaint);
        return mapToResponse(updated);
    }

    // ตรวจสอบสิทธิ์เจ้าหน้าที่มหาวิทยาลัย
    private UniversityOfficer verifyOfficer(Long officerUserId) {
        return officerRepository.findByUserUserId(officerUserId)
                .orElseThrow(() -> new RuntimeException("ไม่มีสิทธิ์เข้าถึง: ต้องเป็นเจ้าหน้าที่มหาวิทยาลัยเท่านั้น"));
    }

    // แปลง Entity เป็น Response DTO พร้อมข้อมูลผู้ร้องเรียนและงาน
    private ComplaintResponse mapToResponse(Complaint complaint) {
        User user = complaint.getUser();
        String reporterName = user.getUsername();

        if (user.getRole() == UserRole.STUDENT) {
            studentRepository.findByUserUserId(user.getUserId()).ifPresent(s -> {
                // เก็บชื่อนามสกุลนักศึกษา
            });
            var optStudent = studentRepository.findByUserUserId(user.getUserId());
            if (optStudent.isPresent()) {
                Student s = optStudent.get();
                reporterName = s.getFirstName() + " " + s.getLastName();
            }
        } else if (user.getRole() == UserRole.EMPLOYER) {
            var optEmp = employerRepository.findByUserUserId(user.getUserId());
            if (optEmp.isPresent()) {
                Employer e = optEmp.get();
                reporterName = e.getCompanyName() + " (" + e.getContactName() + ")";
            }
        }

        String jobTitle = null;
        String companyName = null;
        Long jobId = null;

        if (complaint.getJob() != null) {
            Job job = complaint.getJob();
            jobId = job.getJobId();
            jobTitle = job.getJobTitle();
            if (job.getEmployer() != null) {
                companyName = job.getEmployer().getCompanyName();
            }
        }

        String resolvedByName = null;
        if (complaint.getResolvedBy() != null) {
            resolvedByName = complaint.getResolvedBy().getFirstName() + " " + complaint.getResolvedBy().getLastName();
        }

        return ComplaintResponse.builder()
                .complaintId(complaint.getComplaintId())
                .userId(user.getUserId())
                .username(user.getUsername())
                .reporterName(reporterName)
                .reporterRole(user.getRole().name())
                .jobId(jobId)
                .jobTitle(jobTitle)
                .companyName(companyName)
                .title(complaint.getTitle())
                .category(complaint.getCategory())
                .description(complaint.getDescription())
                .status(complaint.getStatus().name())
                .officerRemark(complaint.getOfficerRemark())
                .resolvedByName(resolvedByName)
                .createdAt(complaint.getCreatedAt())
                .updatedAt(complaint.getUpdatedAt())
                .build();
    }
}
