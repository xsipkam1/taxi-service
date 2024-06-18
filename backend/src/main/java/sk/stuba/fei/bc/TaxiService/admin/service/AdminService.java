package sk.stuba.fei.bc.TaxiService.admin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sk.stuba.fei.bc.TaxiService.admin.web.bodies.*;
import sk.stuba.fei.bc.TaxiService.admin.data.IAdminRepository;
import sk.stuba.fei.bc.TaxiService.candidate.Candidate;
import sk.stuba.fei.bc.TaxiService.candidate.ICandidateRepository;
import sk.stuba.fei.bc.TaxiService.car.Car;
import sk.stuba.fei.bc.TaxiService.car.ICarRepository;
import sk.stuba.fei.bc.TaxiService.customer.data.Customer;
import sk.stuba.fei.bc.TaxiService.customer.data.ICustomerRepository;
import sk.stuba.fei.bc.TaxiService.driver.data.Driver;
import sk.stuba.fei.bc.TaxiService.driver.data.IDriverRepository;
import sk.stuba.fei.bc.TaxiService.exception.ConflictException;
import sk.stuba.fei.bc.TaxiService.exception.NotFoundException;
import sk.stuba.fei.bc.TaxiService.order.data.ITaxiOrderRepository;
import sk.stuba.fei.bc.TaxiService.review.IReviewRepository;
import sk.stuba.fei.bc.TaxiService.review.Review;
import sk.stuba.fei.bc.TaxiService.security.Role;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AdminService implements IAdminService{
    @Autowired
    private ICustomerRepository customerRepository;
    @Autowired
    private IDriverRepository driverRepository;
    @Autowired
    private IAdminRepository adminRepository;
    @Autowired
    private ICandidateRepository candidateRepository;
    @Autowired
    private ICarRepository carRepository;
    @Autowired
    private IReviewRepository reviewRepository;
    @Autowired
    private ITaxiOrderRepository orderRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void createDriver(RegisterDriverRequest body) throws ConflictException {
        if (customerRepository.existsByLogin(body.getLogin()) || adminRepository.existsByLogin(body.getLogin()) || driverRepository.existsByLogin(body.getLogin())) {
            throw new ConflictException();
        }
        Car car = carRepository.findCarByNameAndAndPassengers(body.getCarName(), body.getCarPassengers());
        if (car == null) {
                car = Car.builder()
                    .name(body.getCarName())
                    .passengers(body.getCarPassengers())
                    .carPictureUrl(body.getCarPictureUrl())
                    .drivers(new ArrayList<>())
                    .build();
            carRepository.save(car);
        }

        Driver driver = Driver.builder()
                .fname(body.getFname())
                .lname(body.getLname())
                .login(body.getLogin())
                .enabled(true)
                .password(passwordEncoder.encode(body.getPassword()))
                .car(car)
                .cost(body.getCost())
                .telephone(body.getTelephone())
                .role(Role.ROLE_DRIVER)
                .hireDate(LocalDateTime.now())
                .build();
        car.getDrivers().add(driver);
        carRepository.save(car);
        driverRepository.save(driver);
    }

    @Override
    public List<Candidate> getAllCandidates() {
        return this.candidateRepository.findAll();
    }

    @Override
    public List<Customer> getAllCustomers() {
        return this.customerRepository.findAll();
    }

    @Override
    public List<Driver> getAllDrivers() {
        return this.driverRepository.findAll();
    }

    @Override
    public void rejectCandidate(Long id) throws NotFoundException {
        Candidate candidate = candidateRepository.findCandidateById(id);
        if (candidate == null) {
            throw new NotFoundException();
        }
        candidateRepository.delete(candidate);
    }

    @Override
    public void deleteCustomer(Long id) throws NotFoundException {
        Customer customer = customerRepository.findCustomerById(id);
        if (customer == null) {
            throw new NotFoundException();
        }
        customer.setEnabled(false);
        customerRepository.save(customer);
    }

    @Override
    public void deleteDriver(Long id) throws NotFoundException {
        Driver driver = driverRepository.findDriverById(id);
        if (driver == null) {
            throw new NotFoundException();
        }
        driver.setEnabled(false);
        driverRepository.save(driver);
    }

    @Override
    public boolean checkIfCarExists(CarCheckRequest body) throws NotFoundException {
        if (!carRepository.existsCarByNameAndPassengers(body.getName(), body.getPassengers())) {
            throw new NotFoundException();
        }
        return true;
    }

    @Override
    public void updateCost(Long id, ChangeCostRequest body) {
        Driver driver = driverRepository.findDriverById(id);
        driver.setCost(body.getCost());
        driverRepository.save(driver);
    }

    @Override
    public void updateCar(Long id, ChangeCarRequest body) {
        Car car = carRepository.findCarByNameAndAndPassengers(body.getCarName(), body.getCarPassengers());
        if (car == null) {
            car = Car.builder()
                    .name(body.getCarName())
                    .passengers(body.getCarPassengers())
                    .carPictureUrl(body.getCarPictureUrl())
                    .drivers(new ArrayList<>())
                    .build();
            carRepository.save(car);
        }

        Driver driver = driverRepository.findDriverById(id);
        driver.setCar(car);
        car.getDrivers().add(driver);
        carRepository.save(car);
        driverRepository.save(driver);
    }

    @Override
    public void deleteReview(Long id) {
        Review review = reviewRepository.findReviewById(id);
        if (review.getCustomer() != null) {
            review.getCustomer().getReviews().remove(review);
            customerRepository.save(review.getCustomer());
        }
        if (review.getTaxiOrder() != null) {
            review.getTaxiOrder().setReview(null);
            orderRepository.save(review.getTaxiOrder());
        }
        if (review.getDriver() != null) {
            review.getDriver().getReviews().remove(review);
            driverRepository.save(review.getDriver());
        }
        reviewRepository.delete(review);
    }

    @Override
    public TaxiServicePerformanceResponse getTaxiServicePerformance() {
        return new TaxiServicePerformanceResponse(this.getAllDrivers(), this.getAllCustomers());
    }
}
