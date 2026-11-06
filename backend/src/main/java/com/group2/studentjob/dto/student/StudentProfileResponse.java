package com.group2.studentjob.dto.student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileResponse {

    private Long userId;
    private String username;
    private String studentCode;
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private String faculty;
    private String major;
    private Integer yearOfStudy;
    private String profileImage;
}