package sk.stuba.fei.bc.TaxiService.index.service;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sk.stuba.fei.bc.TaxiService.admin.data.Admin;
import sk.stuba.fei.bc.TaxiService.admin.data.IAdminRepository;
import sk.stuba.fei.bc.TaxiService.candidate.Candidate;
import sk.stuba.fei.bc.TaxiService.candidate.ICandidateRepository;
import sk.stuba.fei.bc.TaxiService.customer.data.Customer;
import sk.stuba.fei.bc.TaxiService.customer.data.ICustomerRepository;
import sk.stuba.fei.bc.TaxiService.driver.data.Driver;
import sk.stuba.fei.bc.TaxiService.driver.data.IDriverRepository;
import sk.stuba.fei.bc.TaxiService.exception.ConflictException;
import sk.stuba.fei.bc.TaxiService.exception.NotFoundException;
import sk.stuba.fei.bc.TaxiService.index.web.bodies.DriverRequest;
import sk.stuba.fei.bc.TaxiService.security.JwtService;
import sk.stuba.fei.bc.TaxiService.index.web.bodies.LoginRequest;
import sk.stuba.fei.bc.TaxiService.index.web.bodies.LoginResponse;
import sk.stuba.fei.bc.TaxiService.index.web.bodies.RegisterRequest;
import sk.stuba.fei.bc.TaxiService.security.Role;

import java.time.LocalDateTime;
import java.util.HashMap;

@Service
public class IndexService implements IIndexService {
    @Autowired
    private ICustomerRepository customerRepository;
    @Autowired
    private IDriverRepository driverRepository;
    @Autowired
    private IAdminRepository adminRepository;
    @Autowired
    private ICandidateRepository candidateRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public Customer register(RegisterRequest body) throws ConflictException {
        if (customerRepository.existsByLogin(body.getLogin()) || adminRepository.existsByLogin(body.getLogin()) || driverRepository.existsByLogin(body.getLogin())) {
            throw new ConflictException();
        }
        Customer customer = Customer.builder()
                .fname(body.getFname())
                .lname(body.getLname())
                .login(body.getLogin())
                .enabled(true)
                .password(passwordEncoder.encode(body.getPassword()))
                .role(Role.ROLE_CUSTOMER)
                .registrationDate(LocalDateTime.now())
                .telephone(body.getPhoneNumber())
                .build();
        customerRepository.save(customer);
        return customer;
    }

    @Override
    public LoginResponse login(LoginRequest body) throws NotFoundException {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(body.getLogin(), body.getPassword()));
        Customer customer = customerRepository.findCustomerByLogin(body.getLogin());
        if (customer != null) {
            var jwtToken = jwtService.generateToken(new HashMap<>(), customer);
            return LoginResponse.builder().role(customer.getRole().getRoleCipher()).token(jwtToken).build();
        }
        Driver driver = driverRepository.findDriverByLogin(body.getLogin());
        if (driver != null) {
            var jwtToken = jwtService.generateToken(new HashMap<>(), driver);
            return LoginResponse.builder().role(driver.getRole().getRoleCipher()).token(jwtToken).build();
        }
        Admin admin = adminRepository.findAdminByLogin(body.getLogin());
        if (admin != null) {
            var jwtToken = jwtService.generateToken(new HashMap<>(), admin);
            return LoginResponse.builder().role(admin.getRole().getRoleCipher()).token(jwtToken).build();
        }
        throw new NotFoundException();
    }

    @Override
    public void logout(HttpServletRequest request) {
        String token = jwtService.extractJwtToken(request);
        jwtService.invalidateToken(token);
    }

    @Override
    public void requestDriverJob(DriverRequest request) {
        Candidate candidate = Candidate.builder()
                .fname(request.getFname())
                .lname(request.getLname())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .build();
        candidateRepository.save(candidate);
    }
}
