package com.group2.studentjob.dto.employer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobResponse {

    private Long jobId;
    private Long employerId;
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
    private String verificationRemark;
}