package com.group2.studentjob.dto.employer;

public class ApplicationReviewRequest {

    private String status;
    private String employerRemark;

    public ApplicationReviewRequest() {
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getEmployerRemark() {
        return employerRemark;
    }

    public void setEmployerRemark(String employerRemark) {
        this.employerRemark = employerRemark;
    }
}