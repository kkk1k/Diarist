package com.hanium.diarist.common.security.jwt;

import com.hanium.diarist.domain.user.domain.UserRole;
import lombok.Builder;
import lombok.Getter;

@Getter
public class JwtTokenInfo {

    private final Long userId;
    private final UserRole userRole;

    @Builder
    public JwtTokenInfo(Long userId, UserRole userRole) {
        this.userId = userId;
        this.userRole = userRole;
    }
}
