# 🎓 ระบบจัดหางานพาร์ตไทม์ มหาวิทยาลัยรามคำแหง
### (Ramkhamhaeng University Part-Time Job System)

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x%2F4.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC.svg)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-orange.svg)](https://www.mysql.com/)
[![Java](https://img.shields.io/badge/Java-21-red.svg)](https://www.oracle.com/java/)

ระบบศูนย์กลางเชื่อมโยงนักศึกษามหาวิทยาลัยรามคำแหงกับสถานประกอบการรอบมหาวิทยาลัย เพื่อส่งเสริมการมีรายได้ระหว่างเรียน พร้อมระบบจับคู่ตามเวลาว่างอัจฉริยะ (Smart Match) และกลไกความปลอดภัยตรวจสอบผู้ประกอบการและรับเรื่องร้องเรียน

---

## 📌 สารบัญ (Table of Contents)
1. [ฟีเจอร์เด่นของระบบ (Key Features)](#-ฟีเจอร์เด่นของระบบ-key-features)
2. [เทคโนโลยีที่ใช้ (Tech Stack)](#-เทคโนโลยีที่ใช้-tech-stack)
3. [โครงสร้างโปรเจกต์ (Project Structure)](#-โครงสร้างโปรเจกต์-project-structure)
4. [ข้อกำหนดเบื้องต้น (Prerequisites)](#-ข้อกำหนดเบื้องต้น-prerequisites)
5. [ขั้นตอนการติดตั้งและเริ่มใช้งาน (Quick Start Guide)](#-ขั้นตอนการติดตั้งและเริ่มใช้งาน-quick-start-guide)
6. [บัญชีผู้ใช้สำหรับทดสอบ (Demo Accounts)](#-บัญชีผู้ใช้สำหรับทดสอบ-demo-accounts)
7. [เอกสารอ้างอิงและรายงาน (Documentation)](#-เอกสารอ้างอิงและรายงาน-documentation)

---

## ✨ ฟีเจอร์เด่นของระบบ (Key Features)

ระบบรองรับผู้ใช้งาน 3 บทบาทหลักตามข้อกำหนดมาตรฐานมหาวิทยาลัย:

### 1. 🎓 สำหรับนักศึกษา (Student)
- **ระบบสมาชิกและโปรไฟล์:** กรอกรหัสนักศึกษา คณะ สาขาวิชา และชั้นปี
- **จัดการช่วงเวลาว่าง (Availability):** บันทึกวันและช่วงเวลาที่สะดวกทำงานพาร์ตไทม์
- **ระบบ Smart Match:** กรองงานที่เวลาตรงกับช่วงเวลาว่างของนักศึกษาโดยอัตโนมัติ
- **ค้นหางานตามพื้นที่รอบมหาวิทยาลัย:** เลือกโซน ม.ราม 1 (หัวหมาก), ม.ราม 2 (บางนา), ลาดพร้าว, พระราม 9 หรือออนไลน์
- **ติดตามสถานะการสมัคร:** ตรวจสอบสถานะ รอพิจารณา / ผ่านการคัดเลือก / ไม่ผ่าน พร้อมหมายเหตุนัดหมาย
- **แจ้งเหตุและร้องเรียนความปลอดภัย (FR-04):** รายงานปัญหาเรื่องความปลอดภัยในสถานที่ทำงาน หรือการถูกเอารัดเอาเปรียบค่าจ้างไปยังเจ้าหน้าที่มหาวิทยาลัย

### 2. 🏢 สำหรับผู้ประกอบการ (Employer)
- **ยืนยันตัวตนสถานประกอบการ:** บันทึกข้อมูลและพิกัดที่ตั้ง รอเจ้าหน้าที่ตรวจสอบก่อนเริ่มใช้งาน
- **ระบบป้องกันความปลอดภัย (Safety Guard):** บังคับผ่านการอนุมัติก่อน จึงจะสามารถลงประกาศงานได้
- **จัดการตำแหน่งงาน:** สร้าง แก้ไข เปิดรับสมัคร ปิดรับสมัคร และลบประกาศงาน
- **คัดเลือกผู้สมัครงาน:** ตรวจสอบประวัตินักศึกษา ตอบรับเข้าทำงานหรือปฏิเสธ พร้อมระบุวันเวลานัดสัมภาษณ์

### 3. 🏛️ สำหรับเจ้าหน้าที่มหาวิทยาลัย (University Officer)
- **ตรวจสอบผู้ประกอบการ:** ตรวจสอบความถูกต้องของสถานประกอบการและเอกสารเพื่อความปลอดภัยของนักศึกษา
- **ตรวจสอบประกาศงาน:** กลั่นกรองความเหมาะสมของงาน ค่าตอบแทน และลักษณะงาน
- **จัดการเรื่องร้องเรียนความปลอดภัย:** ติดตามเรื่องร้องเรียน อัปเดตขั้นตอนการสอบสวน และบันทึกผลการช่วยเหลือ

---

## 💻 เทคโนโลยีที่ใช้ (Tech Stack)

| ส่วนของระบบ | เทคโนโลยี / เครื่องมือ |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Icons |
| **Backend** | Java 21, Spring Boot, Spring Security (JWT), Spring Data JPA, Hibernate, Maven |
| **Database** | MySQL 8.x (ฐานข้อมูล `ram_parttime_job`) |
| **Tools & Testing** | Puppeteer-Core, Postman, MySQL Workbench |

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
ramkhamhaeng-job-system/
├── backend/                       # ซอร์สโค้ดฝั่งเซิร์ฟเวอร์ (Spring Boot)
│   ├── src/main/java/.../         # Controllers, Services, Repositories, Entities, DTOs
│   ├── src/main/resources/        # application.properties
│   ├── docs/                      # เอกสาร API.md, DATABASE.md, DEVELOP.md
│   └── pom.xml                    # Maven Configuration
├── frontend/                      # ซอร์สโค้ดฝั่งผู้ใช้งาน (React + Vite)
│   ├── src/pages/                 # หน้าจอแยกตามบทบาท (student, employer, officer, auth)
│   ├── src/components/            # คอมโพเนนต์ส่วนกลาง (Navbar, UI Cards)
│   ├── src/api/                   # Axios API Clients
│   └── package.json               # Node.js Dependencies
├── docs/                          # เอกสารรายงานและหลักฐานการทดสอบ
│   ├── screenshots/               # ภาพหน้าจอระบบครบทุกมุมมอง (17 ภาพ)
│   ├── TESTING_AND_SCREENSHOTS.md # รายงานผลการทดสอบระบบ
│   ├── BUG_REPORT.md              # รายงาน Bug Report ตามฟอร์มมาตรฐาน
│   └── seed_demo_data.sql         # สคริปต์สร้างข้อมูลตัวอย่างสำหรับการทดสอบ
├── seed_demo_data.sql             # สคริปต์สร้างข้อมูลตัวอย่าง (Root Shortcut)
└── README.md                      # คู่มือการติดตั้งและใช้งานระบบ
```

---

## ⚙️ ข้อกำหนดเบื้องต้น (Prerequisites)

ก่อนเริ่มติดตั้ง กรุณาตรวจสอบว่าเครื่องของคุณมีโปรแกรมเหล่านี้แล้ว:
- **Node.js** (เวอร์ชัน 18 ขึ้นไป แนะนำ Node 20+)
- **Java JDK** (เวอร์ชัน 21)
- **MySQL Server** (เวอร์ชัน 8.0 ขึ้นไป)

---

## 🚀 ขั้นตอนการติดตั้งและเริ่มใช้งาน (Quick Start Guide)

### ขั้นตอนที่ 1: ติดตั้งและเตรียมฐานข้อมูล (Database Setup)
1. เปิดโปรแกรม MySQL (เช่น MySQL Command Line หรือ MySQL Workbench)
2. สร้างฐานข้อมูลชื่อ `ram_parttime_job`:
   ```sql
   CREATE DATABASE IF NOT EXISTS ram_parttime_job CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. นำเข้าข้อมูลตัวอย่างเริ่มต้น (Users, Jobs, Categories, Complaints):
   - เปิดโฟลเดอร์โปรเจกต์และรันคำสั่ง:
   ```powershell
   mysql -u root -p ram_parttime_job < docs/seed_demo_data.sql
   ```
   *(หรือเปิดไฟล์ `docs/seed_demo_data.sql` แล้วกด Execute ใน MySQL Workbench)*

---

### ขั้นตอนที่ 2: รัน Backend (Spring Boot API)
1. เข้าไปที่โฟลเดอร์ `backend`:
   ```bash
   cd backend
   ```
2. ตรวจสอบรหัสผ่านฐานข้อมูลในไฟล์ `src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```
3. เริ่มต้นรัน Backend ด้วย Maven Wrapper:
   - **บน Windows:**
     ```powershell
     .\mvnw spring-boot:run
     ```
   - **บน macOS / Linux:**
     ```bash
     ./mvnw spring-boot:run
     ```
4. เซิร์ฟเวอร์จะเปิดทำงานที่ `http://localhost:8080`

---

### ขั้นตอนที่ 3: รัน Frontend (React Web App)
1. เปิดหน้าต่าง Terminal ใหม่ แล้วเข้าไปที่โฟลเดอร์ `frontend`:
   ```bash
   cd frontend
   ```
2. ติดตั้ง Dependencies (ทำเฉพาะครั้งแรก):
   ```bash
   npm install
   ```
3. รันเว็บแอปพลิเคชัน:
   ```bash
   npm run dev
   ```
4. เปิดเว็บเบราว์เซอร์ไปที่: **`http://localhost:5173`**

---

## 🔑 บัญชีผู้ใช้สำหรับทดสอบ (Demo Accounts)

สามารถใช้บัญชีทดสอบที่จัดเตรียมไว้ เพื่อเข้าใช้งานได้ทันทีตามแต่ละบทบาท:

| บทบาท (Role) | ชื่อผู้ใช้ (Username) | รหัสผ่าน (Password) | สิ่งที่ทดสอบได้ |
| :--- | :--- | :--- | :--- |
| 🎓 **นักศึกษา (Student)** | `student01` | `123` | ค้นหางานตามโซน, ใช้ Smart Match, สมัครงาน, แจ้งเรื่องร้องเรียน |
| 🏢 **ผู้ประกอบการ (Employer)** | `employer01` | `123456` | ดูประกาศงาน, ตรวจสอบรายชื่อผู้สมัคร, รับเข้าทำงาน/ปฏิเสธ |
| 🏛️ **เจ้าหน้าที่ (Officer)** | `officer01` | `123` | อนุมัติผู้ประกอบการ, ตรวจสอบประกาศงาน, จัดการเรื่องร้องเรียน |

---

## 📚 เอกสารอ้างอิงและรายงาน (Documentation)

| หัวข้อเอกสาร | รายละเอียด | ที่อยู่ไฟล์ |
| :--- | :--- | :--- |
| **ผลการทดสอบและภาพหน้าจอ** | สรุปผลการทดสอบระบบพร้อมรูปภาพหน้าจอการทำงานจริงทั้ง 17 หน้า | [docs/TESTING_AND_SCREENSHOTS.md](file:///d:/ramkhamhaeng-job-system/docs/TESTING_AND_SCREENSHOTS.md) |
| **รายงานข้อผิดพลาด (Bug Report)** | รายงาน Bug Report ตามแบบฟอร์มมาตรฐานสำหรับการทำรายงานเล่ม | [docs/BUG_REPORT.md](file:///d:/ramkhamhaeng-job-system/docs/BUG_REPORT.md) |
| **เอกสาร API** | รายละเอียด REST API Endpoints ของระบบ Backend ทั้งหมด | [backend/docs/API.md](file:///d:/ramkhamhaeng-job-system/backend/docs/API.md) |
| **โครงสร้างฐานข้อมูล** | Schema และ ER-Diagram ของฐานข้อมูล `ram_parttime_job` | [backend/docs/DATABASE.md](file:///d:/ramkhamhaeng-job-system/backend/docs/DATABASE.md) |

---

> 💡 **หมายเหตุ:** ระบบนี้ได้รับการออกแบบส่วนติดต่อผู้ใช้ (UI) โดยใช้คู่สีทางการประจำมหาวิทยาลัยรามคำแหง คือ **สีกรมท่า (RU Navy: `#0B1953`)** และ **สีทอง (RU Gold: `#D4AF37`)** เพื่อความสวยงาม เป็นระเบียบ และอ่านง่ายตามเกณฑ์ NFR-03
