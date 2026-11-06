package com.group2.studentjob.entity;

import com.group2.studentjob.entity.enums.JobStatus;
import com.group2.studentjob.entity.enums.JobVerificationStatus;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    // รหัสประกาศงาน
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "JobID")
    private Long jobId;

    // ข้อมูลผู้ประกอบการ
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EmployerID", nullable = false)
    private Employer employer;

    // หมวดหมู่งาน
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CategoryID", nullable = false)
    private Category category;

    // ชื่องาน
    @Column(name = "JobTitle", nullable = false, length = 200)
    private String jobTitle;

    // รายละเอียดงาน
    @Column(name = "Description", nullable = false, columnDefinition = "TEXT")
    private String description;

    // สถานที่ทำงาน
    @Column(name = "Location", length = 255)
    private String location;

    // ค่าตอบแทน
    @Column(name = "Salary", precision = 10, scale = 2)
    private BigDecimal salary;

    // คุณสมบัติผู้สมัคร
    @Column(name = "Qualification", columnDefinition = "TEXT")
    private String qualification;

    // วันที่ทำงาน
    @Column(name = "JobDate")
    private LocalDate jobDate;

    // เวลาเริ่มงาน
    @Column(name = "StartTime")
    private LocalTime startTime;

    // เวลาสิ้นสุดงาน
    @Column(name = "EndTime")
    private LocalTime endTime;

    // สถานะประกาศงาน
    @Enumerated(EnumType.STRING)
    @Column(name = "Status", nullable = false, length = 20)
    @Builder.Default
    private JobStatus status = JobStatus.DRAFT;

    // สถานะการตรวจสอบประกาศงาน
    @Enumerated(EnumType.STRING)
    @Column(name = "VerificationStatus", nullable = false, length = 20)
    @Builder.Default
    private JobVerificationStatus verificationStatus = JobVerificationStatus.PENDING;

    // หมายเหตุจากการตรวจสอบ
    @Column(name = "VerificationRemark", columnDefinition = "TEXT")
    private String verificationRemark;

    // เจ้าหน้าที่ผู้ตรวจสอบ
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VerifiedBy")
    private UniversityOfficer verifiedBy;

    // วันที่ตรวจสอบ
    @Column(name = "VerifiedAt")
    private LocalDateTime verifiedAt;

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