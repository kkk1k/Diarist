package com.hanium.diarist.domain.user.service;

import com.hanium.diarist.domain.user.domain.SocialCode;
import com.hanium.diarist.domain.user.domain.User;
import com.hanium.diarist.domain.user.exception.UserNotFoundException;
import com.hanium.diarist.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class ValidateUserService {
    private final UserRepository userRepository;

    public User validateRegisteredUserByEmail(String email, SocialCode socialCode){
        return userRepository.findAllByEmailAndSocialCode(email,socialCode).stream().findFirst().orElse(null);
    }

    public User validateUserById(Long userId) {
        return userRepository.findByUserId(userId).orElseThrow(UserNotFoundException::new);
    }

}
