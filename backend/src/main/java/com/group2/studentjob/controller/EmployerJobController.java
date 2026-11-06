package com.group2.studentjob.controller;

import com.group2.studentjob.dto.employer.JobRequest;
import com.group2.studentjob.service.EmployerJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/employers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class EmployerJobController {

    private final EmployerJobService jobService;

    // ดึงรายการงานของผู้ประกอบการ
    @GetMapping("/{userId}/jobs")
    public ResponseEntity<?> getMyJobs(@PathVariable Long userId) {

        try {
            return ResponseEntity.ok(jobService.getMyJobs(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // เพิ่มประกาศงาน
    @PostMapping("/{userId}/jobs")
    public ResponseEntity<?> createJob(@PathVariable Long userId, @RequestBody JobRequest request) {

        try {
            return ResponseEntity.ok(jobService.createJob(userId, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // แก้ไขประกาศงาน
    @PutMapping("/{userId}/jobs/{jobId}")
    public ResponseEntity<?> updateJob(@PathVariable Long userId, @PathVariable Long jobId, @RequestBody JobRequest request) {

        try {
            return ResponseEntity.ok(jobService.updateJob(userId, jobId, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // เปิดรับสมัครงาน
    @PutMapping("/{userId}/jobs/{jobId}/open")
    public ResponseEntity<?> openJob(@PathVariable Long userId, @PathVariable Long jobId) {

        try {
            return ResponseEntity.ok(jobService.openJob(userId, jobId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ปิดรับสมัครงาน
    @PutMapping("/{userId}/jobs/{jobId}/close")
    public ResponseEntity<?> closeJob(@PathVariable Long userId, @PathVariable Long jobId) {

        try {
            return ResponseEntity.ok(jobService.closeJob(userId, jobId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ลบประกาศงาน
    @DeleteMapping("/{userId}/jobs/{jobId}")
    public ResponseEntity<?> deleteJob(@PathVariable Long userId, @PathVariable Long jobId) {

        try {
            jobService.deleteJob(userId, jobId);
            return ResponseEntity.ok(Map.of("message", "ลบประกาศงานสำเร็จ"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}