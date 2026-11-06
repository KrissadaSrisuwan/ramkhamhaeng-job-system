package com.group2.studentjob.repository;

import com.group2.studentjob.entity.UniversityOfficer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UniversityOfficerRepository extends JpaRepository<UniversityOfficer, Long> {

    // ค้นหา Officer จาก User ID
    Optional<UniversityOfficer> findByUserUserId(Long userId);

    // ค้นหา Officer จาก Email
    Optional<UniversityOfficer> findByEmail(String email);
}