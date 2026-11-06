package com.group2.studentjob.dto.employer;

public class StudentApplicantResponse {

    private Long studentId;
    private String studentCode;
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private String faculty;
    private String major;
    private Integer yearOfStudy;
    private String profileImage;

    public StudentApplicantResponse(Long studentId, String studentCode, String firstName, String lastName, String phone, String email, String faculty, String major, Integer yearOfStudy, String profileImage) {
        this.studentId = studentId;
        this.studentCode = studentCode;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.email = email;
        this.faculty = faculty;
        this.major = major;
        this.yearOfStudy = yearOfStudy;
        this.profileImage = profileImage;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFaculty() {
        return faculty;
    }

    public void setFaculty(String faculty) {
        this.faculty = faculty;
    }

    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major;
    }

    public Integer getYearOfStudy() {
        return yearOfStudy;
    }

    public void setYearOfStudy(Integer yearOfStudy) {
        this.yearOfStudy = yearOfStudy;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }
}