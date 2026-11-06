package com.group2.studentjob.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "university_officers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UniversityOfficer {

    // รหัสเจ้าหน้าที่
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OfficerID")
    private Long officerId;

    // ข้อมูลผู้ใช้
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID", nullable = false, unique = true)
    private User user;

    // ชื่อเจ้าหน้าที่
    @Column(name = "FirstName", nullable = false, length = 100)
    private String firstName;

    // นามสกุลเจ้าหน้าที่
    @Column(name = "LastName", nullable = false, length = 100)
    private String lastName;

    // เบอร์โทรศัพท์
    @Column(name = "Phone", length = 20)
    private String phone;

    // อีเมล
    @Column(name = "Email", length = 150)
    private String email;

    // รูปโปรไฟล์
    @Column(name = "ProfileImage", length = 500)
    private String profileImage;

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