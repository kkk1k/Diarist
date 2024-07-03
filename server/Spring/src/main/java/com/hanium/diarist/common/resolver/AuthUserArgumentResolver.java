package com.hanium.diarist.common.resolver;

import com.hanium.diarist.common.exception.BusinessException;
import com.hanium.diarist.common.exception.ErrorCode;
import com.hanium.diarist.common.security.jwt.JwtProperties;
import com.hanium.diarist.common.security.jwt.JwtTokenInfo;
import com.hanium.diarist.common.security.jwt.JwtTokenProvider;
import com.hanium.diarist.domain.user.domain.UserRole;
import io.jsonwebtoken.Claims;
import org.springframework.core.MethodParameter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@Component
public class AuthUserArgumentResolver implements HandlerMethodArgumentResolver {

    private final JwtTokenProvider jwtTokenProvider;

    public AuthUserArgumentResolver(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.getParameterType().equals(JwtTokenInfo.class) &&
                parameter.hasParameterAnnotation(AuthUser.class); // 지원 파라미터 타입
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
        NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Claims claims = (Claims) authentication.getPrincipal();
        Long userId = Long.parseLong((String) claims.get(JwtProperties.USER_ID));
        UserRole userRole = UserRole.valueOf((String) claims.get(JwtProperties.USER_ROLE));


        return JwtTokenInfo.builder()
                .userId(userId)
                .userRole(userRole)
                .build();
    }
}

