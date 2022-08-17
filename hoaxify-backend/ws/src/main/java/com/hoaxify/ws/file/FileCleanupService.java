package com.hoaxify.ws.file;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@EnableScheduling
public class FileCleanupService {
	
	@Autowired
	FileAttachmentRepository fileAttachmentRepository;
	
	@Autowired
	FileService fileService;
	
	@Scheduled(fixedRate =24*60*60*1000)
	public void cleanupStorge() {
		Date twentyFourHoursAgo = new Date(System.currentTimeMillis()-(24*60*60*1000));
		List<FileAttachment> fileToBeDeleted =fileAttachmentRepository.findByDateBeforeAndHoaxIsNull(twentyFourHoursAgo);
		for(FileAttachment file : fileToBeDeleted) {
			//delete File
			fileService.deleteAttachmentFile(file.getName());
			// delete from table
			fileAttachmentRepository.deleteById(file.getId());
		}
	}
}
