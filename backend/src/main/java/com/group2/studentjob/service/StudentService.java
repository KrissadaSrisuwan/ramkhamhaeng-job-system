package com.group2.studentjob.service;

import com.group2.studentjob.dto.student.StudentProfileRequest;
import com.group2.studentjob.dto.student.StudentProfileResponse;
import com.group2.studentjob.entity.Student;
import com.group2.studentjob.repository.StudentRepository;
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
public class StudentService {

    private final StudentRepository studentRepository;

    // โฟลเดอร์สำหรับเก็บรูปโปรไฟล์
    private final Path uploadPath = Paths.get(System.getProperty("user.dir"), "uploads", "profile");

    // ดึงข้อมูล Profile ของ Student
    public StudentProfileResponse getProfile(Long userId) {

        Student student = studentRepository.findByUserUserId(userId).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลนักเรียน"));

        return mapToResponse(student);
    }

    // แก้ไขข้อมูล Profile ของ Student
    public StudentProfileResponse updateProfile(Long userId, StudentProfileRequest request) {

        Student student = studentRepository.findByUserUserId(userId).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลนักเรียน"));

        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setPhone(request.getPhone());
        student.setEmail(request.getEmail());
        student.setFaculty(request.getFaculty());
        student.setMajor(request.getMajor());
        student.setYearOfStudy(request.getYearOfStudy());

        // ตรวจสอบว่ามีการเลือกรูปใหม่หรือไม่
        if (request.getProfileImage() != null && !request.getProfileImage().isEmpty()) {

            String imagePath = saveProfileImage(request.getProfileImage());

            student.setProfileImage(imagePath);
        }

        studentRepository.save(student);

        return mapToResponse(student);
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

    // แปลงข้อมูล Student เป็น Response
    private StudentProfileResponse mapToResponse(Student student) {

        return new StudentProfileResponse(
                student.getUser().getUserId(),
                student.getUser().getUsername(),
                student.getStudentCode(),
                student.getFirstName(),
                student.getLastName(),
                student.getPhone(),
                student.getEmail(),
                student.getFaculty(),
                student.getMajor(),
                student.getYearOfStudy(),
                student.getProfileImage());
    }
}