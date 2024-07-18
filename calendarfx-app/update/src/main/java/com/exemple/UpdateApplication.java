package com.exemple;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan({"com.exemple" })
public class UpdateApplication {

	public static void main(String[] args) {
		SpringApplication.run(UpdateApplication.class, args);
	}

}
