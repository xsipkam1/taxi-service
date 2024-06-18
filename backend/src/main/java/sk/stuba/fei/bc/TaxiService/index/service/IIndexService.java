package sk.stuba.fei.bc.TaxiService.index.service;

import jakarta.servlet.http.HttpServletRequest;
import sk.stuba.fei.bc.TaxiService.customer.data.Customer;
import sk.stuba.fei.bc.TaxiService.exception.ConflictException;
import sk.stuba.fei.bc.TaxiService.exception.NotFoundException;
import sk.stuba.fei.bc.TaxiService.index.web.bodies.DriverRequest;
import sk.stuba.fei.bc.TaxiService.index.web.bodies.LoginRequest;
import sk.stuba.fei.bc.TaxiService.index.web.bodies.LoginResponse;
import sk.stuba.fei.bc.TaxiService.index.web.bodies.RegisterRequest;

public interface IIndexService {
    Customer register(RegisterRequest body) throws ConflictException;
    LoginResponse login(LoginRequest body) throws NotFoundException;
    void logout(HttpServletRequest request);
    void requestDriverJob(DriverRequest request);
}
