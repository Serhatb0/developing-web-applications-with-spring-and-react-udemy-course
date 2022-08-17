package com.hoaxify.ws.hoax.vm;

import javax.validation.constraints.Size;

import lombok.Data;


@Data
public class HoaxSubmitVm {
	
	@Size(min=3,max=1000)
	private String content;
	private long attachmentId;
}
