package com.group2.studentjob.controller;

import com.group2.studentjob.dto.employer.ApplicationReviewRequest;
import com.group2.studentjob.service.EmployerApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/employers")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployerApplicationController {

    private final EmployerApplicationService employerApplicationService;

    public EmployerApplicationController(EmployerApplicationService employerApplicationService) {

        this.employerApplicationService = employerApplicationService;
    }

    // ดูผู้สมัครของงาน
    @GetMapping("/{userId}/jobs/{jobId}/applications")
    public ResponseEntity<?> getApplications(@PathVariable Long userId, @PathVariable Long jobId) {

        try {
            return ResponseEntity.ok(employerApplicationService.getApplications(userId, jobId));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ดูข้อมูลนักศึกษา
    @GetMapping("/{userId}/applications/{applicationId}/student")
    public ResponseEntity<?> getApplicant(@PathVariable Long userId, @PathVariable Long applicationId) {

        try {
            return ResponseEntity.ok(employerApplicationService.getApplicant(userId, applicationId));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ACCEPT / REJECT
    @PutMapping("/{userId}/applications/{applicationId}/review")
    public ResponseEntity<?> reviewApplication(@PathVariable Long userId, @PathVariable Long applicationId, @RequestBody ApplicationReviewRequest request) {

        try {
            return ResponseEntity.ok(employerApplicationService.reviewApplication(userId, applicationId, request));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}