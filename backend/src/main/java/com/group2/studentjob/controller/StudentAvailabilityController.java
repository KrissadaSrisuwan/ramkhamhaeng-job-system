package com.group2.studentjob.controller;

import com.group2.studentjob.dto.student.AvailabilityRequest;
import com.group2.studentjob.service.StudentAvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class StudentAvailabilityController {

    private final StudentAvailabilityService availabilityService;

    // ดึงข้อมูลช่วงเวลาว่างของนักศึกษา
    @GetMapping("/{userId}/availabilities")
    public ResponseEntity<?> getAvailabilities(@PathVariable Long userId) {

        try {
            return ResponseEntity.ok(availabilityService.getAvailabilities(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // เพิ่มช่วงเวลาว่าง
    @PostMapping("/{userId}/availabilities")
    public ResponseEntity<?> createAvailability(@PathVariable Long userId, @RequestBody AvailabilityRequest request) {

        try {
            return ResponseEntity.ok(availabilityService.createAvailability(userId, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // แก้ไขช่วงเวลาว่าง
    @PutMapping("/{userId}/availabilities/{availabilityId}")
    public ResponseEntity<?> updateAvailability(@PathVariable Long userId, @PathVariable Long availabilityId, @RequestBody AvailabilityRequest request) {

        try {
            return ResponseEntity.ok(availabilityService.updateAvailability(userId, availabilityId, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ลบช่วงเวลาว่าง
    @DeleteMapping("/{userId}/availabilities/{availabilityId}")
    public ResponseEntity<?> deleteAvailability(@PathVariable Long userId, @PathVariable Long availabilityId) {

        try {
            availabilityService.deleteAvailability(userId, availabilityId);
            return ResponseEntity.ok(Map.of("message", "ลบช่วงเวลาว่างสำเร็จ"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}