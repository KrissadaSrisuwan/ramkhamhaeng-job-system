# API Documentation

ระบบจัดหางานพาร์ตไทม์สำหรับนักศึกษามหาวิทยาลัยรามคำแหง

## Backend
- Framework: Spring Boot
- Database: MySQL
- Port: 8080

## Base URL
http://localhost:8080/api

## Auth API
- POST /auth/register
- POST /auth/login
- PUT /auth/{userId}/password

## Student API
- GET students/{userId}/profile
- PUT students/{userId}/profile
---
- GET /students/{userId}/availabilities
- POST /students/{userId}/availabilities
- PUT /students/{userId}/availabilities/{availabilityId}
- DELETE /students/{userId}/availabilities/{availabilityId}
---
- GET /students/{userId}/jobs
- GET /students/{userId}/jobs/{jobId}
- POST /students/{userId}/jobs/{jobId}/applications
- GET /students/{userId}/applications

## Employer API

- GET /employers/{userId}/profile
- PUT /employers/{userId}/profile
---
- GET /employers/{userId}/jobs
- POST /employers/{userId}/jobs
- PUT /employers/{userId}/jobs/{jobId}
- PUT /employers/{userId}/jobs/{jobId}/open
- PUT /employers/{userId}/jobs/{jobId}/close
- DELETE /employers/{userId}/jobs/{jobId}
---
- GET /employers/{userId}/jobs/{jobId}/applications
- GET /employers/{userId}/applications/{applicationId}/student
- PUT /employers/{userId}/applications/{applicationId}/review

## Officer API
- GET /officers/{userId}/profile
- PUT /officers/{userId}/profile
---
- GET /officers/categories
- GET /officers/categories/{categoryId}
- POST /officers/categories
- PUT /officers/categories/{categoryId}
- DELETE /officers/categories/{categoryId}
---
- GET /officers/{officerUserId}/employers
- GET /officers/{officerUserId}/employers/{employerId}
- GET /officers/{officerUserId}/employers/status/{status}
- PUT /officers/{officerUserId}/employers/{employerId}/verification
- GET /officers/{officerUserId}/employers/{employerId}/verification-history
---
- GET /officers/{officerUserId}/jobs
- GET /officers/{officerUserId}/jobs/{jobId}
- GET /officers/{officerUserId}/jobs/status/{status}
- PUT /officers/{officerUserId}/jobs/{jobId}/verification
- GET /officers/{officerUserId}/jobs/{jobId}/verification-history


## Complaint & Safety Report API (FR-04)
- POST /complaints/{userId} - ส่งเรื่องร้องเรียน/รายงานความไม่ปลอดภัย
- GET /complaints/{userId} - ดูประวัติการร้องเรียนของผู้ใช้
- GET /complaints/{userId}/{complaintId} - ดูรายละเอียดเรื่องร้องเรียนของผู้ใช้
---
- GET /complaints/officer/{officerUserId} - เจ้าหน้าที่ดูเรื่องร้องเรียนทั้งหมด
- GET /complaints/officer/{officerUserId}/status/{status} - เจ้าหน้าที่กรองเรื่องร้องเรียนตามสถานะ
- GET /complaints/officer/{officerUserId}/{complaintId} - เจ้าหน้าที่ดูรายละเอียดเรื่องร้องเรียน
- PUT /complaints/officer/{officerUserId}/{complaintId}/status - เจ้าหน้าที่ปรับปรุงสถานะและบันทึกหมายเหตุ
