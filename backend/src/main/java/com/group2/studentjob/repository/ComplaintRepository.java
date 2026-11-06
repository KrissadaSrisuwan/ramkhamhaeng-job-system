package com.group2.studentjob.repository;

import com.group2.studentjob.entity.Complaint;
import com.group2.studentjob.entity.enums.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

// พื้นที่จัดการข้อมูลตารางเรื่องร้องเรียนในฐานข้อมูล
@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    // ค้นหารายการเรื่องร้องเรียนตาม User ID เรียงจากรายการล่าสุด
    List<Complaint> findByUserUserIdOrderByCreatedAtDesc(Long userId);

    // ค้นหาเรื่องร้องเรียนตาม Complaint ID และ User ID
    Optional<Complaint> findByComplaintIdAndUserUserId(Long complaintId, Long userId);

    // ดึงเรื่องร้องเรียนทั้งหมดเรียงจากรายการล่าสุด สำหรับเจ้าหน้าที่
    List<Complaint> findAllByOrderByCreatedAtDesc();

    // ค้นหาเรื่องร้องเรียนตามสถานะเรียงจากรายการล่าสุด
    List<Complaint> findByStatusOrderByCreatedAtDesc(ComplaintStatus status);
}
