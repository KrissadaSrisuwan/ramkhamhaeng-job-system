# 2.7 รายงานการทดสอบ (Bug Report)
## ระบบจัดหางานพาร์ตไทม์ มหาวิทยาลัยรามคำแหง (Ramkhamhaeng Part-Time Job System)

เอกสารรายงานข้อผิดพลาดและการแก้ไขระบบ (Bug Report) จัดทำขึ้นตามแบบฟอร์มมาตรฐานรายงานการทดสอบซอฟต์แวร์ เพื่อบันทึกปัญหาที่ตรวจพบ การวิเคราะห์สาเหตุ การดำเนินการแก้ไข และผลการทดสอบซ้ำ (Retest) ตามข้อกำหนด FR-01 ถึง FR-04 และ NFR-01 ถึง NFR-03

---

### Bug Report 1

**Bug Report**

**Project Name :** <u>ระบบจัดหางานพาร์ตไทม์ มหาวิทยาลัยรามคำแหง</u> &nbsp;&nbsp;&nbsp;&nbsp; **ID :** <u>P-001</u>  
**Module Name :** <u>User & Authentication Module</u> &nbsp;&nbsp;&nbsp;&nbsp; **ID :** <u>N-01-001</u>  
**Program Name :** <u>Register & Profile Program</u> &nbsp;&nbsp;&nbsp;&nbsp; **ID :** <u>P-01-001</u>  
**Tester :** <u>Peearpar Phusitsawat</u> &nbsp;&nbsp;&nbsp;&nbsp; **Date :** <u>01/11/69</u> &nbsp;&nbsp;&nbsp;&nbsp; **Assigned To :** <u>Apinya Khachonboon</u>  
**Bug No :** <u>B-001</u> &nbsp;&nbsp;&nbsp;&nbsp; **Title :** <u>การตรวจสอบรหัสนักศึกษาและข้อมูลคณะในฟอร์มลงทะเบียน</u>  
**Description :** <u>นักศึกษาสามารถกดลงทะเบียนได้โดยกรอกรหัสนักศึกษาไม่ครบ 10 หลัก หรือเว้นว่างข้อมูลสังกัดคณะ ทำให้เกิดข้อผิดพลาดในการนำข้อมูลไปใช้คัดกรองงานและการจับคู่ Smart Match</u>  
**Resolution :** **[Fixed]** &nbsp;&nbsp;&nbsp;&nbsp; Duplicate &nbsp;&nbsp;&nbsp;&nbsp; Can't Fix &nbsp;&nbsp;&nbsp;&nbsp; Won't Fix  
**Date Resolve :** <u>02/11/69</u> &nbsp;&nbsp;&nbsp;&nbsp; **Resolved by :** <u>Apinya Khachonboon</u> &nbsp;&nbsp;&nbsp;&nbsp; **Version :** <u>0.0.1</u>  
**Resolution Comment :** <u>เพิ่มระบบ Input Validation ฝั่ง Frontend สำหรับตรวจสอบรหัสนักศึกษา 10 หลัก และบังคับเลือกคณะ/สาขาวิชาก่อนส่งข้อมูล พร้อมทั้งเพิ่มการตรวจสอบความถูกต้องบน Backend API</u>  
**Retested By :** <u>Peearpar Phusitsawat</u> &nbsp;&nbsp;&nbsp;&nbsp; **Version Tested :** <u>0.0.1</u> &nbsp;&nbsp;&nbsp;&nbsp; **Date Tested :** <u>03/11/69</u>  
**Retest Comment :** <u>ทดสอบกรอกรหัสไม่ครบระบบแสดงข้อความเตือนชัดเจน เมื่อกรอกข้อมูลถูกต้องระบบบันทึกและเข้าสู่ระบบได้สมบูรณ์</u>  

---

### Bug Report 2

**Bug Report**

