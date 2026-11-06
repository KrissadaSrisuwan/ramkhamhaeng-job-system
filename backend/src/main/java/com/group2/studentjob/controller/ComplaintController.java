package com.group2.studentjob.controller;

import com.group2.studentjob.dto.complaint.ComplaintRequest;
import com.group2.studentjob.dto.complaint.ComplaintStatusRequest;
import com.group2.studentjob.entity.enums.ComplaintStatus;
import com.group2.studentjob.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// คอนโทรลเลอร์สำหรับจัดการ API เรื่องร้องเรียนและความปลอดภัย
@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ComplaintController {

    private final ComplaintService complaintService;

    // ส่งเรื่องร้องเรียนใหม่
    @PostMapping("/{userId}")
    public ResponseEntity<?> createComplaint(@PathVariable Long userId, @RequestBody ComplaintRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(complaintService.createComplaint(userId, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ดึงเรื่องร้องเรียนทั้งหมดของผู้ใช้ปัจจุบัน
    @GetMapping("/{userId}")
    public ResponseEntity<?> getMyComplaints(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(complaintService.getMyComplaints(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ดึงรายละเอียดเรื่องร้องเรียนของผู้ใช้ตาม ID
    @GetMapping("/{userId}/{complaintId}")
    public ResponseEntity<?> getMyComplaint(@PathVariable Long userId, @PathVariable Long complaintId) {
        try {
            return ResponseEntity.ok(complaintService.getMyComplaint(userId, complaintId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // เจ้าหน้าที่: ดึงเรื่องร้องเรียนทั้งหมด
    @GetMapping("/officer/{officerUserId}")
    public ResponseEntity<?> getAllComplaints(@PathVariable Long officerUserId) {
        try {
            return ResponseEntity.ok(complaintService.getAllComplaints(officerUserId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // เจ้าหน้าที่: ดึงเรื่องร้องเรียนตามสถานะ
    @GetMapping("/officer/{officerUserId}/status/{status}")
    public ResponseEntity<?> getComplaintsByStatus(@PathVariable Long officerUserId, @PathVariable String status) {
        try {
            ComplaintStatus complaintStatus = ComplaintStatus.valueOf(status.toUpperCase());
            return ResponseEntity.ok(complaintService.getComplaintsByStatus(officerUserId, complaintStatus));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "สถานะเรื่องร้องเรียนไม่ถูกต้อง"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // เจ้าหน้าที่: ดูรายละเอียดเรื่องร้องเรียน
    @GetMapping("/officer/{officerUserId}/{complaintId}")
    public ResponseEntity<?> getComplaintById(@PathVariable Long officerUserId, @PathVariable Long complaintId) {
        try {
            return ResponseEntity.ok(complaintService.getComplaintById(officerUserId, complaintId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // เจ้าหน้าที่: ปรับปรุงสถานะและบันทึกหมายเหตุการตรวจสอบ
    @PutMapping("/officer/{officerUserId}/{complaintId}/status")
    public ResponseEntity<?> updateComplaintStatus(
            @PathVariable Long officerUserId,
            @PathVariable Long complaintId,
            @RequestBody ComplaintStatusRequest request) {
        try {
            return ResponseEntity.ok(complaintService.updateComplaintStatus(officerUserId, complaintId, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
