package com.ttd.lms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class LmsApplication {

    // A static block runs when the class is loaded, before Spring Boot context or tests start.
    // This absolutely guarantees the JVM timezone is UTC before HikariCP connects to Supabase.
    static {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }

    public static void main(String[] args) {
        SpringApplication.run(LmsApplication.class, args);
    }
}
