package com.hoaxify.ws.file.vm;

import com.hoaxify.ws.file.FileAttachment;

import lombok.Data;

@Data
public class FileAttachmentVm {
	
	private String name;
	private String fileType;
	
	public FileAttachmentVm(FileAttachment fileAttachment) {
		this.setName(fileAttachment.getName());
		this.setFileType(fileAttachment.getFileType());
	}

}
