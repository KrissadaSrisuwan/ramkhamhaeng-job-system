package com.group2.studentjob.service;

import com.group2.studentjob.dto.employer.EmployerProfileRequest;
import com.group2.studentjob.dto.employer.EmployerProfileResponse;
import com.group2.studentjob.entity.Employer;
import com.group2.studentjob.repository.EmployerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmployerService {

    private final EmployerRepository employerRepository;

    // โฟลเดอร์สำหรับเก็บรูปโปรไฟล์
    private final Path uploadPath = Paths.get(System.getProperty("user.dir"), "uploads", "profile");

    // ดึงข้อมูล Profile ของ Employer
    public EmployerProfileResponse getProfile(Long userId) {

        Employer employer = employerRepository.findByUserUserId(userId).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลผู้ประกอบการ"));

        return mapToResponse(employer);
    }

    // แก้ไขข้อมูล Profile ของ Employer
    public EmployerProfileResponse updateProfile(Long userId, EmployerProfileRequest request) {

        Employer employer = employerRepository.findByUserUserId(userId).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลผู้ประกอบการ"));

        employer.setCompanyName(request.getCompanyName());
        employer.setContactName(request.getContactName());
        employer.setPhone(request.getPhone());
        employer.setEmail(request.getEmail());
        employer.setAddress(request.getAddress());
        employer.setCompanyDescription(request.getCompanyDescription());

        // ตรวจสอบว่ามีการเลือกรูปใหม่หรือไม่
        if (request.getProfileImage() != null && !request.getProfileImage().isEmpty()) {

            String imagePath = saveProfileImage(request.getProfileImage());

            employer.setProfileImage(imagePath);
        }

        employerRepository.save(employer);

        return mapToResponse(employer);
    }

    // บันทึกรูปโปรไฟล์
    private String saveProfileImage(MultipartFile file) {

        try {
            // สร้างโฟลเดอร์ถ้ายังไม่มี
            Files.createDirectories(uploadPath);

            // ดึงนามสกุลไฟล์
            String originalName = file.getOriginalFilename();
            String extension = "";

            if (originalName != null && originalName.contains(".")) {

                extension = originalName.substring(originalName.lastIndexOf("."));
            }

            // สร้างชื่อไฟล์ใหม่ไม่ให้ซ้ำ
            String fileName = UUID.randomUUID() + extension;

            // ตำแหน่งไฟล์ที่จะบันทึก
            Path filePath = uploadPath.resolve(fileName);

            // บันทึกไฟล์
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Path ที่เก็บลง Database
            return "/uploads/profile/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("ไม่สามารถบันทึกรูปโปรไฟล์ได้", e);
        }
    }

    // แปลงข้อมูล Employer เป็น Response
    private EmployerProfileResponse mapToResponse(Employer employer) {

        return new EmployerProfileResponse(
                employer.getUser().getUserId(),
                employer.getUser().getUsername(),
                employer.getCompanyName(),
                employer.getContactName(),
                employer.getPhone(),
                employer.getEmail(),
                employer.getAddress(),
                employer.getCompanyDescription(),
                employer.getProfileImage(),
                employer.getVerificationStatus().name());
    }
}