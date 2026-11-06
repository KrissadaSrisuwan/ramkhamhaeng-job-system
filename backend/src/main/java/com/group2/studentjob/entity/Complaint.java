package com.group2.studentjob.entity;

import com.group2.studentjob.entity.enums.ComplaintStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

// เอนทิตีสำหรับเก็บข้อมูลการร้องเรียนและรายงานความไม่ปลอดภัย
@Entity
@Table(name = "complaints")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Complaint {

    // รหัสเรื่องร้องเรียน
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ComplaintID")
    private Long complaintId;

    // ผู้ร้องเรียน (นักศึกษา หรือ ผู้ใช้งานในระบบ)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID", nullable = false)
    private User user;

    // งานที่เกี่ยวข้องกับการร้องเรียน (ถ้ามี)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "JobID")
    private Job job;

    // หัวข้อเรื่องร้องเรียน
    @Column(name = "Title", nullable = false, length = 200)
    private String title;

    // หมวดหมู่เรื่องร้องเรียน
    @Column(name = "Category", nullable = false, length = 100)
    private String category;

    // รายละเอียดเรื่องร้องเรียน
    @Column(name = "Description", nullable = false, columnDefinition = "TEXT")
    private String description;

    // สถานะเรื่องร้องเรียน
    @Enumerated(EnumType.STRING)
    @Column(name = "Status", nullable = false, length = 20)
    @Builder.Default
    private ComplaintStatus status = ComplaintStatus.PENDING;

    // บันทึก/หมายเหตุการดำเนินงานของเจ้าหน้าที่
    @Column(name = "OfficerRemark", columnDefinition = "TEXT")
    private String officerRemark;

    // เจ้าหน้าที่ผู้รับผิดชอบหรือตรวจสอบ
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ResolvedBy")
    private UniversityOfficer resolvedBy;

    // วันที่ส่งเรื่องร้องเรียน
    @Column(name = "CreatedAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // วันที่ปรับปรุงสถานะล่าสุด
    @Column(name = "UpdatedAt", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
