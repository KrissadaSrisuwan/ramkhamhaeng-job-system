package com.group2.studentjob.dto.employer;

import java.time.LocalDateTime;

public class EmployerApplicationResponse {

    private Long applicationId;
    private Long jobId;
    private String jobTitle;
    private Long studentId;
    private String studentCode;
    private String firstName;
    private String lastName;
    private String profileImage;
    private String status;
    private LocalDateTime appliedAt;
    private LocalDateTime reviewedAt;
    private String employerRemark;

    public EmployerApplicationResponse(
            Long applicationId,
            Long jobId,
            String jobTitle,
            Long studentId,
            String studentCode,
            String firstName,
            String lastName,
            String profileImage,
            String status,
            LocalDateTime appliedAt,
            LocalDateTime reviewedAt,
            String employerRemark
    ) {
        this.applicationId = applicationId;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.studentId = studentId;
        this.studentCode = studentCode;
        this.firstName = firstName;
        this.lastName = lastName;
        this.profileImage = profileImage;
        this.status = status;
        this.appliedAt = appliedAt;
        this.reviewedAt = reviewedAt;
        this.employerRemark = employerRemark;
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentCode() {
        return studentCode;
    }

    public void setStudentCode(String studentCode) {
        this.studentCode = studentCode;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }

    public String getEmployerRemark() {
        return employerRemark;
    }

    public void setEmployerRemark(String employerRemark) {
        this.employerRemark = employerRemark;
    }
}
