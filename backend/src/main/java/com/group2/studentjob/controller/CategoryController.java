package com.group2.studentjob.controller;

import com.group2.studentjob.dto.officer.CategoryRequest;
import com.group2.studentjob.dto.officer.CategoryResponse;
import com.group2.studentjob.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/officers/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

    private final CategoryService categoryService;

    // ดึงข้อมูลหมวดหมู่งานทั้งหมด
    @GetMapping
    public ResponseEntity<?> getAllCategories() {

        try {
            return ResponseEntity.ok(categoryService.getAllCategories());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ดึงข้อมูลหมวดหมู่ตาม ID
    @GetMapping("/{categoryId}")
    public ResponseEntity<?> getCategoryById(@PathVariable Long categoryId) {

        try {
            return ResponseEntity.ok(categoryService.getCategoryById(categoryId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // เพิ่มหมวดหมู่งาน
    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody CategoryRequest request) {

        try {
            CategoryResponse response = categoryService.createCategory(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // แก้ไขหมวดหมู่งาน
    @PutMapping("/{categoryId}")
    public ResponseEntity<?> updateCategory(@PathVariable Long categoryId, @RequestBody CategoryRequest request) {

        try {
            return ResponseEntity.ok(categoryService.updateCategory(categoryId, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ลบหมวดหมู่งาน
    @DeleteMapping("/{categoryId}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long categoryId) {

        try {
            categoryService.deleteCategory(categoryId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
