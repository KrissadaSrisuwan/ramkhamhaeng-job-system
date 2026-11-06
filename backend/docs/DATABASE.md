# RAMKHAMHAENG PART-TIME JOB SYSTEM

---

## Database Setup

```sql
DROP DATABASE IF EXISTS ram_parttime_job;

CREATE DATABASE ram_parttime_job
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE ram_parttime_job;
```

---

# 1. USERS

```sql
CREATE TABLE users (
    UserID BIGINT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,

    Role ENUM(
        'STUDENT',
        'EMPLOYER',
        'OFFICER'
    ) NOT NULL,

    Status ENUM(
        'ACTIVE',
        'INACTIVE',
        'SUSPENDED'
    ) NOT NULL DEFAULT 'ACTIVE',

    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);
```

---

# 2. STUDENTS

```sql
CREATE TABLE students (
    StudentID BIGINT AUTO_INCREMENT PRIMARY KEY,
    UserID BIGINT NOT NULL UNIQUE,

    StudentCode VARCHAR(20) NOT NULL UNIQUE,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    Phone VARCHAR(20),
    Email VARCHAR(150),
    Faculty VARCHAR(150),
    Major VARCHAR(150),
    YearOfStudy INT,
    ProfileImage VARCHAR(500),

    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT FK_Students_Users
        FOREIGN KEY (UserID)
        REFERENCES users(UserID)
        ON DELETE CASCADE
);
```

---

# 3. UNIVERSITY OFFICERS

```sql
CREATE TABLE university_officers (
    OfficerID BIGINT AUTO_INCREMENT PRIMARY KEY,
    UserID BIGINT NOT NULL UNIQUE,

    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    Phone VARCHAR(20),
    Email VARCHAR(150),
    ProfileImage VARCHAR(500),

    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT FK_Officers_Users
        FOREIGN KEY (UserID)
        REFERENCES users(UserID)
        ON DELETE CASCADE
);
```

---

# 4. EMPLOYERS

```sql
CREATE TABLE employers (
    EmployerID BIGINT AUTO_INCREMENT PRIMARY KEY,
    UserID BIGINT NOT NULL UNIQUE,

    CompanyName VARCHAR(200) NOT NULL,
    ContactName VARCHAR(200) NOT NULL,
    Phone VARCHAR(20),
    Email VARCHAR(150),
    Address TEXT,
    CompanyDescription TEXT,
    ProfileImage VARCHAR(500),

    VerificationStatus ENUM(
        'PENDING',
        'APPROVED',
        'REJECTED',
        'SUSPENDED'
    ) NOT NULL DEFAULT 'PENDING',

    VerifiedBy BIGINT NULL,
    VerifiedAt DATETIME NULL,

    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT FK_Employers_Users
        FOREIGN KEY (UserID)
        REFERENCES users(UserID)
        ON DELETE CASCADE,

    CONSTRAINT FK_Employers_VerifiedBy
        FOREIGN KEY (VerifiedBy)
        REFERENCES university_officers(OfficerID)
        ON DELETE SET NULL
);
```

---

# 5. CATEGORIES

