package com.hanium.diarist.domain.oauth.service;

import com.hanium.diarist.common.exception.BusinessException;
import com.hanium.diarist.domain.oauth.repository.AuthRepository;
import com.hanium.diarist.domain.user.domain.SocialCode;
import com.hanium.diarist.domain.user.domain.User;
import com.hanium.diarist.domain.user.service.ValidateUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.hanium.diarist.common.exception.ErrorCode.INTERNAL_SERVER_ERROR;


@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class OAuthService {

    private final KakaoOauthService kakaoOauthService;
    private final GoogleOauthService googleOauthService;
    private final ValidateUserService validateUserService;
    private final AuthRepository authRepository;

    @Transactional
    public void deleteAccount(Long userId){
        User user = validateUserService.validateUserById(userId);

        if(user.getSocialCode() == SocialCode.KAKAO){
            kakaoOauthService.deleteAccount(user);
            deleteAuth(user);
        }else if(user.getSocialCode() == SocialCode.GOOGLE){
            googleOauthService.deleteAccount(user);
            deleteAuth(user);
        }else{
            throw new BusinessException(INTERNAL_SERVER_ERROR);
        }
    }

    private void deleteAuth(User user){
        authRepository.deleteByUser(user);
    }

    @Transactional
    public void logout(Long userId) {
        User user = validateUserService.validateUserById(userId);
        deleteAuth(user);
    }
}
