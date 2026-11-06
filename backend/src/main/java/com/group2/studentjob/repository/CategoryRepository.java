package com.group2.studentjob.repository;

import com.group2.studentjob.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    // ค้นหา Category จากชื่อ
    Optional<Category> findByCategoryNameIgnoreCase(String categoryName);

    // ตรวจสอบชื่อ Category ว่ามีอยู่แล้วหรือไม่
    boolean existsByCategoryNameIgnoreCase(String categoryName);
}