package com.group2.studentjob.dto.student;

import com.group2.studentjob.entity.enums.DayOfWeek;
import lombok.Data;
import java.time.LocalTime;

@Data
public class AvailabilityRequest {
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean isAvailable;
}