package com.hoaxify.ws.hoax;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hoaxify.ws.hoax.vm.HoaxSubmitVm;
import com.hoaxify.ws.hoax.vm.HoaxVm;
import com.hoaxify.ws.shared.CurrentUser;
import com.hoaxify.ws.shared.GenericResponse;
import com.hoaxify.ws.user.User;



@RestController
@RequestMapping("/api/1.0")
public class HoaxController {
	
	@Autowired
	private HoaxService hoaxService;
	
	@PostMapping("/hoaxes")
	public GenericResponse createUser(@Valid @RequestBody HoaxSubmitVm hoax, @CurrentUser User user) {
		hoaxService.save(hoax,user);
	
		return new GenericResponse("Hoax is Saved");
	}
	
	@GetMapping("/hoaxes")
	Page<HoaxVm> getHoaxes(@PageableDefault(sort = "id",direction = Direction.DESC) Pageable pageable){
		return hoaxService.getHoaxaes(pageable)
			.map(HoaxVm::new)	
				;
	}
	
	@GetMapping({"/hoaxes/{id}","/users/{username}/hoaxes/{id:[0-9]+}"})
	ResponseEntity<?> getHoaxesRelative(
			@PageableDefault(sort = "id",direction = Direction.DESC) Pageable pageable
			,@PathVariable long id,
			@PathVariable(required = false) String username,
			@RequestParam(name="count",required = false,defaultValue = "false") boolean count,
			@RequestParam(name="direction",defaultValue = "before") String direction
			){
		if(count) {
			long newHoaxCount = hoaxService.getNewHoaxesCount(id,username);
			Map<String,Long> response = new HashMap<>();
			response.put("count", newHoaxCount);
			return ResponseEntity.ok(response);
		}
		if(direction.equals("after")) {
			List<Hoax> newHoaxes = hoaxService.getNewHoaxes(id,username,pageable.getSort());
			List<HoaxVm> newHoaxesVm = newHoaxes.stream().map(HoaxVm::new).collect(Collectors.toList());
			return ResponseEntity.ok(newHoaxesVm);
		}
		return ResponseEntity.ok(hoaxService.getOldHoaxaes(id,username,pageable)
			.map(HoaxVm::new))
				;
	}
	@GetMapping("/users/{username}/hoaxes")
	Page<HoaxVm> getUsersHoaxes(
		@PathVariable String username,	@PageableDefault(sort = "id",direction = Direction.DESC) Pageable pageable){
		return hoaxService.getHoaxaesOfUser(username,pageable)
			.map(HoaxVm::new)	
				;
	}
	
	@DeleteMapping("/hoaxes/{id:[0-9]+}")
	@PreAuthorize("@hoaxSecurityService.isAllowToDelete(#id,principal)")
	GenericResponse deleteHoax(@PathVariable long id) {
		this.hoaxService.delete(id);
		return new GenericResponse("Removed Haox");
	}
	
//	@GetMapping("/users/{username}/hoaxes/{id:[0-9]+}")
//	ResponseEntity<?> getUsersHoaxesRelative(
//		@PathVariable String username,	@PageableDefault(sort = "id",direction = Direction.DESC) Pageable pageable,
//		@PathVariable long id,
//		@RequestParam(name="count",required = false,defaultValue = "false") boolean count,
//		@RequestParam(name="direction",defaultValue = "before") String direction
//			){
//		if(count) {
//			long newHoaxCount = hoaxService.getNewHoaxesCountOfUser(username,id);
//			Map<String,Long> response = new HashMap<>();
//			response.put("count", newHoaxCount);
//			return ResponseEntity.ok(response);
//		}
//		if(direction.equals("after")) {
//			List<Hoax> newHoaxes = hoaxService.getNewHoaxesOfUser(id,username,pageable.getSort());
//			List<HoaxVm> newHoaxesVm = newHoaxes.stream().map(HoaxVm::new).collect(Collectors.toList());
//			return ResponseEntity.ok(newHoaxesVm);
//		}
//		
//		return ResponseEntity.ok(hoaxService.getOldHoaxaesOfUser(id,username,pageable)
//			.map(HoaxVm::new)	)
//				;
//	}
}
