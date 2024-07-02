package com.hanium.diarist.domain.oauth.domain;

import com.hanium.diarist.common.entity.BaseEntity;
import com.hanium.diarist.domain.user.domain.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Auth extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long authId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @NotNull
    @Column(nullable = false)
    private String refreshToken;

    private Auth(User user, String refreshToken) {
        this.user = user;
        this.refreshToken = refreshToken;
    }

    public static Auth create(User user, String refreshToken) { // 메서드로만 객체 생성 가능하도록 생성자를 private로 변경
        return new Auth(user, refreshToken);
    }

    public void setRefreshToken(String refreshToken) { // refresh token 갱신시 변경
        this.refreshToken = refreshToken;
    }
}
