package com.hoaxify.ws.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.hoaxify.ws.error.NotFoundException;
import com.hoaxify.ws.file.FileService;
import com.hoaxify.ws.user.wm.UserUpdateVm;

@Service
public class UserService {

	private UserRepository userRepository;
	private FileService fileService;
	private PasswordEncoder passwordEncoder;

	@Autowired
	public UserService(UserRepository userRepository, FileService fileService, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.fileService = fileService;
		this.passwordEncoder = passwordEncoder;
	}

	public void save(User user) {
		user.setPassword(this.passwordEncoder.encode(user.getPassword()));
		userRepository.save(user);

	}

	public Page<User> getUsers(Pageable page, User user) {
		if (user != null) {
			return userRepository.findByUserNameNot(user.getUsername(), page);
		}
		return userRepository.findAll(page);
	}

	public User getByUserName(String username) {
		User inDb = userRepository.findByUserName(username);
		if (inDb == null) {
			throw new NotFoundException();
		}
		return inDb;
	}

	public User updateUser(String username, UserUpdateVm userUpdateVm) {
		User inDB = getByUserName(username);
		inDB.setDisplayName(userUpdateVm.getDisplayName());
		if (userUpdateVm.getImage() != null) {
			String oldImageName = inDB.getImage();
			try {

				String storedFileName = fileService.wirteBase64EncodedStringToFile(userUpdateVm.getImage());

				inDB.setImage(storedFileName);

			} catch (Exception e) {
				// TODO: handle exception
			}
			fileService.deleteProfileImageFile(oldImageName);
		}

		userRepository.save(inDB);
		return inDB;
	}

	public void deleteUser(String userName) {
		User inDb = userRepository.findByUserName(userName);
		fileService.deleteAllStoredFileForUser(inDb);
		this.userRepository.delete(inDb);

	}
	public User getOne(long id) {
		return this.userRepository.getOne(id);
	}

}
