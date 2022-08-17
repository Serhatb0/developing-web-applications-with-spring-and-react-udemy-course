package com.hoaxify.ws.shared;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DummyController {

	@GetMapping("/secured")
	String securedPath() {
		return "Secured Palce";
	}
}
