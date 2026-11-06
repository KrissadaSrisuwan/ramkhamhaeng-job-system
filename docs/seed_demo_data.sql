USE ram_parttime_job;

-- 1. Officer
INSERT INTO users (UserID, Username, PasswordHash, Role, Status, CreatedAt, UpdatedAt)
VALUES (1, 'officer01', '$2a$10$PnqcgE6UaPs4efo2Add2keA2d51m/xx1SxEmk/vfS0e9FOcYyZe9a', 'OFFICER', 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE PasswordHash = VALUES(PasswordHash);

INSERT INTO university_officers (OfficerID, UserID, FirstName, LastName, Phone, Email, ProfileImage, CreatedAt, UpdatedAt)
VALUES (1, 1, 'ดร.สมเกียรติ', 'มีสุข (กองกิจการนักศึกษา)', '02-310-8000', 'officer@ru.ac.th', NULL, NOW(), NOW())
ON DUPLICATE KEY UPDATE FirstName = VALUES(FirstName), LastName = VALUES(LastName);

-- 2. Categories
INSERT INTO categories (CategoryID, CategoryName, Description, CreatedAt) VALUES
(1, 'ร้านอาหารและเครื่องดื่ม', 'พนักงานเสิร์ฟ ชงกาแฟ บาริสต้า พนักงานครัว', NOW()),
(2, 'ร้านสะดวกซื้อและค้าปลีก', 'พนักงานแคชเชียร์ จัดเรียงสินค้า บริการลูกค้า', NOW()),
(3, 'งานธุรการและสำนักงาน', 'คีย์ข้อมูล จัดการเอกสาร ประสานงานทั่วไป', NOW()),
(4, 'ติวเตอร์และผู้ช่วยสอน', 'สอนพิเศษระดับประถม-มัธยม ผู้ช่วยวิจัย', NOW()),
(5, 'งานอีเวนต์และกิจกรรม', 'Staff ต้อนรับ สตาฟจัดงานสัมมนา ม.ร.', NOW())
ON DUPLICATE KEY UPDATE CategoryName = VALUES(CategoryName), Description = VALUES(Description);

-- 3. Employers
-- Employer 1: Amazon Cafe (APPROVED)
INSERT INTO users (UserID, Username, PasswordHash, Role, Status, CreatedAt, UpdatedAt)
VALUES (2, 'employer01', '$2a$10$PnqcgE6UaPs4efo2Add2keA2d51m/xx1SxEmk/vfS0e9FOcYyZe9a', 'EMPLOYER', 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE PasswordHash = VALUES(PasswordHash);

INSERT INTO employers (EmployerID, UserID, CompanyName, ContactName, Phone, Email, Address, CompanyDescription, VerificationStatus, VerifiedBy, VerifiedAt, CreatedAt, UpdatedAt)
VALUES (1, 2, 'ร้านกาแฟ คาเฟ่ อเมซอน (สาขา ม.รามคำแหง 1 หัวหมาก)', 'คุณวิภา สุขใจ', '081-999-8888', 'contact@amazon-ru.com', 'ชั้น 1 อาคารกิจกรรมนักศึกษา มหาวิทยาลัยรามคำแหง หัวหมาก', 'ร้านกาแฟสดและเครื่องดื่มเพื่อสุขภาพ บริการนักศึกษาและบุคลากร ม.รามคำแหง', 'APPROVED', 1, NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE CompanyName = VALUES(CompanyName), VerificationStatus = 'APPROVED';

-- Employer 2: CP All (APPROVED)
INSERT INTO users (UserID, Username, PasswordHash, Role, Status, CreatedAt, UpdatedAt)
VALUES (3, 'employer02', '$2a$10$PnqcgE6UaPs4efo2Add2keA2d51m/xx1SxEmk/vfS0e9FOcYyZe9a', 'EMPLOYER', 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE PasswordHash = VALUES(PasswordHash);

INSERT INTO employers (EmployerID, UserID, CompanyName, ContactName, Phone, Email, Address, CompanyDescription, VerificationStatus, VerifiedBy, VerifiedAt, CreatedAt, UpdatedAt)
VALUES (2, 3, 'เซเว่น อีเลฟเว่น (สาขาหน้า ม.รามคำแหง)', 'คุณธีระพงษ์ มั่นคง', '089-777-6655', 'seven_ru@cpall.co.th', 'ถนนรามคำแหง แขวงหัวหมาก เขตบางกะปิ กรุงเทพฯ', 'ร้านสะดวกซื้อเปิดให้บริการ 24 ชม. สนับสนุนงานพาร์ตไทม์แก่นักศึกษา ม.ร.', 'APPROVED', 1, NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE CompanyName = VALUES(CompanyName), VerificationStatus = 'APPROVED';

-- Employer 3: Ram Bakery (PENDING)
INSERT INTO users (UserID, Username, PasswordHash, Role, Status, CreatedAt, UpdatedAt)
VALUES (4, 'employer03', '$2a$10$PnqcgE6UaPs4efo2Add2keA2d51m/xx1SxEmk/vfS0e9FOcYyZe9a', 'EMPLOYER', 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE PasswordHash = VALUES(PasswordHash);

INSERT INTO employers (EmployerID, UserID, CompanyName, ContactName, Phone, Email, Address, CompanyDescription, VerificationStatus, VerifiedBy, VerifiedAt, CreatedAt, UpdatedAt)
VALUES (3, 4, 'รามเบเกอรี่แอนด์คอฟฟี่ (สาขาบางนา)', 'คุณนฤมล ชื่นชม', '086-555-4433', 'rambakery@gmail.com', 'ใกล้ ม.รามคำแหง 2 (บางนา) แขวงดอกไม้ เขตประเวศ', 'ร้านขนมปังและเค้กโฮมเมด ต้องการรับสมัครผู้ช่วยหน้าร้านช่วงเย็น', 'PENDING', NULL, NULL, NOW(), NOW())
ON DUPLICATE KEY UPDATE CompanyName = VALUES(CompanyName), VerificationStatus = 'PENDING';

-- 4. Student (student01)
UPDATE students 
SET FirstName = 'สมชาย', LastName = 'สายขยัน', Faculty = 'บริหารธุรกิจ', Major = 'การตลาด', YearOfStudy = 2, Phone = '089-123-4567', Email = 'somchai@rumail.ru.ac.th'
WHERE StudentCode = '6605001234';

-- 5. Student Availabilities
DELETE FROM student_availabilities WHERE StudentID = (SELECT StudentID FROM students WHERE StudentCode = '6605001234');
INSERT INTO student_availabilities (StudentID, DayOfWeek, StartTime, EndTime, IsAvailable, CreatedAt, UpdatedAt)
VALUES
((SELECT StudentID FROM students WHERE StudentCode = '6605001234'), 'MONDAY', '17:00:00', '22:00:00', 1, NOW(), NOW()),
((SELECT StudentID FROM students WHERE StudentCode = '6605001234'), 'WEDNESDAY', '16:00:00', '21:00:00', 1, NOW(), NOW()),
((SELECT StudentID FROM students WHERE StudentCode = '6605001234'), 'SATURDAY', '08:00:00', '18:00:00', 1, NOW(), NOW());

-- 6. Jobs
DELETE FROM jobs WHERE JobID IN (1, 2, 3, 4);
INSERT INTO jobs (JobID, EmployerID, CategoryID, JobTitle, Description, Location, Salary, Qualification, JobDate, StartTime, EndTime, Status, VerificationStatus, VerificationRemark, VerifiedBy, VerifiedAt, CreatedAt, UpdatedAt)
VALUES 
(1, 1, 1, 'พนักงานบริการและชงกาแฟ (Part-Time)', 'ชงเครื่องดื่มตามสูตร ดูแลความสะอาดหน้าร้าน และบริการลูกค้าด้วยรอยยิ้ม ทำงานช่วงเย็นหลังเลิกเรียน เหมาะสำหรับนักศึกษา', 'ม.รามคำแหง 1 (หัวหมาก)', 450.00, 'นักศึกษา ม.รามคำแหง ทุกชั้นปี ขยัน ตรงต่อเวลา ไม่จำเป็นต้องมีประสบการณ์มีสอนงาน', CURDATE() + INTERVAL 2 DAY, '17:30:00', '21:30:00', 'OPEN', 'APPROVED', 'ผ่านเกณฑ์ความปลอดภัยและค่าตอบแทนตามกฎหมาย', 1, NOW(), NOW(), NOW()),
(2, 2, 2, 'พนักงานแคชเชียร์และจัดเรียงสินค้า', 'ดูแลเคาน์เตอร์แคชเชียร์ เติมสินค้าบนชั้นวาง ตรวจสอบวันหมดอายุ และดูแลความเรียบร้อยของร้าน', 'ถนนรามคำแหง (หน้า ม.รามคำแหง 1)', 420.00, 'นักศึกษา ม.ร. บุคลิกภาพดี มีความซื่อสัตย์ มีมนุษยสัมพันธ์ดี', CURDATE() + INTERVAL 4 DAY, '16:30:00', '20:30:00', 'OPEN', 'APPROVED', 'เอกสารครบถ้วน', 1, NOW(), NOW(), NOW()),
(3, 1, 5, 'เจ้าหน้าที่ต้อนรับงานสัมมนาวิชาการ ม.รามคำแหง', 'ลงทะเบียนผู้เข้าร่วมงาน แจกเอกสารแนะนำหลักสูตร และอำนวยความสะดวกในห้องประชุม', 'ม.รามคำแหง 1 (หัวหมาก)', 600.00, 'สามารถแต่งกายชุดนักศึกษาถูกระเบียบ สื่อสารคล่องแคล่ว', CURDATE() + INTERVAL 7 DAY, '08:30:00', '17:00:00', 'OPEN', 'APPROVED', 'งานสนับสนุนกิจกรรมภายในมหาวิทยาลัย', 1, NOW(), NOW(), NOW()),
(4, 1, 3, 'ผู้ช่วยคีย์ข้อมูลสต็อกสินค้าช่วงปิดเทอม', 'บันทึกข้อมูลสินค้าลงระบบ Excel และตรวจนับสต็อกวัตถุดิบรายสัปดาห์', 'รามคำแหง', 400.00, 'ใช้โปรแกรม MS Excel ขั้นพื้นฐานได้', CURDATE() + INTERVAL 10 DAY, '13:00:00', '17:00:00', 'DRAFT', 'PENDING', NULL, NULL, NULL, NOW(), NOW());

-- 7. Job Applications
DELETE FROM job_applications WHERE ApplicationID IN (1, 2);
INSERT INTO job_applications (ApplicationID, JobID, StudentID, Status, AppliedAt, ReviewedAt, EmployerRemark)
VALUES
(1, 1, (SELECT StudentID FROM students WHERE StudentCode = '6605001234'), 'PENDING', NOW() - INTERVAL 1 DAY, NULL, NULL),
(2, 3, (SELECT StudentID FROM students WHERE StudentCode = '6605001234'), 'ACCEPTED', NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 1 DAY, 'ผ่านการคัดเลือก กรุณานำบัตรนักศึกษามาแสดงในวันรายงานตัวเวลา 08.00 น.');

-- 8. Complaints (FR-04)
DELETE FROM complaints WHERE ComplaintID IN (1, 2);
INSERT INTO complaints (ComplaintID, UserID, JobID, Title, Category, Description, Status, OfficerRemark, ResolvedBy, CreatedAt, UpdatedAt)
VALUES
(1, 11, 1, 'เลิกงานช้ากว่าเวลาที่ระบุ 1 ชั่วโมงโดยไม่คิดค่าล่วงเวลา', 'ค่าจ้างและผลตอบแทนไม่เป็นไปตามข้อตกลง', 'ในประกาศระบุเลิกงาน 21.30 น. แต่หน้างานให้ช่วยล้างเครื่องและปิดร้านถึง 22.30 น. โดยไม่มีค่าล่วงเวลาหรืออาหารเย็นให้', 'INVESTIGATING', 'เจ้าหน้าที่งานแนะแนวได้ติดต่อผู้จัดการสาขาเพื่อตรวจสอบบันทึกเวลาสแกนนิ้ว และผู้ประกอบการตกลงจ่ายค่าล่วงเวลาทบในงวดนี้', 1, NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 1 DAY),
(2, 11, NULL, 'ซอยทางเดินด้านหลัง ม.ราม มืดและเปลี่ยวช่วงเลิกงานรอบดึก', 'ความปลอดภัยในสถานที่ทำงาน', 'ถนนซอยรามคำแหง 24 ช่วงทางออกประตูด้านหลัง มหาวิทยาลัย ไฟทางดับหลายดวง นักศึกษาที่เลิกงานพาร์ตไทม์ 22.00 น. เดินทางกลับลำบากและเสี่ยงอันตราย', 'PENDING', NULL, NULL, NOW() - INTERVAL 6 HOUR, NOW() - INTERVAL 6 HOUR);
