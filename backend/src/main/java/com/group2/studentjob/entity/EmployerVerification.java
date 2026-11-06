package com.group2.studentjob.entity;

import com.group2.studentjob.entity.enums.EmployerVerificationStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "employer_verifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployerVerification {

    // รหัสการตรวจสอบผู้ประกอบการ
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "VerificationID")
    private Long verificationId;

    // ข้อมูลผู้ประกอบการ
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EmployerID", nullable = false)
    private Employer employer;

    // ข้อมูลเจ้าหน้าที่
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "OfficerID", nullable = false)
    private UniversityOfficer officer;

    // สถานะการตรวจสอบ
    @Enumerated(EnumType.STRING)
    @Column(name = "Status", nullable = false, length = 20)
    private EmployerVerificationStatus status;

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