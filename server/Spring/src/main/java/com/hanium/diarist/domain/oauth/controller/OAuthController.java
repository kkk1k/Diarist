package com.hanium.diarist.domain.oauth.controller;

import com.hanium.diarist.common.resolver.AuthUser;
import com.hanium.diarist.common.response.SuccessResponse;
import com.hanium.diarist.common.security.jwt.JwtTokenInfo;
import com.hanium.diarist.common.security.jwt.JwtTokenProvider;
import com.hanium.diarist.common.security.jwt.JwtType;
import com.hanium.diarist.common.security.jwt.exception.ExpiredAccessTokenException;
import com.hanium.diarist.common.security.jwt.exception.InvalidTokenException;
import com.hanium.diarist.common.utils.HeaderUtils;
import com.hanium.diarist.domain.oauth.dto.AuthorizationCode;
import com.hanium.diarist.domain.oauth.dto.GoogleAccessToken;
import com.hanium.diarist.domain.oauth.dto.ResponseJwtToken;
import com.hanium.diarist.domain.oauth.service.GoogleOauthService;
import com.hanium.diarist.domain.oauth.service.KakaoOauthService;
import com.hanium.diarist.domain.oauth.service.OAuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@Tag(name = "OAuth", description = "로그인 API")
@RequestMapping("/oauth2")
public class OAuthController {

    private final KakaoOauthService kakaoOauthService;
    private final GoogleOauthService googleOauthService;
    private final OAuthService oAuthService;
    private final JwtTokenProvider jwtTokenProvider;

    @Operation(summary = "카카오 승인코드", description = "카카오에서 Authorization code를 받아옵니다.")
    @GetMapping("/kakao/login")
    public ResponseEntity<SuccessResponse<Object>> kakaoCallback() {
        return SuccessResponse.of(null).asHttp(HttpStatus.OK);
    }

    /*
    * @deprecated(since = "2024-07-27",  reason = "구글 승인코드를 프런트엔드에서 가져오는것으로 대체")
    * */
    @Deprecated(since = "2024-07-27")
    @Operation(summary = "구글 승인코드", description = "구글에서 Authorization code를 받아옵니다.")
    @GetMapping("/google/login/code")
    public ResponseEntity<SuccessResponse<Object>> googleCallback() {
        return SuccessResponse.of(null).asHttp(HttpStatus.OK);
    }


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
    @PostMapping("/kakao/login")
    public ResponseEntity<SuccessResponse<ResponseJwtToken>> kakaoLogin(@RequestBody AuthorizationCode authorizationCode) {
        String code = authorizationCode.getCode();
        return SuccessResponse.of(kakaoOauthService.login(code)).asHttp(HttpStatus.OK);
    }

    @Deprecated
    @Operation(summary = "구글 로그인 - 승인코드버전", description = "프론트로부터 Authorization code를 받아 구글 로그인을 진행합니다.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "구글 로그인 성공"),
            @ApiResponse(
                    responseCode = "400",
                    description = "C001 : 토큰 형식이 Bearer 형식이 아닙니다.",content = @Content(schema = @Schema(hidden = true))),
            @ApiResponse(
                    responseCode = "404",
                    description = "S007 : Authorization header에 토큰이 비었습니다.",content = @Content(schema = @Schema(hidden = true))),
            @ApiResponse(
                    responseCode = "500",
                    description = "O002 : 구글 OAuth 서버와의 통신에 실패했습니다.",content = @Content(schema = @Schema(hidden = true)))
    })
    @PostMapping("/google/login/code")
    public ResponseEntity<SuccessResponse<ResponseJwtToken>> googleCallback(@RequestBody AuthorizationCode authorizationCode) {
        String code = authorizationCode.getCode();
        return SuccessResponse.of(googleOauthService.login(code)).asHttp(HttpStatus.OK);
    }

    @Operation(summary = "구글 로그인", description = "프론트로부터 access Token과 refresh token을 받아 구글 로그인을 진행합니다.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "구글 로그인 성공"),
            @ApiResponse(
                    responseCode = "400",
                    description = "C001 : 토큰 형식이 Bearer 형식이 아닙니다.",content = @Content(schema = @Schema(hidden = true))),
            @ApiResponse(
                    responseCode = "404",
                    description = "S007 : Authorization header에 토큰이 비었습니다.",content = @Content(schema = @Schema(hidden = true))),
            @ApiResponse(
                    responseCode = "500",
                    description = "O002 : 구글 OAuth 서버와의 통신에 실패했습니다.",content = @Content(schema = @Schema(hidden = true)))
    })
    @PostMapping("/google/login")
    public ResponseEntity<SuccessResponse<ResponseJwtToken>> googleLogin(@RequestBody GoogleAccessToken token) {
        return SuccessResponse.of(googleOauthService.loginByToken(token)).asHttp(HttpStatus.OK);
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
        }
    }

    @Operation(summary = "회원 탈퇴", description = "소셜로그인 탈퇴를 진행하고, 회원을 deleted 상태로 변경합니다.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "204",
                    description = "소셜로그인 탈퇴 및 회원 삭제 성공"),
            @ApiResponse(
                    responseCode = "404",
                    description = "U001 : JwtToken의 userId에 해당하는 유저가 존재하지 않습니다.\t\n" +
                            "O001 : JwtToken의 userId에 해당하는 유저의 refreshtoken이 존재하지 않습니다.",
                    content = @Content(schema = @Schema(hidden = true))),
            @ApiResponse(
                    responseCode = "500",
                    description = "C004 : 소셜서버와의 통신을 실패했습니다.",
                    content = @Content(schema = @Schema(hidden = true)))
    })
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteAccount(@AuthUser JwtTokenInfo tokenInfo) {
        oAuthService.deleteAccount(tokenInfo.getUserId());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "로그아웃", description = "로그아웃을 진행하고, 회원의 refresh token을 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "204",
                    description = "로그아웃 및 refresh token 삭제 성공"),
            @ApiResponse(
                    responseCode = "404",
                    description = "U001 : JwtToken의 userId에 해당하는 유저가 존재하지 않습니다.\t\n" +
                            "O001 : JwtToken의 userId에 해당하는 유저의 refreshtoken이 존재하지 않습니다.",
                    content = @Content(schema = @Schema(hidden = true)))
    })
    @DeleteMapping("/logout")
    public ResponseEntity<Void> logout(@AuthUser JwtTokenInfo tokenInfo) {
        oAuthService.logout(tokenInfo.getUserId());
        return ResponseEntity.noContent().build();
    }





}
