package com.group2.studentjob.controller;

import com.group2.studentjob.dto.officer.OfficerProfileRequest;
import com.group2.studentjob.service.OfficerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/officers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class OfficerController {

    private final OfficerService officerService;

    // ดึงข้อมูลโปรไฟล์เจ้าหน้าที่
    @GetMapping("/{userId}/profile")
    public ResponseEntity<?> getProfile(@PathVariable Long userId) {

        try {
            return ResponseEntity.ok(officerService.getProfile(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // แก้ไขข้อมูลโปรไฟล์เจ้าหน้าที่
    @PutMapping("/{userId}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable Long userId, @ModelAttribute OfficerProfileRequest request) {

        try {
            return ResponseEntity.ok(officerService.updateProfile(userId, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}