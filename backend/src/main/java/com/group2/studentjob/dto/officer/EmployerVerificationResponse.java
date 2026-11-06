package com.group2.studentjob.dto.officer;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployerVerificationResponse {

    private Long employerId;
    private Long userId;
    private String companyName;
    private String contactName;
    private String phone;
    private String email;
    private String address;
    private String companyDescription;
    private String verificationStatus;
    private Long verifiedBy;
    private LocalDateTime verifiedAt;
}