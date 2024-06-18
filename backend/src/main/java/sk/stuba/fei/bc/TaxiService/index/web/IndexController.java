package sk.stuba.fei.bc.TaxiService.index.web;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sk.stuba.fei.bc.TaxiService.exception.ConflictException;
import sk.stuba.fei.bc.TaxiService.exception.NotFoundException;
import sk.stuba.fei.bc.TaxiService.index.service.IndexService;
import sk.stuba.fei.bc.TaxiService.index.web.bodies.*;

@RestController
@RequestMapping("/auth")
public class IndexController {
    @Autowired
    private IndexService service;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest body) throws ConflictException {
        return new ResponseEntity<>(new RegisterResponse(this.service.register(body)), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest body) throws NotFoundException {
        return ResponseEntity.ok(service.login(body));
    }

    @PostMapping("/driver-request")
    public void requestDriverJob(@RequestBody DriverRequest body) {
        this.service.requestDriverJob(body);
    }

    @PostMapping("/logout")
    public void logout(HttpServletRequest request) {
        this.service.logout(request);
    }
}
