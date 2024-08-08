package com.hanium.diarist.common.config;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;
import org.springframework.boot.test.context.TestConfiguration;

@TestConfiguration
public class TestEnvironmentConfig {

    @PostConstruct
    public void setUp(){
        Dotenv dotenv = Dotenv.load();
        System.setProperty("DB_HOST", "localhost");
        System.setProperty("DB_PORT", "3306");
        System.setProperty("DB_USERNAME", "root");
        System.setProperty("DB_PASSWORD", "password");
        System.setProperty("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092");
        System.setProperty("KAKAO_REST_API_KEY", "kakao_rest_api_key");
        System.setProperty("KAKAO_CLIENT_SECRET", "kakao_client_secret");
        System.setProperty("KAKAO_REDIRECT_URI", "kakao_redirect_uri");
        System.setProperty("KAKAO_ADMIN_KEY", "kakao_admin_key");
        System.setProperty("JWT_SECRET", "jwt_secret");
        System.setProperty("GOOGLE_CLIENT_ID", "google_client_id");
        System.setProperty("GOOGLE_CLIENT_SECRET", "google_client_secret");
        System.setProperty("GOOGLE_REDIRECT_URI", "google_redirect_uri");
        System.setProperty("AWS_SECRET_ACCESS_KEY", "aws_secret_access_key");
        System.setProperty("AWS_ACCESS_KEY_ID", "aws_access_key_id");
        System.setProperty("AWS_S3_BUCKET", "aws_s3_bucket");
        System.setProperty("AWS_ENDPOINT", "aws_endpoint");

    }

}