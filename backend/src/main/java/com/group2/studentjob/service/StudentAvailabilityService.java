package com.group2.studentjob.service;

import com.group2.studentjob.dto.student.AvailabilityRequest;
import com.group2.studentjob.dto.student.AvailabilityResponse;
import com.group2.studentjob.entity.Student;
import com.group2.studentjob.entity.StudentAvailability;
import com.group2.studentjob.repository.StudentAvailabilityRepository;
import com.group2.studentjob.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentAvailabilityService {

    private final StudentAvailabilityRepository availabilityRepository;
    private final StudentRepository studentRepository;

    // ดึงเวลาว่างทั้งหมดของ Student
    public List<AvailabilityResponse> getAvailabilities(Long userId) {

        Student student = getStudent(userId);

        return availabilityRepository.findByStudentStudentId(student.getStudentId()).stream().map(this::mapToResponse).toList();
    }

    // เพิ่มเวลาว่าง
    public AvailabilityResponse createAvailability(Long userId, AvailabilityRequest request) {

        Student student = getStudent(userId);

        validateTime(request);

        StudentAvailability availability = new StudentAvailability();

        availability.setStudent(student);
        availability.setDayOfWeek(request.getDayOfWeek());
        availability.setStartTime(request.getStartTime());
        availability.setEndTime(request.getEndTime());
        availability.setIsAvailable(request.getIsAvailable() == null ? true : request.getIsAvailable());

        StudentAvailability saved = availabilityRepository.save(availability);

        return mapToResponse(saved);
    }

    // แก้ไขเวลาว่าง
    public AvailabilityResponse updateAvailability(Long userId, Long availabilityId, AvailabilityRequest request) {

        Student student = getStudent(userId);

        validateTime(request);

        StudentAvailability availability = availabilityRepository.findByAvailabilityIdAndStudentStudentId(availabilityId, student.getStudentId()).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลช่วงเวลาว่าง"));

        availability.setDayOfWeek(request.getDayOfWeek());
        availability.setStartTime(request.getStartTime());
        availability.setEndTime(request.getEndTime());

        if (request.getIsAvailable() != null) {

            availability.setIsAvailable(request.getIsAvailable());
        }

        StudentAvailability saved = availabilityRepository.save(availability);

        return mapToResponse(saved);
    }

    // ลบเวลาว่าง
    public void deleteAvailability(Long userId, Long availabilityId) {

        Student student = getStudent(userId);

        StudentAvailability availability = availabilityRepository.findByAvailabilityIdAndStudentStudentId(availabilityId, student.getStudentId()).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลช่วงเวลาว่าง"));

        availabilityRepository.delete(availability);
    }

    // ค้นหา Student จาก User ID
    private Student getStudent(Long userId) {

        return studentRepository.findByUserUserId(userId).orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลนักเรียน"));
    }

    // ตรวจสอบข้อมูลวันและเวลา
    private void validateTime(AvailabilityRequest request) {

        if (request.getDayOfWeek() == null) {

            throw new RuntimeException("จำเป็นต้องระบุวันในสัปดาห์");
        }

        if (request.getStartTime() == null || request.getEndTime() == null) {

            throw new RuntimeException("จำเป็นต้องระบุเวลาเริ่มต้นและเวลาสิ้นสุด");
        }

        // ตรวจสอบเวลาเริ่มต้นต้องก่อนเวลาสิ้นสุด
        if (!request.getStartTime().isBefore(request.getEndTime())) {

            throw new RuntimeException("จำเป็นต้องระบุเวลาเริ่มต้นและเวลาสิ้นสุด");
        }
    }

    // แปลงข้อมูล Availability เป็น Response
    private AvailabilityResponse mapToResponse(StudentAvailability availability) {

        return new AvailabilityResponse(
                availability.getAvailabilityId(),
                availability.getStudent().getStudentId(),
                availability.getDayOfWeek(),
                availability.getStartTime(),
                availability.getEndTime(),
                availability.getIsAvailable());
    }
}