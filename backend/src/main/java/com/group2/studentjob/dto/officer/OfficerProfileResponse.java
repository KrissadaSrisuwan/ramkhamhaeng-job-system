package com.group2.studentjob.dto.officer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfficerProfileResponse {

    private Long userId;
    private String username;
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private String profileImage;
}