```sql
CREATE TABLE categories (
    CategoryID BIGINT AUTO_INCREMENT PRIMARY KEY,

    CategoryName VARCHAR(100) NOT NULL UNIQUE,
    Description TEXT,

    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

# 6. JOBS

```sql
CREATE TABLE jobs (
    JobID BIGINT AUTO_INCREMENT PRIMARY KEY,

    EmployerID BIGINT NOT NULL,
    CategoryID BIGINT NOT NULL,

    JobTitle VARCHAR(200) NOT NULL,
    Description TEXT NOT NULL,
    Location VARCHAR(255),
    Salary DECIMAL(10,2),
    Qualification TEXT,

    JobDate DATE,
    StartTime TIME,
    EndTime TIME,

    Status ENUM(
        'DRAFT',
        'OPEN',
        'CLOSED'
    ) NOT NULL DEFAULT 'DRAFT',

    VerificationStatus ENUM(
        'PENDING',
        'APPROVED',
        'REJECTED'
    ) NOT NULL DEFAULT 'PENDING',

    VerificationRemark TEXT,
    VerifiedBy BIGINT NULL,
    VerifiedAt DATETIME NULL,

    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT FK_Jobs_Employers
        FOREIGN KEY (EmployerID)
        REFERENCES employers(EmployerID)
        ON DELETE CASCADE,

    CONSTRAINT FK_Jobs_Categories
        FOREIGN KEY (CategoryID)
        REFERENCES categories(CategoryID)
        ON DELETE RESTRICT,

    CONSTRAINT FK_Jobs_VerifiedBy
        FOREIGN KEY (VerifiedBy)
        REFERENCES university_officers(OfficerID)
        ON DELETE SET NULL
);
```

---

# 7. JOB APPLICATIONS

```sql
CREATE TABLE job_applications (
    ApplicationID BIGINT AUTO_INCREMENT PRIMARY KEY,

    JobID BIGINT NOT NULL,
    StudentID BIGINT NOT NULL,

    Status ENUM(
        'PENDING',
        'ACCEPTED',
        'REJECTED'
    ) NOT NULL DEFAULT 'PENDING',

    AppliedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ReviewedAt DATETIME NULL,
    EmployerRemark TEXT,

    CONSTRAINT FK_Applications_Jobs
        FOREIGN KEY (JobID)
        REFERENCES jobs(JobID)
        ON DELETE CASCADE,

    CONSTRAINT FK_Applications_Students
        FOREIGN KEY (StudentID)
        REFERENCES students(StudentID)
        ON DELETE CASCADE,

    -- ป้องกันนักศึกษาสมัครงานเดิมซ้ำ
    CONSTRAINT UQ_Job_Student
        UNIQUE (JobID, StudentID)
);
```

---

# 8. STUDENT AVAILABILITIES

```sql
CREATE TABLE student_availabilities (
    AvailabilityID BIGINT AUTO_INCREMENT PRIMARY KEY,

    StudentID BIGINT NOT NULL,

    DayOfWeek ENUM(
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
        'SUNDAY'
    ) NOT NULL,

    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,

    IsAvailable BOOLEAN NOT NULL DEFAULT TRUE,

    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT FK_Availability_Students
        FOREIGN KEY (StudentID)
        REFERENCES students(StudentID)
        ON DELETE CASCADE
);
```

---

# 9. EMPLOYER VERIFICATIONS

```sql
CREATE TABLE employer_verifications (
    VerificationID BIGINT AUTO_INCREMENT PRIMARY KEY,

    EmployerID BIGINT NOT NULL,
    OfficerID BIGINT NOT NULL,

    Status ENUM(
        'APPROVED',
        'REJECTED'
    ) NOT NULL,

    Remark TEXT,

    VerifiedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT FK_EmpVerify_Employer
        FOREIGN KEY (EmployerID)
        REFERENCES employers(EmployerID)
        ON DELETE CASCADE,

    CONSTRAINT FK_EmpVerify_Officer
        FOREIGN KEY (OfficerID)
        REFERENCES university_officers(OfficerID)
        ON DELETE RESTRICT
);
```

---

# 10. JOB VERIFICATIONS

```sql
CREATE TABLE job_verifications (
    JobVerificationID BIGINT AUTO_INCREMENT PRIMARY KEY,

    JobID BIGINT NOT NULL,
    OfficerID BIGINT NOT NULL,

    Status ENUM(
        'APPROVED',
        'REJECTED'
    ) NOT NULL,

    Remark TEXT,

    VerifiedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT FK_JobVerify_Job
        FOREIGN KEY (JobID)
        REFERENCES jobs(JobID)
        ON DELETE CASCADE,

    CONSTRAINT FK_JobVerify_Officer
        FOREIGN KEY (OfficerID)
        REFERENCES university_officers(OfficerID)
        ON DELETE RESTRICT
);
```

---



---

# INDEXES

```sql
-- Jobs
CREATE INDEX IDX_Jobs_Employer
ON jobs(EmployerID);

CREATE INDEX IDX_Jobs_Category
ON jobs(CategoryID);

CREATE INDEX IDX_Jobs_Status
ON jobs(Status);

CREATE INDEX IDX_Jobs_Verification
ON jobs(VerificationStatus);

CREATE INDEX IDX_Jobs_Search
ON jobs(JobTitle, Location);

-- Job Applications
CREATE INDEX IDX_Applications_Job
ON job_applications(JobID);

CREATE INDEX IDX_Applications_Student
ON job_applications(StudentID);

CREATE INDEX IDX_Applications_Status
ON job_applications(Status);

-- Student Availability
CREATE INDEX IDX_Availability_Student
ON student_availabilities(StudentID);

-- Employer Verification
CREATE INDEX IDX_Employer_Verification
ON employers(VerificationStatus);


# Database Tables Summary

| No. | Table | Description |
|---:|---|---|
| 1 | `users` | ข้อมูลบัญชีผู้ใช้งาน |
| 2 | `students` | ข้อมูลนักศึกษา |
| 3 | `university_officers` | ข้อมูลเจ้าหน้าที่มหาวิทยาลัย |
| 4 | `employers` | ข้อมูลผู้ประกอบการ |
| 5 | `categories` | หมวดหมู่งาน |
| 6 | `jobs` | ข้อมูลประกาศงาน |
| 7 | `job_applications` | ข้อมูลการสมัครงาน |
| 8 | `student_availabilities` | ช่วงเวลาที่นักศึกษาสะดวกทำงาน |
| 9 | `employer_verifications` | ประวัติการตรวจสอบผู้ประกอบการ |
| 10 | `job_verifications` | ประวัติการตรวจสอบประกาศงาน |

---

# 11. COMPLAINTS (FR-04 ความปลอดภัยและการร้องเรียน)

```sql
CREATE TABLE complaints (
    ComplaintID BIGINT AUTO_INCREMENT PRIMARY KEY,
    UserID BIGINT NOT NULL,
    JobID BIGINT NULL,

    Title VARCHAR(200) NOT NULL,
    Category VARCHAR(100) NOT NULL,
    Description TEXT NOT NULL,

    Status ENUM(
        'PENDING',
        'INVESTIGATING',
        'RESOLVED',
        'DISMISSED'
    ) NOT NULL DEFAULT 'PENDING',

    OfficerRemark TEXT,
    ResolvedBy BIGINT NULL,

    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT FK_Complaints_User
        FOREIGN KEY (UserID)
        REFERENCES users(UserID)
        ON DELETE CASCADE,

    CONSTRAINT FK_Complaints_Job
        FOREIGN KEY (JobID)
        REFERENCES jobs(JobID)
        ON DELETE SET NULL,

    CONSTRAINT FK_Complaints_ResolvedBy
        FOREIGN KEY (ResolvedBy)
        REFERENCES university_officers(OfficerID)
        ON DELETE SET NULL
);
```

| 11 | `complaints` | ข้อมูลเรื่องร้องเรียนและรายงานความไม่ปลอดภัย |
