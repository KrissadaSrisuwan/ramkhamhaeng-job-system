package com.group2.studentjob.dto.complaint;

import lombok.*;
import java.time.LocalDateTime;

// ข้อมูลผลลัพธ์ของเรื่องร้องเรียนสำหรับส่งกลับหน้าบ้าน
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintResponse {

    // รหัสเรื่องร้องเรียน
    private Long complaintId;

    // รหัสและชื่อผู้ใช้ของผู้ร้องเรียน
    private Long userId;
    private String username;
    private String reporterName;
    private String reporterRole;

    // ข้อมูลงานที่เกี่ยวข้อง (ถ้ามี)
    private Long jobId;
    private String jobTitle;
    private String companyName;

    // หัวข้อและรายละเอียด
    private String title;
    private String category;
    private String description;

    // สถานะและการดำเนินการ
    private String status;
    private String officerRemark;
    private String resolvedByName;

    // วันที่ส่งและแก้ไขล่าสุด
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
