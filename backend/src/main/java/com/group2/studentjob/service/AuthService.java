package com.group2.studentjob.service;

import com.group2.studentjob.dto.auth.AuthResponse;
import com.group2.studentjob.dto.auth.ChangePasswordRequest;
import com.group2.studentjob.dto.auth.LoginRequest;
import com.group2.studentjob.dto.auth.RegisterRequest;
import com.group2.studentjob.entity.Employer;
import com.group2.studentjob.entity.Student;
import com.group2.studentjob.entity.User;
import com.group2.studentjob.entity.enums.EmployerVerificationStatus;
import com.group2.studentjob.entity.enums.UserRole;
import com.group2.studentjob.entity.enums.UserStatus;
import com.group2.studentjob.repository.EmployerRepository;
import com.group2.studentjob.repository.StudentRepository;
import com.group2.studentjob.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final EmployerRepository employerRepository;
    private final PasswordEncoder passwordEncoder;

    // สมัครสมาชิก
    @Transactional
    public AuthResponse register(RegisterRequest request) {

        // ตรวจสอบ Username
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            throw new RuntimeException("จำเป็นต้องระบุชื่อผู้ใช้");
        }

        // ตรวจสอบ Password
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new RuntimeException("จำเป็นต้องระบุรหัสผ่าน");
        }

        // ตรวจสอบ Role
        if (request.getRole() == null) {
            throw new RuntimeException("จำเป็นต้องระบุบทบาท");
        }

        // ตรวจสอบ Username ซ้ำ
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("มีชื่อผู้ใช้นี้อยู่แล้ว");
        }

        // Officer ไม่สามารถสมัครสมาชิกเองได้
        if (request.getRole() == UserRole.OFFICER) {
            throw new RuntimeException("เจ้าหน้าที่มหาวิทยาลัยไม่สามารถลงทะเบียนได้");
        }

        // สร้าง User
        User user = new User();

        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setStatus(UserStatus.ACTIVE);
        user = userRepository.save(user);

        // สมัครสมาชิกในฐานะ Student
        if (request.getRole() == UserRole.STUDENT) {
            registerStudent(request, user);

            return new AuthResponse(user.getUserId(), user.getUsername(), user.getRole(), user.getStatus().name(), "ลงทะเบียนนักเรียนเรียบร้อยแล้ว");
        }

        // สมัครสมาชิกในฐานะ Employer
        if (request.getRole() == UserRole.EMPLOYER) {
            registerEmployer(request, user);

            return new AuthResponse(user.getUserId(), user.getUsername(), user.getRole(), user.getStatus().name(), "ลงทะเบียนนายจ้างสำเร็จแล้ว อยู่ระหว่างรอการตรวจสอบ");
        }

        throw new RuntimeException("บทบาทไม่ถูกต้อง");
    }

    // สมัครสมาชิก Student
    private void registerStudent(RegisterRequest request, User user) {

        // ตรวจสอบ Student Code ซ้ำ
        if (request.getStudentCode() != null && studentRepository.existsByStudentCode(request.getStudentCode())) {
            throw new RuntimeException("รหัสนักศึกษานี้มีอยู่แล้ว");
        }

        Student student = new Student();

        student.setUser(user);
        student.setStudentCode(request.getStudentCode());
        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setPhone(request.getPhone());
        student.setEmail(request.getEmail());
        student.setFaculty(request.getFaculty());
        student.setMajor(request.getMajor());
        student.setYearOfStudy(request.getYearOfStudy());
        student.setProfileImage(request.getProfileImage());

        studentRepository.save(student);
    }

    // สมัครสมาชิก Employer
    private void registerEmployer(RegisterRequest request, User user) {

        Employer employer = new Employer();

        employer.setUser(user);
        employer.setCompanyName(request.getCompanyName());
        employer.setContactName(request.getContactName());
        employer.setPhone(request.getPhone());
        employer.setEmail(request.getEmail());
        employer.setAddress(request.getAddress());
        employer.setCompanyDescription(request.getCompanyDescription());
        employer.setProfileImage(request.getProfileImage());
        employer.setVerificationStatus(EmployerVerificationStatus.PENDING);

        employerRepository.save(employer);
    }

    // เข้าสู่ระบบ
    public AuthResponse login(LoginRequest request) {

        // ตรวจสอบ Username
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            throw new RuntimeException("จำเป็นต้องระบุชื่อผู้ใช้");
        }

        // ตรวจสอบ Password
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new RuntimeException("จำเป็นต้องระบุรหัสผ่าน");
        }

        // ค้นหา User จาก Username
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new RuntimeException("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"));

        // ตรวจสอบ Password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
        }

        // ตรวจสอบสถานะบัญชี
        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new RuntimeException("บัญชีถูกระงับ");
        }

        if (user.getStatus() == UserStatus.INACTIVE) {
            throw new RuntimeException("บัญชีไม่ได้ใช้งาน");
        }

        // ตรวจสอบข้อมูล Student
        if (user.getRole() == UserRole.STUDENT) {
            studentRepository.findByUserUserId(user.getUserId()).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลนักเรียน"));
        }

        // ตรวจสอบข้อมูล Employer
        if (user.getRole() == UserRole.EMPLOYER) {
            Employer employer = employerRepository.findByUserUserId(user.getUserId()).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลนายจ้าง"));

            // ตรวจสอบสถานะการอนุมัติ Employer
            if (employer.getVerificationStatus() == EmployerVerificationStatus.PENDING) {
                throw new RuntimeException("บัญชีผู้ประกอบการอยู่ระหว่างรอการตรวจสอบจากเจ้าหน้าที่มหาวิทยาลัย");
            }

            // ตรวจสอบกรณีถูกปฏิเสธ
            if (employer.getVerificationStatus() == EmployerVerificationStatus.REJECTED) {
                throw new RuntimeException("การสมัครผู้ประกอบการถูกปฏิเสธ กรุณาติดต่อเจ้าหน้าที่มหาวิทยาลัย");
            }

            // ต้องได้รับการอนุมัติก่อนเข้าสู่ระบบ
            if (employer.getVerificationStatus() != EmployerVerificationStatus.APPROVED) {
                throw new RuntimeException("ผู้ประกอบการยังไม่ได้รับอนุมัติ");
            }
        }

        // ตรวจสอบการเข้าสู่ระบบของ Officer
        if (user.getRole() == UserRole.OFFICER) {

            return new AuthResponse(user.getUserId(), user.getUsername(), user.getRole(), user.getStatus().name(), "เจ้าหน้าที่เข้าสู่ระบบสำเร็จ");
        }

        return new AuthResponse(user.getUserId(), user.getUsername(), user.getRole(), user.getStatus().name(), "เข้าสู่ระบบสำเร็จ");
    }

    // เปลี่ยนรหัสผ่าน
    public void changePassword(Long userId, ChangePasswordRequest request) {

        // ค้นหา User จาก User ID
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("ไม่พบผู้ใช้"));

        // ตรวจสอบรหัสผ่านเดิม
        if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
            throw new RuntimeException("จำเป็นต้องระบุรหัสผ่านปัจจุบัน");
        }

        // ตรวจสอบรหัสผ่านใหม่
        if (request.getNewPassword() == null || request.getNewPassword().isBlank()) {
            throw new RuntimeException("จำเป็นต้องมีรหัสผ่านใหม่");
        }

        // ตรวจสอบว่ารหัสผ่านเดิมถูกต้อง
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new RuntimeException("รหัสผ่านปัจจุบันไม่ถูกต้อง");
        }

        // ตรวจสอบว่ารหัสผ่านใหม่ไม่ซ้ำกับรหัสผ่านเดิม
        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw new RuntimeException("รหัสผ่านใหม่ต้องแตกต่างจากเดิม");
        }

        // เข้ารหัสและบันทึกรหัสผ่านใหม่
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);
    }
}