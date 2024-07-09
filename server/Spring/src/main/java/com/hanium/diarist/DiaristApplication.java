package com.hanium.diarist;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;


@EnableJpaAuditing
//@EnableScheduling
@SpringBootApplication
public class DiaristApplication {

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load();
        System.setProperty("DB_HOST", dotenv.get("DB_HOST"));
        System.setProperty("DB_PORT", dotenv.get("DB_PORT"));
        System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
        System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
        System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
        System.setProperty("KAFKA_BOOTSTRAP_SERVERS", dotenv.get("KAFKA_BOOTSTRAP_SERVERS"));
        System.setProperty("KAKAO_REST_API_KEY", dotenv.get("KAKAO_REST_API_KEY"));
        System.setProperty("KAKAO_CLIENT_SECRET", dotenv.get("KAKAO_CLIENT_SECRET"));
        System.setProperty("KAKAO_REDIRECT_URI", dotenv.get("KAKAO_REDIRECT_URI"));
        System.setProperty("KAKAO_ADMIN_KEY", dotenv.get("KAKAO_ADMIN_KEY"));
        System.setProperty("JWT_SECRET", dotenv.get("JWT_SECRET"));
        System.setProperty("GOOGLE_CLIENT_ID", dotenv.get("GOOGLE_CLIENT_ID"));
        System.setProperty("GOOGLE_CLIENT_SECRET", dotenv.get("GOOGLE_CLIENT_SECRET"));
        System.setProperty("GOOGLE_REDIRECT_URI", dotenv.get("GOOGLE_REDIRECT_URI"));
        System.setProperty("AWS_SECRET_ACCESS_KEY", dotenv.get("AWS_SECRET_ACCESS_KEY"));
        System.setProperty("AWS_ACCESS_KEY_ID", dotenv.get("AWS_ACCESS_KEY_ID"));
        System.setProperty("AWS_S3_BUCKET", dotenv.get("AWS_S3_BUCKET"));
        System.setProperty("AWS_ENDPOINT", dotenv.get("AWS_ENDPOINT"));







        SpringApplication.run(DiaristApplication.class, args);
    }

}
