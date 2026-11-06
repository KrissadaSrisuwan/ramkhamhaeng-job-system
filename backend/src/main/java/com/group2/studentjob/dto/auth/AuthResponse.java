package com.group2.studentjob.dto.auth;

import com.group2.studentjob.entity.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {

    private Long userId;
    private String username;
    private UserRole role;
    private String status;
    private String message;
}