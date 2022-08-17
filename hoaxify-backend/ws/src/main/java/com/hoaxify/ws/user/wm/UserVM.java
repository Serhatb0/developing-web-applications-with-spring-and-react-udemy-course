package com.hoaxify.ws.user.wm;

import com.hoaxify.ws.user.User;

import lombok.Data;

@Data
public class UserVM {
	private String userName;
	private String displayName;
	private String image;
	
	public UserVM(User user) {
		this.setUserName(user.getUsername());
		this.setDisplayName(user.getDisplayName());
		this.setImage(user.getImage());
	}

	
}
