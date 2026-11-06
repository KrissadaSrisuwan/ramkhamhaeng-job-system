package com.group2.studentjob.dto.employer;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class JobRequest {

    private Long categoryId;
    private String jobTitle;
    private String description;
    private String location;
    private BigDecimal salary;
    private String qualification;
    private LocalDate jobDate;
    private LocalTime startTime;
    private LocalTime endTime;
}