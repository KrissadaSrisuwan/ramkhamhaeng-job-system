package com.group2.studentjob.dto.employer;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class EmployerProfileRequest {

    private String companyName;
    private String contactName;
    private String phone;
    private String email;
    private String address;
    private String companyDescription;
    // ไฟล์รูปโปรไฟล์
    private MultipartFile profileImage;
}