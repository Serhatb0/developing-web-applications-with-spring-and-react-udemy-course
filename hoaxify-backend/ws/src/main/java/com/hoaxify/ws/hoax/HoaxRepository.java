package com.hoaxify.ws.hoax;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.hoaxify.ws.user.User;

public interface HoaxRepository extends JpaRepository<Hoax, Long> ,JpaSpecificationExecutor<Hoax>{

	Page<Hoax> findByUser(User user, Pageable pageable);

	Page<Hoax> findByIdLessThan(long id, Pageable pageable);

	Page<Hoax> findByIdLessThanAndUser(long id, User user, Pageable pageable);
	
	long countByIdGreaterThan(long id);
	
	long countByIdGreaterThanAndUser(long id,User user);
	
	List<Hoax> findByIdGreaterThan(long id,Sort sort);
	
	List<Hoax> findByIdGreaterThanAndUser(long id,User user,Sort sort);
	
}
