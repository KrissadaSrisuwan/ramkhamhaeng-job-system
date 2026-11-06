package com.group2.studentjob.entity;

import com.group2.studentjob.entity.enums.JobVerificationStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_verifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobVerification {

    // รหัสการตรวจสอบประกาศงาน
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "JobVerificationID")
    private Long jobVerificationId;

    // ข้อมูลประกาศงาน
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "JobID", nullable = false)
    private Job job;

    // ข้อมูลเจ้าหน้าที่
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "OfficerID", nullable = false)
    private UniversityOfficer officer;

    // สถานะการตรวจสอบ
    @Enumerated(EnumType.STRING)
    @Column(name = "Status", nullable = false, length = 20)
    private JobVerificationStatus status;

    // หมายเหตุการตรวจสอบ
    @Column(name = "Remark", columnDefinition = "TEXT")
    private String remark;

    // วันที่ตรวจสอบ
    @Column(name = "VerifiedAt", nullable = false, updatable = false)
    private LocalDateTime verifiedAt;

    // กำหนดวันที่ตรวจสอบ
    @PrePersist
    protected void onCreate() {
        verifiedAt = LocalDateTime.now();
    }
}