package com.hanium.diarist.domain.user.controller;

import com.hanium.diarist.domain.user.domain.SocialCode;
import com.hanium.diarist.domain.user.domain.User;
import com.hanium.diarist.domain.user.dto.UserRegistrationRequest;
import com.hanium.diarist.domain.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/user")
@Tag(name = "User", description = "유저 API")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    /*
    * @deprecated(since = "2024-08-04",  reason = "테스트용 회원 가입 api 입니다. 추후 삭제될 예정입니다.")
    * */
    @Deprecated(since = "2024-08-04")
    @PostMapping("/register")
    @Operation(summary = "회원가입", description = "유저 등록 API.")
    @ApiResponse(responseCode = "200", description = "유저 등록 성공")
    public ResponseEntity<User> registerUser(@RequestBody UserRegistrationRequest request){
        User user = userService.registerUser(request.getEmail(), request.getName(), SocialCode.KAKAO);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }


}
