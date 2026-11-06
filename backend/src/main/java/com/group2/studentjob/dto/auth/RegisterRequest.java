package com.group2.studentjob.dto.auth;

import com.group2.studentjob.entity.enums.UserRole;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    // User
    private String username;
    private String password;
    private UserRole role;

    // Student
    private String studentCode;
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private String faculty;
    private String major;
    private Integer yearOfStudy;
    private String profileImage;

    // Employer
    private String companyName;
    private String contactName;
    private String address;
    private String companyDescription;
}