**Project Name :** <u>ระบบจัดหางานพาร์ตไทม์ มหาวิทยาลัยรามคำแหง</u> &nbsp;&nbsp;&nbsp;&nbsp; **ID :** <u>P-001</u>  
**Module Name :** <u>Job Search & Availability Module</u> &nbsp;&nbsp;&nbsp;&nbsp; **ID :** <u>N-02-001</u>  
**Program Name :** <u>Job Search & Smart Match Program</u> &nbsp;&nbsp;&nbsp;&nbsp; **ID :** <u>P-02-001</u>  
**Tester :** <u>Peearpar Phusitsawat</u> &nbsp;&nbsp;&nbsp;&nbsp; **Date :** <u>02/11/69</u> &nbsp;&nbsp;&nbsp;&nbsp; **Assigned To :** <u>Apinya Khachonboon</u>  
**Bug No :** <u>B-002</u> &nbsp;&nbsp;&nbsp;&nbsp; **Title :** <u>ระบบ Smart Match ไม่กรองงานตามช่วงเวลาว่างจริงของนักศึกษา</u>  
**Description :** <u>เมื่อเปิดใช้งานปุ่มสวิตช์ Smart Match ในหน้าค้นหางาน ระบบยังคงแสดงตำแหน่งงานทั้งหมด ไม่ได้นำวันและเวลาว่างที่นักศึกษาบันทึกไว้ในตารางเวลาว่างมาเปรียบเทียบกับตารางเวลาของงาน</u>  
**Resolution :** **[Fixed]** &nbsp;&nbsp;&nbsp;&nbsp; Duplicate &nbsp;&nbsp;&nbsp;&nbsp; Can't Fix &nbsp;&nbsp;&nbsp;&nbsp; Won't Fix  
**Date Resolve :** <u>03/11/69</u> &nbsp;&nbsp;&nbsp;&nbsp; **Resolved by :** <u>Apinya Khachonboon</u> &nbsp;&nbsp;&nbsp;&nbsp; **Version :** <u>0.0.1</u>  
**Resolution Comment :** <u>ปรับปรุงฟังก์ชันใน StudentJobService โดยดึงข้อมูล Availability ของนักศึกษามาเปรียบเทียบกับ WorkDays และ WorkHours ของแต่ละตำแหน่งงาน และส่งกลับเฉพาะงานที่เวลาตรงกันอย่างรวดเร็ว</u>  
**Retested By :** <u>Peearpar Phusitsawat</u> &nbsp;&nbsp;&nbsp;&nbsp; **Version Tested :** <u>0.0.1</u> &nbsp;&nbsp;&nbsp;&nbsp; **Date Tested :** <u>04/11/69</u>  
**Retest Comment :** <u>ทดสอบตั้งเวลาว่างวันจันทร์และวันพุธ ระบบแสดงเฉพาะงานที่ตรงกับวันดังกล่าว และตัวกรองพื้นที่รอบ ม.รามคำแหง (หัวหมาก/บางนา) ทำงานถูกต้อง</u>  

---

### Bug Report 3

**Bug Report**

**Project Name :** <u>ระบบจัดหางานพาร์ตไทม์ มหาวิทยาลัยรามคำแหง</u> &nbsp;&nbsp;&nbsp;&nbsp; **ID :** <u>P-001</u>  
**Module Name :** <u>Job Posting & Verification Module</u> &nbsp;&nbsp;&nbsp;&nbsp; **ID :** <u>N-03-001</u>  
**Program Name :** <u>Employer Job Management Program</u> &nbsp;&nbsp;&nbsp;&nbsp; **ID :** <u>P-03-001</u>  
**Tester :** <u>Peearpar Phusitsawat</u> &nbsp;&nbsp;&nbsp;&nbsp; **Date :** <u>03/11/69</u> &nbsp;&nbsp;&nbsp;&nbsp; **Assigned To :** <u>Apinya Khachonboon</u>  
**Bug No :** <u>B-003</u> &nbsp;&nbsp;&nbsp;&nbsp; **Title :** <u>ผู้ประกอบการที่ยังไม่ได้รับการอนุมัติสามารถสร้างประกาศงานได้</u>  
**Description :** <u>ผู้ประกอบการที่เพิ่งลงทะเบียนและมีสถานะเป็น PENDING (รอการตรวจสอบ) สามารถกดสร้างและบันทึกประกาศงานได้ ซึ่งไม่สอดคล้องกับมาตรการความปลอดภัยของมหาวิทยาลัยตามข้อกำหนด FR-03 และ FR-04</u>  
**Resolution :** **[Fixed]** &nbsp;&nbsp;&nbsp;&nbsp; Duplicate &nbsp;&nbsp;&nbsp;&nbsp; Can't Fix &nbsp;&nbsp;&nbsp;&nbsp; Won't Fix  
**Date Resolve :** <u>04/11/69</u> &nbsp;&nbsp;&nbsp;&nbsp; **Resolved by :** <u>Apinya Khachonboon</u> &nbsp;&nbsp;&nbsp;&nbsp; **Version :** <u>0.0.1</u>  
**Resolution Comment :** <u>เพิ่มการตรวจสอบสิทธิ์ verificationStatus == APPROVED ใน EmployerJobService ฝั่ง Backend และเพิ่ม Guard เงื่อนไขในหน้า EmployerJobs.jsx เพื่อล็อกปุ่มสร้างงานพร้อมแสดงแบนเนอร์แจ้งเตือน</u>  
**Retested By :** <u>Peearpar Phusitsawat</u> &nbsp;&nbsp;&nbsp;&nbsp; **Version Tested :** <u>0.0.1</u> &nbsp;&nbsp;&nbsp;&nbsp; **Date Tested :** <u>04/11/69</u>  
**Retest Comment :** <u>ทดสอบด้วยบัญชีผู้ประกอบการใหม่ ปุ่มสร้างงานถูกล็อกและมีคำเตือนชัดเจน เมื่อบัญชีได้รับการอนุมัติจากเจ้าหน้าที่แล้วจึงสามารถประกาศงานได้ตามปกติ</u>  

