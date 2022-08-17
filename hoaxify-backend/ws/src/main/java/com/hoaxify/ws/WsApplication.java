package com.hoaxify.ws;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;



@SpringBootApplication()
public class WsApplication {

	public static void main(String[] args) {
		SpringApplication.run(WsApplication.class, args);
	}

//	@Bean
//	@Profile("dev")
//	CommandLineRunner createInitialUsers(UserService userService) {
//
//		return (args) -> {
//			User user = new User();
//			user.setUserName("user1");
//			user.setDisplayName("display1");
//			user.setPassword("P4ssword");
//			userService.save(user);
//		};
//
//	}

}
