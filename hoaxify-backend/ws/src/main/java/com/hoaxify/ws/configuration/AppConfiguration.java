package com.hoaxify.ws.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Data
@Configuration
@ConfigurationProperties(prefix = "hoaxify")
public class AppConfiguration {
	private String uploadPath;

	private String profileStorge = "profile";
	
	private String attachmentStorge = "attachments";
	
	public String getProfileStorgePath() {
		return uploadPath + "/" + profileStorge;
	}
	public String getAttachmentStorgePath() {
		return uploadPath + "/" + attachmentStorge;
	}
}
