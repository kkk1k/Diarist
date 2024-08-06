package com.hanium.diarist.common.security.jwt;

public class JwtProperties {

    private JwtProperties() {
        throw new IllegalStateException("util class는 인스턴스화 할 수 없습니다.");
    }

    public static final String JWT_TOKEN_HEADER = "Authorization";

    public static final String USER_ID="userId";
    public static final String USER_ROLE="AuthenticationRole";
}
