package com.group2.studentjob.entity;

import com.group2.studentjob.entity.enums.EmployerVerificationStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "employers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employer {

    // รหัสผู้ประกอบการ
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EmployerID")
    private Long employerId;

    // ข้อมูลผู้ใช้
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID", nullable = false, unique = true)
    private User user;

    // ชื่อบริษัท
    @Column(name = "CompanyName", nullable = false, length = 200)
    private String companyName;

    // ชื่อผู้ติดต่อ
    @Column(name = "ContactName", nullable = false, length = 200)
    private String contactName;

    // เบอร์โทรศัพท์
    @Column(name = "Phone", length = 20)
    private String phone;

    // อีเมล
    @Column(name = "Email", length = 150)
    private String email;

    // ที่อยู่บริษัท
    @Column(name = "Address", columnDefinition = "TEXT")
    private String address;

    // รายละเอียดบริษัท
    @Column(name = "CompanyDescription", columnDefinition = "TEXT")
    private String companyDescription;

    // รูปโปรไฟล์
    @Column(name = "ProfileImage", length = 500)
    private String profileImage;

    // สถานะการตรวจสอบผู้ประกอบการ
    @Enumerated(EnumType.STRING)
    @Column(name = "VerificationStatus", nullable = false, length = 20)
    @Builder.Default
    private EmployerVerificationStatus verificationStatus = EmployerVerificationStatus.PENDING;

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