---

### Bug Report 4

**Bug Report**

**Project Name :** <u>ระบบจัดหางานพาร์ตไทม์ มหาวิทยาลัยรามคำแหง</u> &nbsp;&nbsp;&nbsp;&nbsp; **ID :** <u>P-001</u>  
**Module Name :** <u>Safety & Complaint Module</u> &nbsp;&nbsp;&nbsp;&nbsp; **ID :** <u>N-04-001</u>  
**Program Name :** <u>Complaint Management Program</u> &nbsp;&nbsp;&nbsp;&nbsp; **ID :** <u>P-04-001</u>  
**Tester :** <u>Peearpar Phusitsawat</u> &nbsp;&nbsp;&nbsp;&nbsp; **Date :** <u>03/11/69</u> &nbsp;&nbsp;&nbsp;&nbsp; **Assigned To :** <u>Apinya Khachonboon</u>  
**Bug No :** <u>B-004</u> &nbsp;&nbsp;&nbsp;&nbsp; **Title :** <u>ไม่มีระบบรายงานปัญหาและส่งเรื่องร้องเรียนความปลอดภัยสำหรับนักศึกษา</u>  
**Description :** <u>ระบบยังขาดเอนทิตี ฐานข้อมูล และหน้าจอสำหรับให้นักศึกษาส่งเรื่องร้องเรียนเมื่อพบงานที่ไม่ปลอดภัย หรือถูกเอารัดเอาเปรียบเรื่องค่าจ้างจากผู้ประกอบการตามข้อกำหนด FR-04</u>  
**Resolution :** **[Fixed]** &nbsp;&nbsp;&nbsp;&nbsp; Duplicate &nbsp;&nbsp;&nbsp;&nbsp; Can't Fix &nbsp;&nbsp;&nbsp;&nbsp; Won't Fix  
**Date Resolve :** <u>05/11/69</u> &nbsp;&nbsp;&nbsp;&nbsp; **Resolved by :** <u>Apinya Khachonboon</u> &nbsp;&nbsp;&nbsp;&nbsp; **Version :** <u>0.0.1</u>  
**Resolution Comment :** <u>พัฒนาโมดูล Complaint ครบวงจร ได้แก่ สร้างตาราง complaints ในฐานข้อมูล, สร้าง Complaint Entity, Service, Controller และหน้าจอ StudentComplaints.jsx และ OfficerComplaints.jsx</u>  
**Retested By :** <u>Peearpar Phusitsawat</u> &nbsp;&nbsp;&nbsp;&nbsp; **Version Tested :** <u>0.0.1</u> &nbsp;&nbsp;&nbsp;&nbsp; **Date Tested :** <u>05/11/69</u>  
**Retest Comment :** <u>ทดสอบส่งเรื่องร้องเรียนจากหน้ารายละเอียดงาน ข้อมูลส่งถึงเจ้าหน้าที่มหาวิทยาลัย และเจ้าหน้าที่สามารถบันทึกผลการตรวจสอบเปลี่ยนสถานะเป็น RESOLVED ได้สมบูรณ์</u>  

---

### Bug Report 5

**Bug Report**

