package com.hoaxify.ws.auth;


import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.hoaxify.ws.shared.GenericResponse;

@RestController
public class AuthController {

//	PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
	
	@Autowired
	AuthService authService;
	
	@PostMapping("/api/1.0/logout")
	GenericResponse handleLogout(@RequestHeader(name = "Authorization") String authorization) {
		String token = authorization.substring(7);
		authService.clearToken(token);
		return new GenericResponse("Logout success");
	}

	
	@PostMapping("/api/1.0/auth")
//	@JsonView(Views.Base.class)
	AuthResponse handleAuthentication(@RequestBody Credentials credentials) {
		return authService.authenticate(credentials);
		

//		User userDteails = (User) SecurityContextHolder.getContext().getAuthentication()
//				.getPrincipal();
//		String userName = userDteails.getUsername();
//		User inDB = userRepository.findByUserName(userName);

//		if(authorization == null) {
//			ApiError error = new ApiError(401, "Unauthorized Request", "/api/1.0/auth");
//			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
//		}
//		String base64Encoded = authorization.split("Basic ")[1];
//		String decoded = new String(Base64.getDecoder().decode(base64Encoded));
//		String[] parts = decoded.split(":");
//	
//		String password = parts[1];
//	
//		if(inDB == null) {
//			ApiError error = new ApiError(401, "Unauthorized Request", "/api/1.0/auth");
//			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
//		}
//		String hashedPassword = inDB.getPassword();
//		if(!passwordEncoder.matches(password, hashedPassword)) {
//			ApiError error = new ApiError(401, "Unauthorized Request", "/api/1.0/auth");
//			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
//		}

	}

}
