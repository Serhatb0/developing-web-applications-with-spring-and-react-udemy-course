package com.hoaxify.ws.auth;

import com.hoaxify.ws.user.wm.UserVM;

import lombok.Data;

@Data
public class AuthResponse {
	
	private String token;
	private UserVM userVM;
}
