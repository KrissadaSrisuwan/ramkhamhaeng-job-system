package com.group2.studentjob.config;

import com.group2.studentjob.entity.UniversityOfficer;
import com.group2.studentjob.entity.User;
import com.group2.studentjob.entity.enums.UserRole;
import com.group2.studentjob.entity.enums.UserStatus;
import com.group2.studentjob.repository.UniversityOfficerRepository;
import com.group2.studentjob.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner createOfficer(UserRepository userRepository, UniversityOfficerRepository officerRepository, PasswordEncoder passwordEncoder) {
        return args -> {

            // ตรวจสอบว่ามี User officer01 แล้วหรือยัง
            User officerUser = userRepository
                    .findByUsername("officer01")
                    .orElseGet(() -> {

                        User newUser = User.builder()
                                .username("officer01")
                                .passwordHash(passwordEncoder.encode("123456"))
                                .role(UserRole.OFFICER)
                                .status(UserStatus.ACTIVE)
                                .build();

                        return userRepository.save(newUser);
                    });

            // ตรวจสอบว่ามี UniversityOfficer ของ User นี้แล้วหรือยัง
            if (officerRepository.findByUserUserId(officerUser.getUserId()).isEmpty()) {

                UniversityOfficer officer = UniversityOfficer.builder()
                        .user(officerUser)
                        .firstName("เจ้าหน้าที่")
                        .lastName("มหาวิทยาลัย")
                        .phone("0812345678")
                        .email("officer@ru.ac.th")
                        .profileImage(null)
                        .build();

                officerRepository.save(officer);
            }
        };
    }
}