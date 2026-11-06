package com.group2.studentjob.dto.officer;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployerVerificationRequest {

    private String status;
    private String remark;
}