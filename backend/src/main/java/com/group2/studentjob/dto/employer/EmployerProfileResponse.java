package com.group2.studentjob.dto.employer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployerProfileResponse {

    private Long userId;
    private String username;

    private String companyName;
    private String contactName;
    private String phone;
    private String email;

    private String address;
    private String companyDescription;

    private String profileImage;

    private String verificationStatus;
}