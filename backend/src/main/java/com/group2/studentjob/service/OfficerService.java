package com.group2.studentjob.service;

import com.group2.studentjob.dto.officer.OfficerProfileRequest;
import com.group2.studentjob.dto.officer.OfficerProfileResponse;
import com.group2.studentjob.entity.UniversityOfficer;
import com.group2.studentjob.repository.UniversityOfficerRepository;
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
public class OfficerService {

    private final UniversityOfficerRepository officerRepository;

    // โฟลเดอร์สำหรับเก็บรูปโปรไฟล์
    private final Path uploadPath = Paths.get(System.getProperty("user.dir"), "uploads", "profile");

    // ดึงข้อมูล Profile ของ Officer
    public OfficerProfileResponse getProfile(Long userId) {

        UniversityOfficer officer = officerRepository.findByUserUserId(userId).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลเจ้าหน้าที่"));

        return mapToResponse(officer);
    }

    // แก้ไขข้อมูล Profile ของ Officer
    public OfficerProfileResponse updateProfile(Long userId, OfficerProfileRequest request) {

        UniversityOfficer officer = officerRepository.findByUserUserId(userId).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลเจ้าหน้าที่"));

        officer.setFirstName(request.getFirstName());
        officer.setLastName(request.getLastName());
        officer.setPhone(request.getPhone());
        officer.setEmail(request.getEmail());

        // ตรวจสอบว่ามีการเลือกรูปใหม่หรือไม่
        if (request.getProfileImage() != null && !request.getProfileImage().isEmpty()) {

            String imagePath = saveProfileImage(request.getProfileImage());

            officer.setProfileImage(imagePath);
        }

        officerRepository.save(officer);

        return mapToResponse(officer);
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

    // แปลงข้อมูล Officer เป็น Response
    private OfficerProfileResponse mapToResponse(UniversityOfficer officer) {

        return new OfficerProfileResponse(
                officer.getUser().getUserId(),
                officer.getUser().getUsername(),
                officer.getFirstName(),
                officer.getLastName(),
                officer.getPhone(),
                officer.getEmail(),
                officer.getProfileImage());
    }
}