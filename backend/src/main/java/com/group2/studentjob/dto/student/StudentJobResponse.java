package com.group2.studentjob.dto.student;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public class StudentJobResponse {

    private Long jobId;
    private Long employerId;
    private String companyName;

    private Long categoryId;
    private String categoryName;

    private String jobTitle;
    private String description;
    private String location;
    private BigDecimal salary;
    private String qualification;

    private LocalDate jobDate;
    private LocalTime startTime;
    private LocalTime endTime;

    private String status;
    private String verificationStatus;

    // เก็บสถานะการสมัครงานของนักศึกษา
    private String applicationStatus;

    public StudentJobResponse() {
    }

    public StudentJobResponse(
            Long jobId,
            Long employerId,
            String companyName,
            Long categoryId,
            String categoryName,
            String jobTitle,
            String description,
            String location,
            BigDecimal salary,
            String qualification,
            LocalDate jobDate,
            LocalTime startTime,
            LocalTime endTime,
            String status,
            String verificationStatus,
            String applicationStatus
    ) {
        this.jobId = jobId;
        this.employerId = employerId;
        this.companyName = companyName;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.jobTitle = jobTitle;
        this.description = description;
        this.location = location;
        this.salary = salary;
        this.qualification = qualification;
        this.jobDate = jobDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
        this.verificationStatus = verificationStatus;

        // กำหนดสถานะการสมัครงาน
        this.applicationStatus = applicationStatus;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public Long getEmployerId() {
        return employerId;
    }

    public void setEmployerId(Long employerId) {
        this.employerId = employerId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public BigDecimal getSalary() {
        return salary;
    }

    public void setSalary(BigDecimal salary) {
        this.salary = salary;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public LocalDate getJobDate() {
        return jobDate;
    }

    public void setJobDate(LocalDate jobDate) {
        this.jobDate = jobDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public String getApplicationStatus() {
        return applicationStatus;
    }

    public void setApplicationStatus(String applicationStatus) {
        this.applicationStatus = applicationStatus;
    }
}
