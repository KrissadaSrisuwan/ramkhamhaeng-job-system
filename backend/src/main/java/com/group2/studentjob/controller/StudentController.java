package com.group2.studentjob.controller;

import com.group2.studentjob.dto.student.StudentProfileRequest;
import com.group2.studentjob.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    private final StudentService studentService;

    // ดึงข้อมูลโปรไฟล์นักศึกษา
    @GetMapping("/{userId}/profile")
    public ResponseEntity<?> getProfile(@PathVariable Long userId) {

        try {
            return ResponseEntity.ok(studentService.getProfile(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // แก้ไขข้อมูลโปรไฟล์นักศึกษา
    @PutMapping("/{userId}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable Long userId, @ModelAttribute StudentProfileRequest request) {

        try {
            return ResponseEntity.ok(studentService.updateProfile(userId, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}