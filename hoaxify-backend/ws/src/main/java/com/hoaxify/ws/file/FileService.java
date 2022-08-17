package com.hoaxify.ws.file;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.hoaxify.ws.configuration.AppConfiguration;
import com.hoaxify.ws.user.User;

@Service
public class FileService {

	AppConfiguration appConfiguration;
	Tika tika;
	FileAttachmentRepository fileAttachmentRepository;
	
	@Autowired
	public FileService(AppConfiguration appConfiguration,
			FileAttachmentRepository fileAttachmentRepository) {
		this.appConfiguration = appConfiguration;
		this.tika = new Tika();
		this.fileAttachmentRepository = fileAttachmentRepository;
	}


	public String wirteBase64EncodedStringToFile(String image) throws IOException {
		String fileName = generateRandomName();
		File target = new File(appConfiguration.getProfileStorgePath() + "/" + fileName);
		OutputStream outputStream = new FileOutputStream(target);
		byte[] base64Encoded = Base64.getDecoder().decode(image);
		outputStream.write(base64Encoded);
		outputStream.close();
		return fileName;

	}

	public String generateRandomName() {
		return UUID.randomUUID().toString().replaceAll("-", "");
	}

	public void deleteProfileImageFile(String oldImageName) {
		if (oldImageName == null) {
			return;
		}
		deleteFile(Paths.get(appConfiguration.getProfileStorgePath(),oldImageName));
	}
	
	public String detectType(String name) {
		byte[] base64Encoded = Base64.getDecoder().decode(name);
		return detectType(base64Encoded);
	}

	public String detectType(byte[] arr) {
		return tika.detect(arr);
	}

	public FileAttachment saveHoaxAttachment(MultipartFile multipartFile) {
		String fileName = generateRandomName();
		String fileType = null;
		File target = new File(appConfiguration.getAttachmentStorgePath() + "/" + fileName);
		OutputStream outputStream;
		try {
			outputStream = new FileOutputStream(target);
			outputStream.write(multipartFile.getBytes());
			outputStream.close();
			fileType=  detectType(multipartFile.getBytes());
		} catch (IOException e) {
		
			e.printStackTrace();
		}
		FileAttachment attachment = new FileAttachment();
		attachment.setName(fileName);
		attachment.setDate(new Date());
		attachment.setFileType(fileType);
		return fileAttachmentRepository.save(attachment);
		
	}
	
	private void deleteFile(Path path) {
		try {
			Files.deleteIfExists(path);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void deleteAttachmentFile(String name) {
		if (name == null) {
			return;
		}
		deleteFile(Paths.get(appConfiguration.getAttachmentStorgePath(), name));
		
		
	}


	public void deleteAllStoredFileForUser(User inDb) {
		deleteProfileImageFile(inDb.getImage());
		List<FileAttachment> filesToBeRemoved = fileAttachmentRepository.findByHoaxUser(inDb);
		for(FileAttachment file : filesToBeRemoved) {
			deleteAttachmentFile(file.getName());
		}
	}

}
