package com.hanium.diarist.common.security.jwt;

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
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final String[] permitAllEndpointList;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
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
            }
        } catch (Exception e) {
            log.error("Cannot set user authentication: {}", e.getMessage());
            SecurityContextHolder.clearContext();
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, e.getMessage());
            return;
        }

        filterChain.doFilter(request, response);
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