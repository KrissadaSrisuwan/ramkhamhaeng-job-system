package com.group2.studentjob.controller;

import com.group2.studentjob.service.StudentJobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

// คอนโทรลเลอร์สำหรับค้นหาและสมัครงานพาร์ตไทม์ของนักศึกษา
@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentJobController {

    private final StudentJobService studentJobService;

    public StudentJobController(StudentJobService studentJobService) {
        this.studentJobService = studentJobService;
    }

    // ค้นหาและกรองงาน (รองรับการกรองตามชื่อ, หมวดหมู่, พื้นที่บริเวณ ม.รามคำแหง, และช่วงเวลาว่างตาม FR-02)
    @GetMapping("/{userId}/jobs")
    public ResponseEntity<?> searchJobs(
            @PathVariable Long userId,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "false") boolean filterByAvailability) {

        try {
            return ResponseEntity.ok(studentJobService.searchJobs(userId, title, categoryId, location, filterByAvailability));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ดึงรายละเอียดประกาศงาน
    @GetMapping("/{userId}/jobs/{jobId}")
    public ResponseEntity<?> getJobDetail(@PathVariable Long userId, @PathVariable Long jobId) {

        try {
            return ResponseEntity.ok(studentJobService.getJobDetail(userId, jobId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // สมัครงานพาร์ตไทม์
    @PostMapping("/{userId}/jobs/{jobId}/applications")
    public ResponseEntity<?> applyJob(@PathVariable Long userId, @PathVariable Long jobId) {

        try {
            return ResponseEntity.ok(studentJobService.applyJob(userId, jobId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ดึงประวัติรายการงานที่นักศึกษาเคยสมัคร
    @GetMapping("/{userId}/applications")
    public ResponseEntity<?> getMyApplications(@PathVariable Long userId) {

        try {
            return ResponseEntity.ok(studentJobService.getMyApplications(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
