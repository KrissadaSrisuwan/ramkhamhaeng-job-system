package com.group2.studentjob.entity.enums;

// สถานะการดำเนินงานของเรื่องร้องเรียน
public enum ComplaintStatus {
    // รอเจ้าหน้าที่ตรวจสอบ
    PENDING,

    // อยู่ระหว่างการตรวจสอบข้อเท็จจริง
    INVESTIGATING,

    // ดำเนินการแก้ไข/ยุติเรื่องเรียบร้อย
    RESOLVED,

    // ปฏิเสธ/ยุติเรื่องร้องเรียน
    DISMISSED
}
