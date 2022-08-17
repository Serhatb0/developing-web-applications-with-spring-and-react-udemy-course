package com.hoaxify.ws.hoax;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import com.hoaxify.ws.file.FileAttachment;
import com.hoaxify.ws.file.FileAttachmentRepository;
import com.hoaxify.ws.file.FileService;
import com.hoaxify.ws.hoax.vm.HoaxSubmitVm;
import com.hoaxify.ws.user.User;
import com.hoaxify.ws.user.UserService;

@Service
public class HoaxService {

	private HoaxRepository hoaxRepository;
	private UserService userService;
	private FileAttachmentRepository fileAttachmentRepository;
	private FileService fileService;

	@Autowired
	public HoaxService(HoaxRepository hoaxRepository, UserService userService,
			FileAttachmentRepository fileAttachmentRepository,FileService fileService) {
		this.hoaxRepository = hoaxRepository;
		this.userService = userService;
		this.fileAttachmentRepository = fileAttachmentRepository;
		this.fileService = fileService;
	}

	public void save(HoaxSubmitVm hoaxSubmitVm, User user) {
		Hoax hoax = new Hoax();
		hoax.setContent(hoaxSubmitVm.getContent());
		hoax.setTimestamp(new Date());
		hoax.setUser(user);
		hoaxRepository.save(hoax);
		Optional<FileAttachment> optionalFileAttachment = fileAttachmentRepository
				.findById(hoaxSubmitVm.getAttachmentId());
		if (optionalFileAttachment.isPresent()) {
			FileAttachment fileAttachment = optionalFileAttachment.get();
			fileAttachment.setHoax(hoax);
			fileAttachmentRepository.save(fileAttachment);
		}
	}

	public Page<Hoax> getHoaxaes(Pageable pageable) {
		return hoaxRepository.findAll(pageable);
	}

	public Page<Hoax> getHoaxaesOfUser(String username, Pageable pageable) {
		User inDb = userService.getByUserName(username);
		return hoaxRepository.findByUser(inDb, pageable);

	}

	public Page<Hoax> getOldHoaxaes(long id, String username, Pageable pageable) {
		Specification<Hoax> specification = idLessThan(id);
		if (username != null) {
			User inDb = userService.getByUserName(username);
			specification = specification.and(userIs(inDb));
		}
		return hoaxRepository.findAll(specification, pageable);
	}

	public long getNewHoaxesCount(long id, String username) {
		Specification<Hoax> specification = isGreaterThan(id);
		if (username != null) {
			User inDb = userService.getByUserName(username);
			specification = specification.and(userIs(inDb));
		}
		return hoaxRepository.count(specification);
	}

	public List<Hoax> getNewHoaxes(long id, String username, Sort sort) {
		Specification<Hoax> specification = isGreaterThan(id);
		if (username != null) {
			User inDb = userService.getByUserName(username);
			specification = specification.and(userIs(inDb));
		}
		return hoaxRepository.findAll(specification, sort);
	}

	Specification<Hoax> idLessThan(long id) {
		return (root, query, criteriaBuilder) -> {
			return criteriaBuilder.lessThan(root.get("id"), id);
		};

	};

	Specification<Hoax> isGreaterThan(long id) {
		return (root, query, criteriaBuilder) -> {
			return criteriaBuilder.greaterThan(root.get("id"), id);
		};

	};

	Specification<Hoax> userIs(User user) {
		return (root, query, criteriaBuilder) -> {
			return criteriaBuilder.equal(root.get("user"), user);
		};

	}

	public void delete(long id) {
		Hoax indb = hoaxRepository.getOne(id);
		if(indb.getFileAttachment() != null) {
			String fileName = indb.getFileAttachment().getName();
			fileService.deleteAttachmentFile(fileName);
		}
		
		this.hoaxRepository.deleteById(id);

	};

}
