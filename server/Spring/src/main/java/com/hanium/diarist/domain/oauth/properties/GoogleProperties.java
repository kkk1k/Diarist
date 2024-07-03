package com.hanium.diarist.domain.oauth.properties;

import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

@Component
@Getter
@NoArgsConstructor
@PropertySource("classpath:application-oauth.yml")
public class GoogleProperties {

    @Value("${security.oauth2.client.registration.google.client-id}")
    private String clientId;
    @Value("${security.oauth2.client.registration.google.client-secret}")
    private String clientSecret;
    @Value("${security.oauth2.client.registration.google.token-uri}")
    private String tokenUri;
    @Value("${security.oauth2.client.registration.google.user-info-uri}")
    private String userInfoUri;
    @Value("${security.oauth2.client.registration.google.redirect-uri}")
    private String redirectUri;
    @Value("${security.oauth2.client.registration.google.delete-account-uri}")
    private String deleteAccountUri;
}
