package com.group2.studentjob.entity;

import com.group2.studentjob.entity.enums.UserRole;
import com.group2.studentjob.entity.enums.UserStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    // รหัสผู้ใช้
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserID")
    private Long userId;

    // ชื่อผู้ใช้
    @Column(name = "Username", nullable = false, unique = true, length = 50)
    private String username;

    // รหัสผ่านที่เข้ารหัสแล้ว
    @Column(name = "PasswordHash", nullable = false, length = 255)
    private String passwordHash;

    // บทบาทของผู้ใช้
    @Enumerated(EnumType.STRING)
    @Column(name = "Role", nullable = false, length = 20)
    private UserRole role;

    // สถานะบัญชีผู้ใช้
    @Enumerated(EnumType.STRING)
    @Column(name = "Status", nullable = false, length = 20)
    @Builder.Default
    private UserStatus status = UserStatus.ACTIVE;

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