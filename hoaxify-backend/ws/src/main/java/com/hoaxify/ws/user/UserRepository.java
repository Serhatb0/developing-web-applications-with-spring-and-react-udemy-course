package com.hoaxify.ws.user;


import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;




public interface UserRepository extends JpaRepository<User, Long>{
	
	User findByUserName(String userName);
	
	@Transactional
	void deleteByUserName(String username);
	
	Page<User> findByUserNameNot(String username,Pageable page);
	
//	@Query(value="Select u from User u")
//	Page<UserProjection> getAllUsersProjection(Pageable page);
}
