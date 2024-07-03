package com.hanium.diarist.domain.oauth.repository;

import com.hanium.diarist.domain.oauth.domain.Auth;
import com.hanium.diarist.domain.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthRepository extends JpaRepository<Auth, Long>{
    Optional<Auth> findByUser(User user);

    void deleteByUser(User user);
}
