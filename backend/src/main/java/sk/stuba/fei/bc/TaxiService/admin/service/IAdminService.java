package sk.stuba.fei.bc.TaxiService.admin.service;

import sk.stuba.fei.bc.TaxiService.admin.web.bodies.*;
import sk.stuba.fei.bc.TaxiService.candidate.Candidate;
import sk.stuba.fei.bc.TaxiService.customer.data.Customer;
import sk.stuba.fei.bc.TaxiService.driver.data.Driver;
import sk.stuba.fei.bc.TaxiService.exception.ConflictException;
import sk.stuba.fei.bc.TaxiService.exception.NotFoundException;

import java.util.List;

public interface IAdminService {
    void createDriver(RegisterDriverRequest body) throws ConflictException;
    List<Candidate> getAllCandidates();
    List<Customer> getAllCustomers();
    List<Driver> getAllDrivers();
    void rejectCandidate(Long id) throws NotFoundException;
    void deleteCustomer(Long id) throws NotFoundException;
    void deleteDriver(Long id) throws NotFoundException;
    boolean checkIfCarExists(CarCheckRequest body) throws NotFoundException;
    void updateCost(Long id, ChangeCostRequest body);
    void updateCar(Long id, ChangeCarRequest body);
    void deleteReview(Long id);
    TaxiServicePerformanceResponse getTaxiServicePerformance();
}
