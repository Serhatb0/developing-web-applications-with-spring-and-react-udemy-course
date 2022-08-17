package com.hoaxify.ws.hoax.vm;

import com.hoaxify.ws.file.vm.FileAttachmentVm;
import com.hoaxify.ws.hoax.Hoax;
import com.hoaxify.ws.user.wm.UserVM;

import lombok.Data;

@Data
public class HoaxVm {
	private long id;

	private String content;

	private long timestamp;

	private UserVM user;
	
	private FileAttachmentVm fileAttachment;

	public HoaxVm(Hoax hoax) { 
		this.setId(hoax.getId());
		this.setContent(hoax.getContent());
		this.setTimestamp(hoax.getTimestamp().getTime());
		this.setUser(new UserVM(hoax.getUser()));
		if(hoax.getFileAttachment() != null) {
			this.fileAttachment = new FileAttachmentVm(hoax.getFileAttachment());
		}
		
	}

}
