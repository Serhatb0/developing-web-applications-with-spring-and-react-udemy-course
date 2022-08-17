package com.hoaxify.ws.user;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import org.springframework.beans.factory.annotation.Autowired;

public class UniqueUserNameValidator implements ConstraintValidator<UniqueUserName,String > {

	@Autowired
	private UserRepository userRepository;
	
	
	
	@Override
	public boolean isValid(String userName, ConstraintValidatorContext context) {
		User user = this.userRepository.findByUserName(userName);
		if(user != null) {
			return false;
		}
		return true;
	}
	
	
}
