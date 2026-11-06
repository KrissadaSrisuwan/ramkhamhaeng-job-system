package com.group2.studentjob.entity;

import com.group2.studentjob.entity.enums.DayOfWeek;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "student_availabilities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentAvailability {

    // รหัสช่วงเวลาว่าง
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AvailabilityID")
    private Long availabilityId;

    // ข้อมูลนักศึกษา
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "StudentID", nullable = false)
    private Student student;

    // วันในสัปดาห์
    @Enumerated(EnumType.STRING)
    @Column(name = "DayOfWeek", nullable = false, length = 20)
    private DayOfWeek dayOfWeek;

    // เวลาเริ่มต้น
    @Column(name = "StartTime", nullable = false)
    private LocalTime startTime;

    // เวลาสิ้นสุด
    @Column(name = "EndTime", nullable = false)
    private LocalTime endTime;

    // สถานะช่วงเวลาว่าง
    @Column(name = "IsAvailable", nullable = false)
    @Builder.Default
    private Boolean isAvailable = true;

    // วันที่สร้างข้อมูล
    @Column(name = "CreatedAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // วันที่แก้ไขข้อมูลล่าสุด
    @Column(name = "UpdatedAt", nullable = false)
    private LocalDateTime updatedAt;

    // กำหนดวันที่สร้างและวันที่แก้ไขข้อมูล
    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    // อัปเดตวันที่แก้ไขข้อมูล
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}