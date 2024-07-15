package com.hanium.diarist.common.security.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hanium.diarist.common.exception.ErrorCode;
import com.hanium.diarist.common.response.ErrorResponse;
import com.hanium.diarist.common.security.jwt.exception.TokenException;
import com.hanium.diarist.common.utils.HeaderUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationEntryPoint extends OncePerRequestFilter {

    private final ObjectMapper objectMapper;
    private final String[] permitAllEndpointList;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            if (!shouldNotFilter(request)) {
                String accessToken = HeaderUtils.getJwtToken(request, JwtType.ACCESS);
                if (accessToken != null && jwtTokenProvider.validAccessToken(accessToken)) {
                    Authentication authentication = jwtTokenProvider.getAuthentication(accessToken);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    log.debug("Set Authentication to security context for '{}', uri: {}", authentication.getName(), request.getRequestURI());
                } else {
                    log.debug("No valid JWT token found, uri: {}", request.getRequestURI());
                }
                filterChain.doFilter(request, response);
            }
        } catch (TokenException e) {
            log.warn("security exception = {}", e.getErrorCode(), e);
            ErrorCode errorCode = e.getErrorCode();

            ErrorResponse errorResponse = makeErrorResponse(errorCode);
            response.setStatus(errorCode.getStatus());
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
        }
    }

    private ErrorResponse makeErrorResponse(ErrorCode errorCode) {
        return ErrorResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String requestURI = request.getRequestURI();
        AntPathMatcher pathMatcher = new AntPathMatcher();
        for (String permitAllEndpoint : permitAllEndpointList) {
            if (pathMatcher.match(permitAllEndpoint, requestURI)) {
                log.debug("Skipping authentication for permitted endpoint: {}", requestURI);
                return true;
            }
        }
        return false;
    }
}
