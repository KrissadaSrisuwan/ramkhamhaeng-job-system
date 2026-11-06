package com.group2.studentjob.dto.officer;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class OfficerProfileRequest {

    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    // ไฟล์รูปโปรไฟล์
    private MultipartFile profileImage;
}