package com.group2.studentjob.service;

import com.group2.studentjob.dto.officer.CategoryRequest;
import com.group2.studentjob.dto.officer.CategoryResponse;
import com.group2.studentjob.entity.Category;
import com.group2.studentjob.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    // ดึงข้อมูลหมวดหมู่งานทั้งหมด
    public List<CategoryResponse> getAllCategories() {

        return categoryRepository.findAll().stream().map(this::mapToResponse).toList();
    }

    // ดึงข้อมูลหมวดหมู่งานจาก ID
    public CategoryResponse getCategoryById(Long categoryId) {

        Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new RuntimeException("ไม่พบหมวดหมู่งาน ID: " + categoryId));

        return mapToResponse(category);
    }

    // เพิ่มหมวดหมู่งาน
    public CategoryResponse createCategory(CategoryRequest request) {

        validateRequest(request);

        String categoryName = request.getCategoryName().trim();

        // ตรวจสอบชื่อหมวดหมู่งานซ้ำ
        if (categoryRepository.existsByCategoryNameIgnoreCase(categoryName)) {
            throw new RuntimeException("มีหมวดหมู่งานนี้อยู่แล้ว");
        }

        Category category = new Category();
        category.setCategoryName(categoryName);
        category.setDescription(request.getDescription());
        Category savedCategory = categoryRepository.save(category);

        return mapToResponse(savedCategory);
    }

    // แก้ไขหมวดหมู่งาน
    public CategoryResponse updateCategory(Long categoryId, CategoryRequest request) {

        validateRequest(request);

        Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new RuntimeException("ไม่พบหมวดหมู่งาน ID: " + categoryId));

        String categoryName = request.getCategoryName().trim();

        // ตรวจสอบชื่อหมวดหมู่งานซ้ำ
        categoryRepository.findByCategoryNameIgnoreCase(categoryName).ifPresent(existingCategory -> {

            if (!existingCategory.getCategoryId().equals(categoryId)) {
                throw new RuntimeException("มีหมวดหมู่งานนี้อยู่แล้ว");
            }
        });

        category.setCategoryName(categoryName);
        category.setDescription(request.getDescription());
        Category updatedCategory = categoryRepository.save(category);

        return mapToResponse(updatedCategory);
    }

    // ลบหมวดหมู่งาน
    public void deleteCategory(Long categoryId) {

        Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new RuntimeException("ไม่พบหมวดหมู่งาน ID: " + categoryId));

        categoryRepository.delete(category);
    }

    // ตรวจสอบข้อมูลหมวดหมู่งาน
    private void validateRequest(CategoryRequest request) {

        if (request == null) {
            throw new RuntimeException("ข้อมูลหมวดหมู่งานไม่ถูกต้อง");
        }

        if (request.getCategoryName() == null || request.getCategoryName().trim().isEmpty()) {
            throw new RuntimeException("กรุณาระบุชื่อหมวดหมู่งาน");
        }
    }

    // แปลงข้อมูล Category เป็น Response
    private CategoryResponse mapToResponse(Category category) {

        return new CategoryResponse(
                category.getCategoryId(),
                category.getCategoryName(),
                category.getDescription());
    }
}