**Project Name :** <u>ระบบจัดหางานพาร์ตไทม์ มหาวิทยาลัยรามคำแหง</u> &nbsp;&nbsp;&nbsp;&nbsp; **ID :** <u>P-001</u>  
**Module Name :** <u>Application Management Module</u> &nbsp;&nbsp;&nbsp;&nbsp; **ID :** <u>N-03-002</u>  
**Program Name :** <u>Application Review Program</u> &nbsp;&nbsp;&nbsp;&nbsp; **ID :** <u>P-03-002</u>  
**Tester :** <u>Peearpar Phusitsawat</u> &nbsp;&nbsp;&nbsp;&nbsp; **Date :** <u>04/11/69</u> &nbsp;&nbsp;&nbsp;&nbsp; **Assigned To :** <u>Apinya Khachonboon</u>  
**Bug No :** <u>B-005</u> &nbsp;&nbsp;&nbsp;&nbsp; **Title :** <u>ผู้ประกอบการไม่สามารถใส่หมายเหตุตอบกลับในการพิจารณาผู้สมัครงานได้</u>  
**Description :** <u>เมื่อผู้ประกอบการพิจารณาใบสมัครงาน (รับเข้าทำงาน/ปฏิเสธ) ระบบไม่มีช่องให้ระบุหมายเหตุหรือข้อความตอบกลับ ทำให้นักศึกษาไม่ทราบรายละเอียดการนัดสัมภาษณ์งานหรือเหตุผล</u>  
**Resolution :** **[Fixed]** &nbsp;&nbsp;&nbsp;&nbsp; Duplicate &nbsp;&nbsp;&nbsp;&nbsp; Can't Fix &nbsp;&nbsp;&nbsp;&nbsp; Won't Fix  
**Date Resolve :** <u>05/11/69</u> &nbsp;&nbsp;&nbsp;&nbsp; **Resolved by :** <u>Apinya Khachonboon</u> &nbsp;&nbsp;&nbsp;&nbsp; **Version :** <u>0.0.1</u>  
**Resolution Comment :** <u>เพิ่มช่องกรอกหมายเหตุ (Notes/Feedback) ในหน้าต่างพิจารณาผู้สมัครฝั่งผู้ประกอบการ และส่งข้อมูลไปแสดงผลในหน้ารายการสมัครงานของนักศึกษา</u>  
**Retested By :** <u>Peearpar Phusitsawat</u> &nbsp;&nbsp;&nbsp;&nbsp; **Version Tested :** <u>0.0.1</u> &nbsp;&nbsp;&nbsp;&nbsp; **Date Tested :** <u>05/11/69</u>  
**Retest Comment :** <u>ทดสอบระบุวันและเวลานัดสัมภาษณ์ นักศึกษาได้รับการแจ้งเตือนสถานะ ACCEPTED พร้อมข้อความนัดหมายอย่างถูกต้อง</u>  

---

### Bug Report 6

**Bug Report**

**Project Name :** <u>ระบบจัดหางานพาร์ตไทม์ มหาวิทยาลัยรามคำแหง</u> &nbsp;&nbsp;&nbsp;&nbsp; **ID :** <u>P-001</u>  
**Module Name :** <u>Frontend UI & Theme Module</u> &nbsp;&nbsp;&nbsp;&nbsp; **ID :** <u>N-05-001</u>  
**Program Name :** <u>Theme & Navigation Program</u> &nbsp;&nbsp;&nbsp;&nbsp; **ID :** <u>P-05-001</u>  
**Tester :** <u>Peearpar Phusitsawat</u> &nbsp;&nbsp;&nbsp;&nbsp; **Date :** <u>04/11/69</u> &nbsp;&nbsp;&nbsp;&nbsp; **Assigned To :** <u>Apinya Khachonboon</u>  
**Bug No :** <u>B-006</u> &nbsp;&nbsp;&nbsp;&nbsp; **Title :** <u>การจัดรูปแบบสีและการแสดงผล CSS ผิดพลาด ไม่เป็นทางการตามอัตลักษณ์มหาวิทยาลัย</u>  
**Description :** <u>พบข้อผิดพลาด Syntax สัญลักษณ์ `#` ซ้ำ (`##131240`) ในไฟล์ CSS และโทนสีเดิมไม่มีความเป็นทางการ ขาดอัตลักษณ์ของมหาวิทยาลัยรามคำแหง ทำให้อ่านยากและไม่สบายตา (NFR-03)</u>  
**Resolution :** **[Fixed]** &nbsp;&nbsp;&nbsp;&nbsp; Duplicate &nbsp;&nbsp;&nbsp;&nbsp; Can't Fix &nbsp;&nbsp;&nbsp;&nbsp; Won't Fix  
**Date Resolve :** <u>05/11/69</u> &nbsp;&nbsp;&nbsp;&nbsp; **Resolved by :** <u>Apinya Khachonboon</u> &nbsp;&nbsp;&nbsp;&nbsp; **Version :** <u>0.0.1</u>  
**Resolution Comment :** <u>แก้ไขโค้ดสีใน index.css และปรับรูปแบบธีม UI ทั้งระบบให้เป็นสีกรมท่ารามคำแหง (RU Navy: #0B1953) ผสมสีทองคำ (RU Gold: #D4AF37) ปรับตัวอักษรให้อ่านง่าย สบายตา</u>  
**Retested By :** <u>Peearpar Phusitsawat</u> &nbsp;&nbsp;&nbsp;&nbsp; **Version Tested :** <u>0.0.1</u> &nbsp;&nbsp;&nbsp;&nbsp; **Date Tested :** <u>05/11/69</u>  
**Retest Comment :** <u>ตรวจสอบการแสดงผลบนหน้าจอทั้ง 17 หน้า สีสันเป็นทางการ สะอาดตา อ่านง่าย ถูกต้องตามเกณฑ์ Usability ของระบบสถาบันการศึกษา</u>  
