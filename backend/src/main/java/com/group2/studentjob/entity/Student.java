package com.group2.studentjob.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    // รหัสนักศึกษาในระบบ
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "StudentID")
    private Long studentId;

    // ข้อมูลผู้ใช้
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID", nullable = false, unique = true)
    private User user;

    // รหัสนักศึกษา
    @Column(name = "StudentCode", nullable = false, unique = true, length = 20)
    private String studentCode;

    // ชื่อนักศึกษา
    @Column(name = "FirstName", nullable = false, length = 100)
    private String firstName;

    // นามสกุลนักศึกษา
    @Column(name = "LastName", nullable = false, length = 100)
    private String lastName;

    // เบอร์โทรศัพท์
    @Column(name = "Phone", length = 20)
    private String phone;

    // อีเมล
    @Column(name = "Email", length = 150)
    private String email;

    // คณะ
    @Column(name = "Faculty", length = 150)
    private String faculty;

    // สาขาวิชา
    @Column(name = "Major", length = 150)
    private String major;

    // ชั้นปี
    @Column(name = "YearOfStudy")
    private Integer yearOfStudy;

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