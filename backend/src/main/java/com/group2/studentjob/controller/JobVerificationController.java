package com.group2.studentjob.controller;

import com.group2.studentjob.dto.officer.JobVerificationRequest;
import com.group2.studentjob.service.JobVerificationService;
import com.group2.studentjob.entity.enums.JobVerificationStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/officers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class JobVerificationController {

    private final JobVerificationService jobVerificationService;

    // ดึงข้อมูลประกาศงานทั้งหมด
    @GetMapping("/{officerUserId}/jobs")
    public ResponseEntity<?> getAllJobs(@PathVariable Long officerUserId) {

        try {
            return ResponseEntity.ok(jobVerificationService.getAllJobs());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ดึงข้อมูลประกาศงานตาม ID
    @GetMapping("/{officerUserId}/jobs/{jobId}")
    public ResponseEntity<?> getJob(@PathVariable Long officerUserId, @PathVariable Long jobId) {

        try {
            return ResponseEntity.ok(jobVerificationService.getJobById(jobId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ดึงข้อมูลประกาศงานตามสถานะ
    @GetMapping("/{officerUserId}/jobs/status/{status}")
    public ResponseEntity<?> getJobsByStatus(@PathVariable Long officerUserId, @PathVariable JobVerificationStatus status) {

        try {
            return ResponseEntity.ok(jobVerificationService.getJobsByStatus(status));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // อนุมัติหรือปฏิเสธประกาศงาน
    @PutMapping("/{officerUserId}/jobs/{jobId}/verification")
    public ResponseEntity<?> verifyJob(@PathVariable Long officerUserId, @PathVariable Long jobId, @RequestBody JobVerificationRequest request) {

        try {
            return ResponseEntity.ok(jobVerificationService.verifyJob(jobId, officerUserId, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ดึงประวัติการตรวจสอบประกาศงาน
    @GetMapping("/{officerUserId}/jobs/{jobId}/verification-history")
    public ResponseEntity<?> getVerificationHistory(@PathVariable Long officerUserId, @PathVariable Long jobId) {

        try {
            return ResponseEntity.ok(jobVerificationService.getVerificationHistory(jobId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}