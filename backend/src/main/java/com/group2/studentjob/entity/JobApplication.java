package com.group2.studentjob.entity;

import com.group2.studentjob.entity.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_applications", uniqueConstraints = {@UniqueConstraint(name = "UQ_Job_Student", columnNames = {"JobID", "StudentID"})})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobApplication {

    // รหัสการสมัครงาน
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ApplicationID")
    private Long applicationId;

    // ข้อมูลประกาศงาน
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "JobID", nullable = false)
    private Job job;

    // ข้อมูลนักศึกษา
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "StudentID", nullable = false)
    private Student student;

    // สถานะการสมัครงาน
    @Enumerated(EnumType.STRING)
    @Column(name = "Status", nullable = false, length = 20)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.PENDING;

    // วันที่สมัครงาน
    @Column(name = "AppliedAt", nullable = false, updatable = false)
    private LocalDateTime appliedAt;

    // วันที่ตรวจสอบการสมัคร
    @Column(name = "ReviewedAt")
    private LocalDateTime reviewedAt;

    // หมายเหตุจากผู้ประกอบการ
    @Column(name = "EmployerRemark", columnDefinition = "TEXT")
    private String employerRemark;

    // กำหนดวันที่สมัครงาน
    @PrePersist
    protected void onCreate() {
        appliedAt = LocalDateTime.now();
    }
}