package com.group2.studentjob.dto.student;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class StudentProfileRequest {

    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private String faculty;
    private String major;
    private Integer yearOfStudy;
    // ไฟล์รูปโปรไฟล์
    private MultipartFile profileImage;
}