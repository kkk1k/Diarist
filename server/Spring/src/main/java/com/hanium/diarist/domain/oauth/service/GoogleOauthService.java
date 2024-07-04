package com.hanium.diarist.domain.oauth.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hanium.diarist.common.exception.BusinessException;
import com.hanium.diarist.common.exception.ErrorCode;
import com.hanium.diarist.common.security.jwt.JwtTokenProvider;
import com.hanium.diarist.domain.oauth.domain.Auth;
import com.hanium.diarist.domain.oauth.dto.GoogleAccessToken;
import com.hanium.diarist.domain.oauth.dto.GoogleUserProfile;
import com.hanium.diarist.domain.oauth.dto.ResponseJwtToken;
import com.hanium.diarist.domain.oauth.exception.OAuthNotFoundException;
import com.hanium.diarist.domain.oauth.properties.GoogleProperties;
import com.hanium.diarist.domain.oauth.repository.AuthRepository;
import com.hanium.diarist.domain.user.domain.SocialCode;
import com.hanium.diarist.domain.user.domain.User;
import com.hanium.diarist.domain.user.service.UserService;
import com.hanium.diarist.domain.user.service.ValidateUserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@Service
@AllArgsConstructor
public class GoogleOauthService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final ValidateUserService validateUserService;
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final GoogleProperties googleProperties;
    private final AuthRepository authRepository;

    @Transactional
    public ResponseJwtToken login(String code) {
        GoogleAccessToken token = getGoogleAccessToken(code);
        String socialRefreshToken = token.getRefreshToken();
        GoogleUserProfile userProfile = getUserProfile(token);
        User user = validateUserService.validateRegisteredUserByEmail(userProfile.getEmail(),SocialCode.GOOGLE);

        if(user == null){ // 회원가입을 해야하는 경우
            user = userService.registerUser(userProfile.getEmail(), userProfile.getName(), SocialCode.GOOGLE);
        }

        String jwtAccessToken = jwtTokenProvider.createAccessToken(user.getUserId(),
                user.getUserRole());
        String jwtRefreshToken = jwtTokenProvider.createRefreshToken(user.getUserId(),
                user.getUserRole());

        Optional<Auth> auth = authRepository.findByUser(user);
        if (auth.isEmpty()) {
            // 새로운 Auth 객체 생성 및 저장
            auth = Optional.of(Auth.create(user, jwtRefreshToken, socialRefreshToken));// google refresh token이 회원탈퇴시 사용.
        }
        authRepository.save(auth.get());

        return ResponseJwtToken.of(jwtAccessToken, jwtRefreshToken);
    }

    public GoogleAccessToken getGoogleAccessToken(String code) { // access token을 발급받음.
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
        LinkedMultiValueMap<String,String> httpBody = new LinkedMultiValueMap<>();
        httpBody.add("code", code);
        httpBody.add("client_id", googleProperties.getClientId());
        httpBody.add("client_secret", googleProperties.getClientSecret());
        httpBody.add("redirect_uri", googleProperties.getRedirectUri());
        httpBody.add("grant_type", "authorization_code");

        HttpEntity<LinkedMultiValueMap<String, String>> requestParam = new HttpEntity<>(httpBody, httpHeaders);
        ResponseEntity<String> response = restTemplate.postForEntity(googleProperties.getTokenUri(), requestParam, String.class);

        try{
            return objectMapper.readValue(response.getBody(), GoogleAccessToken.class);
        }catch (JsonProcessingException e){
            throw new BusinessException(ErrorCode.JSON_PROCESS_ERROR, e);
        }

    }

    private GoogleUserProfile getUserProfile(GoogleAccessToken accessToken) {
        String userInfoUrl = googleProperties.getUserInfoUri();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken.getAccessToken());
        HttpEntity<?> httpEntity = new HttpEntity<>(headers);

        ResponseEntity<String> userInfoResponse = restTemplate.exchange(userInfoUrl, HttpMethod.GET, httpEntity, String.class);
        try{
            return objectMapper.readValue(userInfoResponse.getBody(), GoogleUserProfile.class);
        }catch (JsonProcessingException e){
            throw new BusinessException(ErrorCode.JSON_PROCESS_ERROR, e);
        }
    }

    @Transactional
    public void deleteAccount(User user) {
        Auth auth = authRepository.findByUser(user).orElseThrow(OAuthNotFoundException::new);// 삭제할 id 찾음
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        LinkedMultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("token", auth.getDeleteUtil());// google의 경우 google refresh token임.
        HttpEntity<LinkedMultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        String url = googleProperties.getDeleteAccountUri();
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
        if (response.getStatusCode().is2xxSuccessful()) {
            user.deleteUser();
        } else {
            throw new BusinessException(ErrorCode.OAUTH_SERVER_FAILED);
        }

    }
}
