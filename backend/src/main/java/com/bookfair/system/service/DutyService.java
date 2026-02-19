package com.bookfair.system.service;

import com.bookfair.system.entity.Duty;
import com.bookfair.system.entity.DutyStatus;
import com.bookfair.system.entity.User;
import com.bookfair.system.repository.DutyRepository;
import com.bookfair.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DutyService {

    private final DutyRepository dutyRepository;
    private final UserRepository userRepository;

    public List<Duty> getAllDuties() {
        return dutyRepository.findAll();
    }

    public List<Duty> getDutiesByUserId(Long userId) {
        return dutyRepository.findByAssignedToId(userId);
    }

    public Duty createDuty(Duty duty, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        duty.setAssignedTo(user);
        duty.setStatus(DutyStatus.ASSIGNED);
        return dutyRepository.save(duty);
    }

    public Duty updateDuty(Long id, Duty dutyDetails, Long userId) {
        Duty duty = dutyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Duty not found with id: " + id));

        duty.setDescription(dutyDetails.getDescription());
        duty.setStartTime(dutyDetails.getStartTime());
        duty.setEndTime(dutyDetails.getEndTime());
        duty.setStatus(dutyDetails.getStatus());

        if (userId != null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
            duty.setAssignedTo(user);
        }

        return dutyRepository.save(duty);
    }

    public void deleteDuty(Long id) {
        Duty duty = dutyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Duty not found with id: " + id));
        dutyRepository.delete(duty);
    }
}
