package com.hoaxify.ws.auth;


import java.util.Optional;
import java.util.UUID;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.hoaxify.ws.user.User;
import com.hoaxify.ws.user.UserRepository;
import com.hoaxify.ws.user.wm.UserVM;



@Service
public class AuthService {

	UserRepository userRepository;

	PasswordEncoder encoder;
	
	TokenRepository tokenRepository;

	
	@Autowired
	public AuthService(UserRepository userRepository, PasswordEncoder encoder, TokenRepository tokenRepository) {
		super();
		this.userRepository = userRepository;
		this.encoder = encoder;
		this.tokenRepository = tokenRepository;
	}


	public AuthResponse authenticate(Credentials credentials) {
		User inDB = userRepository.findByUserName(credentials.getUsername());
		if(inDB == null) {
			throw new AuthException();			
		}
		boolean matches = encoder.matches(credentials.getPassword(), inDB.getPassword());
		if(!matches) {
			throw new AuthException();
		}
		UserVM userVM = new UserVM(inDB);
		String token = generateRandomToken();
		
		Token tokenEntity = new Token();
		tokenEntity.setToken(token);
		tokenEntity.setUser(inDB);
		tokenRepository.save(tokenEntity);
		AuthResponse response = new AuthResponse();
		response.setUserVM(userVM);
		response.setToken(token);
		return response;
	}

	@Transactional
	public UserDetails getUserDetails(String token) {
		Optional<Token> optionalToken = tokenRepository.findById(token);
		if(!optionalToken.isPresent()) {
			return null;
		}
		return optionalToken.get().getUser();
	}
	
	
	public String generateRandomToken() {
		return UUID.randomUUID().toString().replaceAll("-", "");
	}
	public void clearToken(String token) {
		tokenRepository.deleteById(token);
		
	}

}
