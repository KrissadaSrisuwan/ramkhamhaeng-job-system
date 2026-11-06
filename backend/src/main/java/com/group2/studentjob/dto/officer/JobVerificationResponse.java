package com.group2.studentjob.dto.officer;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JobVerificationResponse {

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
    private Long verifiedBy;
    private LocalDateTime verifiedAt;
    private String verificationRemark;
}