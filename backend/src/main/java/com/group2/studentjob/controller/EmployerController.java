package com.group2.studentjob.controller;

import com.group2.studentjob.dto.employer.EmployerProfileRequest;
import com.group2.studentjob.service.EmployerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/employers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class EmployerController {

    private final EmployerService employerService;

    // ดึงข้อมูลโปรไฟล์ผู้ประกอบการ
    @GetMapping("/{userId}/profile")
    public ResponseEntity<?> getProfile(@PathVariable Long userId) {

        try {
            return ResponseEntity.ok(employerService.getProfile(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // แก้ไขข้อมูลโปรไฟล์ผู้ประกอบการ
    @PutMapping("/{userId}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable Long userId, @ModelAttribute EmployerProfileRequest request) {

        try {
            return ResponseEntity.ok(employerService.updateProfile(userId, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}