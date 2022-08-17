package com.hoaxify.ws.user;

import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.hoaxify.ws.shared.CurrentUser;
import com.hoaxify.ws.shared.GenericResponse;
import com.hoaxify.ws.user.wm.UserUpdateVm;
import com.hoaxify.ws.user.wm.UserVM;

@RestController
@RequestMapping("/api/1.0")
public class UserController {

	@Autowired
	private UserService userService;

	@PostMapping("/users")
	public GenericResponse createUser(@Valid @RequestBody User user) {
		userService.save(user);
		return new GenericResponse("User Created");
	}
	

	@GetMapping("/users")
	Page<UserVM> getUsers(Pageable page,@CurrentUser User user) {
		return userService.getUsers(page,user).map(UserVM::new);

	}
	
	@GetMapping("/users/{username}")
	UserVM getUser(@PathVariable String username) {
		User user = userService.getByUserName(username);
		return new UserVM(user);
	}
	
	@PutMapping("/users/{username}")
	@PreAuthorize("#username == principal.username")
	UserVM updateUser(@Valid @RequestBody UserUpdateVm userUpdateVm,@PathVariable String username) {
		
		User user = userService.updateUser(username,userUpdateVm);
		return new UserVM(user);
	}
	
	
	@DeleteMapping("/users/{userName}")
	@PreAuthorize("#userName == principal.username")
	GenericResponse deleteUser(@PathVariable String userName) {
		this.userService.deleteUser(userName);
		return new GenericResponse("User is removed");
	};
	
	
	

//	@ExceptionHandler(MethodArgumentNotValidException.class)
//	@ResponseStatus(HttpStatus.BAD_REQUEST)
//	public ApiError handleValidationException(MethodArgumentNotValidException exception) {
//		ApiError error = new ApiError(400, "Validation Error", "/api/1.0/users");
//		Map<String, String> validationErrors = new HashMap<>();
//		for (FieldError fieldError : exception.getBindingResult().getFieldErrors()) {
//			validationErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
//		}
//		error.setValidationErrors(validationErrors);
//		return error;
//	}

}
