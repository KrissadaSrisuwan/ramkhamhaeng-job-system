package com.group2.studentjob.dto.complaint;

import lombok.*;

// คำขอสร้างเรื่องร้องเรียนจากผู้ใช้งาน
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintRequest {

    // หัวข้อเรื่องร้องเรียน
    private String title;

    // หมวดหมู่เรื่องร้องเรียน
    private String category;

    // รายละเอียดเรื่องร้องเรียน
    private String description;

    // รหัสงานที่เกี่ยวข้อง (ไม่บังคับ)
    private Long jobId;
}
