package com.hanium.diarist.domain.oauth.controller;

import com.hanium.diarist.common.exception.ErrorCode;
import com.hanium.diarist.common.response.ErrorResponse;
import com.hanium.diarist.common.response.SuccessResponse;
import com.hanium.diarist.common.security.jwt.JwtTokenProvider;
import com.hanium.diarist.common.security.jwt.JwtType;
import com.hanium.diarist.common.security.jwt.exception.ExpiredAccessTokenException;
import com.hanium.diarist.common.security.jwt.exception.InvalidTokenException;
import com.hanium.diarist.common.utils.HeaderUtils;
import com.hanium.diarist.domain.oauth.dto.ResponseJwtToken;
import com.hanium.diarist.domain.oauth.service.KakaoOauthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/oauth2")
public class OAuthController {

    private final KakaoOauthService kakaoOauthService;
    private final JwtTokenProvider jwtTokenProvider;


    @Operation(summary = "카카오 로그인", description = "프론트로부터 Authorization code를 받아 카카오 로그인을 진행합니다.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "카카오 로그인 성공"),
            @ApiResponse(
                    responseCode = "400",
                    description = "C001 : 토큰 형식이 Bearer 형식이 아닙니다.",content = @Content(schema = @Schema(hidden = true))),
            @ApiResponse(
                    responseCode = "404",
                    description = "S007 : Authorization header에 토큰이 비었습니다.",content = @Content(schema = @Schema(hidden = true))),
            @ApiResponse(
                    responseCode = "500",
                    description = "O002 : 카카오 OAuth 서버와의 통신에 실패했습니다.",content = @Content(schema = @Schema(hidden = true)))
    })
    @GetMapping("/kakao/login")
    public ResponseEntity<SuccessResponse<ResponseJwtToken>> kakaoCallback(@RequestParam String code) {
//        System.out.println(code);
        return SuccessResponse.of(kakaoOauthService.login(code)).asHttp(HttpStatus.OK);
    }


    @Operation(summary = "토큰 갱신", description = "프론트로부터 Refresh Token을 받아 Access Token을 갱신합니다.")
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "토큰 갱신 성공"),
                    @ApiResponse(
                            responseCode = "400",
                            description = "C001 : 토큰 형식이 Bearer 형식이 아닙니다.",content = @Content(schema = @Schema(hidden = true))),
                    @ApiResponse(
                            responseCode = "404",
                            description = "S007 : Authorization header에 토큰이 비었습니다.",content = @Content(schema = @Schema(hidden = true))),
                    @ApiResponse(
                            responseCode = "500",
                            description = "O002 : 토큰 갱신에 실패했습니다.",content = @Content(schema = @Schema(hidden = true)))
            }
    )
    @PostMapping("/refresh")
    public ResponseEntity<SuccessResponse<ResponseJwtToken>> refresh(HttpServletRequest request) {
        String refreshToken = HeaderUtils.getJwtToken(request, JwtType.REFRESH);
        try{
            ResponseJwtToken responseJwtToken = jwtTokenProvider.refreshToken(refreshToken);

            return SuccessResponse.of(responseJwtToken).asHttp(HttpStatus.OK);
            }catch (ExpiredAccessTokenException e){
            throw new ExpiredAccessTokenException();
        }catch (InvalidTokenException e){
            throw new InvalidTokenException();
        }catch (Exception e){
            throw new RuntimeException();
        }
    }




}
