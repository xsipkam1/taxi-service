package sk.stuba.fei.bc.TaxiService;

import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;
import sk.stuba.fei.bc.TaxiService.admin.data.Admin;
import sk.stuba.fei.bc.TaxiService.admin.data.IAdminRepository;
import sk.stuba.fei.bc.TaxiService.security.Role;

@SpringBootApplication
public class TaxiServiceApplication {
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private IAdminRepository adminRepository;

	public static void main(String[] args) {
		SpringApplication.run(TaxiServiceApplication.class, args);
	}

	@PostConstruct
	@Transactional
	public void createAdminUser() {
		Admin admin = new Admin();
		admin.setLogin("admin");
		admin.setPassword(passwordEncoder.encode("123456"));
		admin.setRole(Role.ROLE_ADMIN);
		adminRepository.save(admin);
	}

}
