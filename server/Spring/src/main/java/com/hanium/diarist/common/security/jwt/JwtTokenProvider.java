package com.hanium.diarist.common.security.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hanium.diarist.common.exception.BusinessException;
import com.hanium.diarist.common.exception.ErrorCode;
import com.hanium.diarist.common.security.jwt.exception.ExpiredAccessTokenException;
import com.hanium.diarist.common.security.jwt.exception.InvalidTokenException;
import com.hanium.diarist.domain.oauth.domain.Auth;
import com.hanium.diarist.domain.oauth.dto.ResponseJwtToken;
import com.hanium.diarist.domain.oauth.repository.AuthRepository;
import com.hanium.diarist.domain.user.domain.User;
import com.hanium.diarist.domain.user.domain.UserRole;
import com.hanium.diarist.domain.user.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.security.Key;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Component
@PropertySource("classpath:application.yml")
public class JwtTokenProvider {


    private final String CLAIM_USER_ID = JwtProperties.USER_ID;
    private final String CLAIM_USER_ROLE = JwtProperties.USER_ROLE;

    private final long ACCESS_TOKEN_EXPIRE_TIME;
    private final long REFRESH_TOKEN_EXPIRE_TIME;

    private final Key key;
    private final ObjectMapper objectMapper;

    @Autowired
    private final AuthRepository authRepository;


    @Autowired
    private final UserRepository userRepository;

    @Value("${jwt.secret}")
    private String secret;

    // access : 1시간, refresh : 60일 , 생성자 주입
    public JwtTokenProvider(@Value("${jwt.access-token-expire-time}") long accessTime,
                            @Value("${jwt.refresh-token-expire-time}") long refreshTime,
                            @Value("${jwt.secret}") String secretKey,
                            AuthRepository authRepository, UserRepository userRepository) {
        this.ACCESS_TOKEN_EXPIRE_TIME = accessTime;
        this.REFRESH_TOKEN_EXPIRE_TIME = refreshTime;
        this.authRepository = authRepository;
        this.userRepository = userRepository;
        byte[] keyBytes = Base64.getDecoder().decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.objectMapper = new ObjectMapper();
    }




    protected String createToken(Long userId, UserRole userRole,JwtType tokenType, long tokenValid) {
        Map<String, Object> header = new HashMap<>();
        header.put("typ", "JWT");

        Claims claims = Jwts.claims();
        claims.put(CLAIM_USER_ID, userId.toString());
        claims.put(CLAIM_USER_ROLE, userRole);
        claims.put("type", tokenType.name());

        Date date = new Date();
        return Jwts.builder()
                .setHeader(header)
                .setClaims(claims)// 토큰 발행 유저 정보
                .setIssuedAt(date)
                .setExpiration(new Date(date.getTime() + tokenValid))
                .signWith(key, SignatureAlgorithm.HS512)// 알고리즘
                .compact();
    }


    public String createAccessToken(Long userId, UserRole userRole) {
        return createToken(userId, userRole,JwtType.ACCESS ,ACCESS_TOKEN_EXPIRE_TIME);
    }
    public String createRefreshToken(Long userId, UserRole userRole) {
        return createToken(userId, userRole,JwtType.REFRESH, REFRESH_TOKEN_EXPIRE_TIME);
    }

    public String expireToken(String jwtToken) {
        Claims claims = parseClaims(jwtToken);
        return Jwts.builder()
                .setClaims(claims)
                .setExpiration(new Date())
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public ResponseJwtToken refreshToken(String refreshToken) {
        try {
            if(!validRefreshToken(refreshToken)){// 리프레시 토큰이 유효한지 확인
                throw new InvalidTokenException();
            }
            Claims claims = parseClaims(refreshToken);
            Long userId = Long.parseLong((String) claims.get(CLAIM_USER_ID));
            UserRole role = UserRole.valueOf((String) claims.get(CLAIM_USER_ROLE));

            String accessToken = createAccessToken(userId, role); // 새
            String newRefreshToken = refreshToken;

            if(shouldReissueRefreshToken(claims)) {
                newRefreshToken = createRefreshToken(userId, role);
                User user = userRepository.findById(userId).orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
                Auth auth = authRepository.findByUser(user).orElseThrow(() -> new BusinessException(ErrorCode.AUTHORITY_NOT_FOUND));
                auth.setRefreshToken(newRefreshToken);
                authRepository.save(auth);
            }
            ResponseJwtToken tokens = ResponseJwtToken.of(accessToken, newRefreshToken);
            return tokens;
        } catch (ExpiredJwtException e) {
            throw new ExpiredAccessTokenException();
        }catch (Exception e){
            throw new InvalidTokenException(e);
        }

    }

    private boolean shouldReissueRefreshToken(Claims claims) { // 기간이 얼마 남았는지 확인하는 메서드
        Date expiration = claims.getExpiration();
        Date now = new Date();
        long timeLeft = expiration.getTime() - now.getTime();
        long totalValidity = REFRESH_TOKEN_EXPIRE_TIME;

        // 남은 수명이 25% 이하일 때 재발급
        return timeLeft < totalValidity * 0.25;
    }


    //    public Authentication getAuthentication(String accessToken) {
//        Claims claims = parseClaims(accessToken);
//        if(claims.get(CLAIM_USER_ROLE)==null || !StringUtils.hasText(
//                claims.get(CLAIM_USER_ROLE).toString())){
//            throw new BusinessException(ErrorCode.AUTHORITY_NOT_FOUND);// 유저 권한 없음.
//        }
//
//        Collection<? extends GrantedAuthority> authorities =
//            Arrays.stream(claims.get(CLAIM_USER_ROLE).toString().split(","))
//                .map(SimpleGrantedAuthority::new)
//                .collect(Collectors.toList());
//        return new JwtAuthenticationToken(claims.get(CLAIM_USER_ID).toString(), authorities);
//
//    }
    public Authentication getAuthentication(String accessToken) {
        Claims claims = parseClaims(accessToken);

        if (claims.get(CLAIM_USER_ROLE) == null || !StringUtils.hasText(claims.get(CLAIM_USER_ROLE).toString())) {
            throw new BusinessException(ErrorCode.AUTHORITY_NOT_FOUND); //유저권한없음
        }

        Collection<? extends GrantedAuthority> authorities = Arrays.stream(claims.get(CLAIM_USER_ROLE).toString().split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        return new UsernamePasswordAuthenticationToken(claims, null, authorities);
    }




    public Claims parseClaims(String accessToken) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(accessToken)
                .getBody();
    }

    public boolean validAccessToken(String accessToken) {
        try {
            Claims claims = parseClaims(accessToken);
            JwtType tokenType =JwtType.valueOf(claims.get("type", String.class));
            Date expiration = claims.getExpiration();
            Date now = new Date();

            return (JwtType.ACCESS == tokenType && expiration.after(now));
        } catch (ExpiredJwtException e) {
            throw new ExpiredAccessTokenException();
        } catch (Exception e) {
            throw new InvalidTokenException(e);
        }
    }

    public boolean validRefreshToken(String refreshToken) {
        try {
            Claims claims = parseClaims(refreshToken);
            JwtType tokenType =JwtType.valueOf(claims.get("type", String.class));
            Date expiration = claims.getExpiration();
            Date now = new Date();
            return (JwtType.REFRESH == tokenType && expiration.after(now));
        } catch (ExpiredJwtException e) {
            throw new ExpiredAccessTokenException();
        } catch (Exception e) {
            throw new InvalidTokenException(e);
        }
    }

}
