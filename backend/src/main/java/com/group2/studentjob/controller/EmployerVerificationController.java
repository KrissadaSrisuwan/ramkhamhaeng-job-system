package com.group2.studentjob.controller;

import com.group2.studentjob.dto.officer.EmployerVerificationRequest;
import com.group2.studentjob.entity.enums.EmployerVerificationStatus;
import com.group2.studentjob.service.EmployerVerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/officers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class EmployerVerificationController {

    private final EmployerVerificationService employerVerificationService;

    // ดึงข้อมูลผู้ประกอบการทั้งหมด
    @GetMapping("/{officerUserId}/employers")
    public ResponseEntity<?> getAllEmployers(@PathVariable Long officerUserId) {

        try {
            return ResponseEntity.ok(employerVerificationService.getAllEmployers());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ดึงข้อมูลผู้ประกอบการตาม ID
    @GetMapping("/{officerUserId}/employers/{employerId}")
    public ResponseEntity<?> getEmployer(@PathVariable Long officerUserId, @PathVariable Long employerId) {

        try {
            return ResponseEntity.ok(employerVerificationService.getEmployerById(employerId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ดึงข้อมูลผู้ประกอบการตามสถานะ
    @GetMapping("/{officerUserId}/employers/status/{status}")
    public ResponseEntity<?> getEmployersByStatus(@PathVariable Long officerUserId, @PathVariable EmployerVerificationStatus status) {

        try {
            return ResponseEntity.ok(employerVerificationService.getEmployersByStatus(status));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // อนุมัติหรือปฏิเสธผู้ประกอบการ
    @PutMapping("/{officerUserId}/employers/{employerId}/verification")
    public ResponseEntity<?> verifyEmployer(@PathVariable Long officerUserId, @PathVariable Long employerId, @RequestBody EmployerVerificationRequest request) {

        try {
            return ResponseEntity.ok(employerVerificationService.verifyEmployer(employerId, officerUserId, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ดึงประวัติการตรวจสอบผู้ประกอบการ
    @GetMapping("/{officerUserId}/employers/{employerId}/verification-history")
    public ResponseEntity<?> getVerificationHistory(@PathVariable Long officerUserId, @PathVariable Long employerId) {

        try {
            return ResponseEntity.ok(employerVerificationService.getVerificationHistory(employerId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}