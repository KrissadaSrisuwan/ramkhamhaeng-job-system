package com.group2.studentjob.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    // รหัสหมวดหมู่งาน
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CategoryID")
    private Long categoryId;

    // ชื่อหมวดหมู่งาน
    @Column(name = "CategoryName", nullable = false, unique = true, length = 100)
    private String categoryName;

    // รายละเอียดหมวดหมู่งาน
    @Column(name = "Description", columnDefinition = "TEXT")
    private String description;

    // วันที่สร้างข้อมูล
    @Column(name = "CreatedAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // กำหนดวันที่สร้างข้อมูล
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}