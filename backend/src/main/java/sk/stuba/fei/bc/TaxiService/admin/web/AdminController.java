package sk.stuba.fei.bc.TaxiService.admin.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sk.stuba.fei.bc.TaxiService.admin.service.IAdminService;
import sk.stuba.fei.bc.TaxiService.admin.web.bodies.*;
import sk.stuba.fei.bc.TaxiService.customer.data.Customer;
import sk.stuba.fei.bc.TaxiService.driver.data.Driver;
import sk.stuba.fei.bc.TaxiService.exception.ConflictException;
import sk.stuba.fei.bc.TaxiService.exception.NotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private IAdminService service;

    @GetMapping("/overview")
    public TaxiServicePerformanceResponse getTaxiServicePerformance() {
        return this.service.getTaxiServicePerformance();
    }

    @GetMapping("/candidates")
    public List<CandidateResponse> getAllCandidates() {
        return this.service.getAllCandidates().stream().map(CandidateResponse::new).collect(Collectors.toList());
    }

    @GetMapping("/customers")
    public List<CustomerResponse> getAllCustomers() {
        return this.service.getAllCustomers().stream().filter(Customer::isEnabled).map(CustomerResponse::new).collect(Collectors.toList());
    }

    @GetMapping("/drivers")
    public List<DriverResponse> getAllDrivers() {
        return this.service.getAllDrivers().stream().filter(Driver::isEnabled).map(DriverResponse::new).collect(Collectors.toList());
    }

    @DeleteMapping("/reject-candidate/{id}")
    public void rejectCandidate(@PathVariable("id") Long id) throws NotFoundException {
        this.service.rejectCandidate(id);
    }

    @DeleteMapping("/delete-customer/{id}")
    public void deleteCustomer(@PathVariable("id") Long id) throws NotFoundException {
        this.service.deleteCustomer(id);
    }

    @DeleteMapping("/delete-driver/{id}")
    public void deleteDriver(@PathVariable("id") Long id) throws NotFoundException {
        this.service.deleteDriver(id);
    }

    @DeleteMapping("/delete-review/{id}")
    public void deleteReview(@PathVariable("id") Long id) {
        this.service.deleteReview(id);
    }

    @PostMapping("/car-exists")
    public ResponseEntity<?> checkIfCarExists(@RequestBody CarCheckRequest body) throws NotFoundException {
        return ResponseEntity.ok(this.service.checkIfCarExists(body));
    }

    @PostMapping("/create-driver")
    public void createDriver(@RequestBody RegisterDriverRequest body) throws ConflictException {
        this.service.createDriver(body);
    }

    @PutMapping("/update-cost/{id}")
    public void updateCost(@PathVariable("id") Long id, @RequestBody ChangeCostRequest body) {
        this.service.updateCost(id, body);
    }

    @PutMapping("/update-car/{id}")
    public void updateCost(@PathVariable("id") Long id, @RequestBody ChangeCarRequest body) {
        this.service.updateCar(id, body);
    }
}
