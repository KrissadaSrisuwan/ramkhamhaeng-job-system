package com.group2.studentjob.dto.complaint;

import com.group2.studentjob.entity.enums.ComplaintStatus;
import lombok.*;

// คำขอปรับปรุงสถานะเรื่องร้องเรียนโดยเจ้าหน้าที่
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintStatusRequest {

    // สถานะใหม่ของเรื่องร้องเรียน
    private ComplaintStatus status;

    // หมายเหตุหรือรายละเอียดผลการตรวจสอบของเจ้าหน้าที่
    private String remark;
}
