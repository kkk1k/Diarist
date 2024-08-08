package com.hanium.diarist;

import com.hanium.diarist.common.config.DotenvConfig;
import com.hanium.diarist.common.config.TestEnvironmentConfig;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;


@SpringBootTest
@ActiveProfiles("test")
@ContextConfiguration(classes = {TestEnvironmentConfig.class, DotenvConfig.class})
class DiaristApplicationTests {

    @Test
    void contextLoads() {
    }

}
