package com.ecom.backrow.api.Controller;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Spring Boot Main class
 */
@SpringBootApplication
@ComponentScan("com.ecom.backrow.api")
@EntityScan(basePackages = {"com.ecom.backrow.api"} )
@EnableJpaRepositories(basePackages = {"com.ecom.backrow.api.repository"})
public class ApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
    }

}
