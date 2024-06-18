package sk.stuba.fei.bc.TaxiService.driver.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sk.stuba.fei.bc.TaxiService.customer.data.Customer;
import sk.stuba.fei.bc.TaxiService.customer.data.ICustomerRepository;
import sk.stuba.fei.bc.TaxiService.driver.web.bodies.DetailsResponse;
import sk.stuba.fei.bc.TaxiService.customer.web.bodies.ChangePasswordRequest;
import sk.stuba.fei.bc.TaxiService.driver.data.Driver;
import sk.stuba.fei.bc.TaxiService.driver.data.IDriverRepository;
import sk.stuba.fei.bc.TaxiService.driver.web.bodies.GetActiveOrdersResponse;
import sk.stuba.fei.bc.TaxiService.driver.web.bodies.GetPastOrdersResponse;
import sk.stuba.fei.bc.TaxiService.exception.IllegalOperationException;
import sk.stuba.fei.bc.TaxiService.order.data.ITaxiOrderRepository;
import sk.stuba.fei.bc.TaxiService.order.data.TaxiOrder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;

@Service
public class DriverService implements IDriverService{

    @Autowired
    private IDriverRepository driverRepository;
    @Autowired
    private ITaxiOrderRepository orderRepository;
    @Autowired
    private ICustomerRepository customerRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public DetailsResponse getUserInfo() {
        Driver driver = getCurrentUser();
        return new DetailsResponse(driver);
    }

    @Override
    public void changePassword(ChangePasswordRequest request) throws IllegalOperationException {
        Driver driver = getCurrentUser();
        if (!request.getPassword().equals(request.getConfirmationPassword())) {
            throw new IllegalOperationException();
        }
        driver.setPassword(passwordEncoder.encode(request.getPassword()));
        driverRepository.save(driver);
    }

    @Override
    public void deleteProfile() {
        Driver driver = getCurrentUser();
        driver.setEnabled(false);
        driverRepository.save(driver);
    }

    @Override
    public GetActiveOrdersResponse getAllActiveOrdersResponse() {
        Driver driver = getCurrentUser();
        filterPendingOrders(driver.getPendingOrders());
        filterAcceptedOrders(driver, driver.getAcceptedOrders());
        return new GetActiveOrdersResponse(driver);
    }

    @Override
    public GetPastOrdersResponse getAllPastOrdersResponse() {
        Driver driver = getCurrentUser();
        return new GetPastOrdersResponse(driver);
    }

    @Override
    public void acceptOrder(Long orderId) {
        Driver driverAuth = getCurrentUser();
        Driver currentDriver = driverRepository.findDriverById(driverAuth.getId());
        TaxiOrder order = orderRepository.findTaxiOrderById(orderId);
        if (currentDriver.getPendingOrders().contains(order)) {
            Customer customer = order.getCustomer();
            customer.getPendingOrders().remove(order);
            customer.getAcceptedOrders().add(order);
            customerRepository.save(customer);
            Iterator<Driver> iterator = order.getDrivers().iterator();
            while (iterator.hasNext()) {
                Driver driver = iterator.next();
                if (!Objects.equals(driver.getId(), currentDriver.getId())) {
                    iterator.remove();
                    driver.getPendingOrders().remove(order);
                    driver.getDeniedOrders().add(order);
                    driverRepository.save(driver);
                }
            }
            currentDriver.getPendingOrders().remove(order);
            currentDriver.getAcceptedOrders().add(order);
            driverRepository.save(currentDriver);
        }
    }

    @Override
    public void denyOrder(Long orderId) {
        TaxiOrder order = orderRepository.findTaxiOrderById(orderId);
        Driver driverAuth = getCurrentUser();
        Driver driver = driverRepository.findDriverById(driverAuth.getId());
        order.getDrivers().remove(driver);
        order.getDeniedDrivers().add(driver);
        driver.getPendingOrders().remove(order);
        driver.getDeniedOrders().add(order);
        if (order.getDrivers().isEmpty()) {
            Customer customer = order.getCustomer();
            customer.getPendingOrders().remove(order);
            customer.getDeniedOrders().add(order);
            customerRepository.save(customer);
        }
        driverRepository.save(driver);
    }

    @Override
    public void deleteDeniedOrder(Long orderId) {
        Driver driverAuth = getCurrentUser();
        Driver driver = driverRepository.findDriverById(driverAuth.getId());
        TaxiOrder order = orderRepository.findTaxiOrderById(orderId);
        driver.getDeniedOrders().remove(order);
        driverRepository.save(driver);
    }

    @Override
    public void uploadProfilePicture(String url) {
        Driver driver = getCurrentUser();
        driver.setProfilePicUrl(url);
        driverRepository.save(driver);
    }

    @Override
    public void deleteProfilePicture() {
        Driver driver = getCurrentUser();
        driver.setProfilePicUrl(null);
        driverRepository.save(driver);
    }

    private void filterAcceptedOrders(Driver driver, List<TaxiOrder> acceptedOrders) {
        LocalDateTime currentDateTime = LocalDateTime.now();
        List<TaxiOrder> acceptedOrdersCopy = new ArrayList<>(acceptedOrders);
        for (TaxiOrder order : acceptedOrdersCopy) {
            LocalDateTime startDateTime = LocalDateTime.parse(order.getDateTime());
            LocalDateTime endDateTime = startDateTime.plusMinutes((long) (order.getTime()*60));
            if (currentDateTime.isAfter(endDateTime)) {
                Customer customer = order.getCustomer();
                customer.getAcceptedOrders().remove(order);
                customer.getCompletedOrders().add(order);
                customerRepository.save(customer);
                driver.getAcceptedOrders().remove(order);
                driver.getCompletedOrders().add(order);
                driverRepository.save(driver);
            }
        }
    }

    private void filterPendingOrders(List<TaxiOrder> pendingOrders) {
        LocalDateTime currentDateTime = LocalDateTime.now();
        List<TaxiOrder> ordersToRemoveFromCustomerPending = new ArrayList<>();

        for (TaxiOrder order : pendingOrders) {
            LocalDateTime startDateTime = LocalDateTime.parse(order.getDateTime());
            if (currentDateTime.isAfter(startDateTime)) {
                ordersToRemoveFromCustomerPending.add(order);
            }
        }

        for (TaxiOrder orderToRemove : ordersToRemoveFromCustomerPending) {
            Customer customer = orderToRemove.getCustomer();
            customer.getPendingOrders().remove(orderToRemove);
            customer.getDeniedOrders().add(orderToRemove);
            customerRepository.save(customer);
            for (Driver driver : orderToRemove.getDrivers()) {
                driver.getPendingOrders().remove(orderToRemove);
                driver.getDeniedOrders().add(orderToRemove);
                driverRepository.save(driver);
            }
        }
    }

    private Driver getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (Driver) authentication.getPrincipal();
    }

}
