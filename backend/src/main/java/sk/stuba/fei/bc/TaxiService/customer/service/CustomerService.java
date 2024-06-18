package sk.stuba.fei.bc.TaxiService.customer.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sk.stuba.fei.bc.TaxiService.coordinates.bodies.CoordinatesRequest;
import sk.stuba.fei.bc.TaxiService.coordinates.data.Coordinates;
import sk.stuba.fei.bc.TaxiService.customer.data.ICustomerRepository;
import sk.stuba.fei.bc.TaxiService.customer.web.bodies.*;
import sk.stuba.fei.bc.TaxiService.customer.data.Customer;
import sk.stuba.fei.bc.TaxiService.driver.data.Driver;
import sk.stuba.fei.bc.TaxiService.driver.data.IDriverRepository;
import sk.stuba.fei.bc.TaxiService.exception.IllegalOperationException;
import sk.stuba.fei.bc.TaxiService.order.data.ITaxiOrderRepository;
import sk.stuba.fei.bc.TaxiService.order.data.TaxiOrder;
import sk.stuba.fei.bc.TaxiService.review.IReviewRepository;
import sk.stuba.fei.bc.TaxiService.review.Review;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class CustomerService implements ICustomerService {

    @Autowired
    private ICustomerRepository customerRepository;
    @Autowired
    private IDriverRepository driverRepository;
    @Autowired
    private ITaxiOrderRepository orderRepository;
    @Autowired
    private IReviewRepository reviewRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public DetailsResponse getUserInfo() {
        Customer customer = getCurrentUser();
        return new DetailsResponse(customer);
    }

    @Override
    public void changePassword(ChangePasswordRequest request) throws IllegalOperationException{
        Customer customer = getCurrentUser();
        if (!request.getPassword().equals(request.getConfirmationPassword())) {
            throw new IllegalOperationException();
        }
        customer.setPassword(passwordEncoder.encode(request.getPassword()));
        customerRepository.save(customer);
    }

    @Override
    public void deleteProfile() {
        Customer customer = getCurrentUser();
        customer.setEnabled(false);
        customerRepository.save(customer);
    }

    @Override
    public List<GetDriverResponse> getAvailableDrivers(GetAvailableDriversRequest body) {
        List<GetDriverResponse> availableDrivers = new ArrayList<>();
        List<Driver> allDrivers = driverRepository.findAll();
        LocalDateTime startTime = LocalDateTime.parse(body.getDateTime());
        LocalDateTime endTime = startTime.plusMinutes((long) (body.getTime() * 60));

        for (Driver driver : allDrivers) {
            if (!driver.isEnabled()) {
                continue;
            }
            boolean isAvailable = true;
            if (driver.getCar().getPassengers() < body.getQuantity()) {
                isAvailable = false;
            } else {
                for (TaxiOrder acceptedOrder : driver.getAcceptedOrders()) {
                    LocalDateTime orderStartTime = LocalDateTime.parse(acceptedOrder.getDateTime());
                    LocalDateTime orderEndTime = orderStartTime.plusMinutes((long)(acceptedOrder.getTime() * 60));
                    if (doRangesOverlap(startTime, endTime, orderStartTime, orderEndTime)) {
                        isAvailable = false;
                        break;
                    }
                }
            }
            if (isAvailable) {
                availableDrivers.add(new GetDriverResponse(driver));
            }
        }
        return availableDrivers;
    }

    @Override
    public void createTaxiOrder(OrderRequest order) throws IllegalOperationException {
        Customer customer = getCurrentUser();

        LocalDateTime orderDateTime = LocalDateTime.parse(order.getDateTime());
        LocalDateTime currentDateTime = LocalDateTime.now();
        LocalDateTime minimumValidDateTime = currentDateTime.plusMinutes(5);
        if (orderDateTime.isBefore(minimumValidDateTime)) {
            throw new IllegalOperationException();
        }

        List<Driver> drivers = new ArrayList<>();
        Map<Driver, Double> prizes = new HashMap<>();
        List<Long> driverIds = order.getDriverIds();
        for (Long driverId : driverIds) {
            Driver driver = driverRepository.findDriverById(driverId);
            drivers.add(driver);
            prizes.put(driver, driver.getCost());
        }
        Coordinates fromCoords = mapCoordinates(order.getFromCoordinates());
        Coordinates toCoords = mapCoordinates(order.getToCoordinates());
        List<Coordinates> route = mapRoutePoints(order.getRoute());
        List<Driver> deniedDrivers = new ArrayList<>();
        TaxiOrder newOrder = new TaxiOrder
                (customer,
                        drivers,
                        deniedDrivers,
                        order.getFrom(),
                        order.getTo(),
                        order.getDateTime(),
                        order.getDistance(),
                        order.getTime(),
                        order.getQuantity(),
                        order.getType(),
                        prizes);
        newOrder.setFromCoordinates(fromCoords);
        newOrder.setToCoordinates(toCoords);
        newOrder.setRoute(route);
        newOrder = orderRepository.save(newOrder);
        customer.getPendingOrders().add(newOrder);
        for (Driver driver : drivers) {
            driver.getPendingOrders().add(newOrder);
            driverRepository.save(driver);
        }
        customerRepository.save(customer);
    }

    @Override
    public GetActiveOrdersResponse getAllActiveOrdersResponse() {
        Customer customer = getCurrentUser();
        filterPendingOrders(customer, customer.getPendingOrders());
        filterAcceptedOrders(customer, customer.getAcceptedOrders());
        return new GetActiveOrdersResponse(customer);
    }

    @Override
    public GetPastOrdersResponse getAllPastOrdersResponse() {
        Customer customer = getCurrentUser();
        return new GetPastOrdersResponse(customer);
    }

    @Transactional
    @Override
    public void cancelOrder(Long orderId) {
        Customer currentCustomer = getCurrentUser();
        Customer customer = customerRepository.findCustomerById(currentCustomer.getId());
        TaxiOrder order = orderRepository.findTaxiOrderById(orderId);
        customer.getPendingOrders().remove(order);
        customerRepository.save(customer);
        List<Driver> drivers = order.getDrivers();
        for (Driver driver : drivers) {
            driver.getPendingOrders().remove(order);
            driverRepository.save(driver);
        }
        orderRepository.removeTaxiOrderById(orderId);
    }

    @Override
    public void deleteDeniedOrder(Long orderId) {
        Customer customerAuth = getCurrentUser();
        Customer customer = customerRepository.findCustomerById(customerAuth.getId());
        TaxiOrder order = orderRepository.findTaxiOrderById(orderId);
        customer.getDeniedOrders().remove(order);
        customerRepository.save(customer);
    }

    @Override
    public void postReview(Long orderId, ReviewRequest body) {
        Customer customer = getCurrentUser();
        TaxiOrder order = orderRepository.findTaxiOrderById(orderId);
        Review existingReview = order.getReview();
        if (existingReview != null && existingReview.getCustomer().getId().equals(customer.getId())) {
            existingReview.setPlus(body.getPlus());
            existingReview.setMinus(body.getMinus());
            existingReview.setRating(body.getRating());
            reviewRepository.save(existingReview);
        } else {
            Driver driver = order.getDrivers().get(0);
            Review review = new Review(
                    customer,
                    order,
                    driver,
                    body.getPlus(),
                    body.getMinus(),
                    body.getRating()
            );
            review = reviewRepository.save(review);
            customer.getReviews().add(review);
            driver.getReviews().add(review);
            order.setReview(review);
            driverRepository.save(driver);
        }
        customerRepository.save(customer);
        orderRepository.save(order);
    }

    @Override
    public void uploadProfilePicture(String url) {
        Customer customer = getCurrentUser();
        customer.setProfilePicUrl(url);
        customerRepository.save(customer);
    }

    @Override
    public void deleteProfilePicture() {
        Customer customer = getCurrentUser();
        customer.setProfilePicUrl(null);
        customerRepository.save(customer);
    }

    private void filterAcceptedOrders(Customer customer, List<TaxiOrder> acceptedOrders) {
        LocalDateTime currentDateTime = LocalDateTime.now();
        List<TaxiOrder> acceptedOrdersCopy = new ArrayList<>(acceptedOrders);
        for (TaxiOrder order : acceptedOrdersCopy) {
            LocalDateTime startDateTime = LocalDateTime.parse(order.getDateTime());
            LocalDateTime endDateTime = startDateTime.plusMinutes((long) (order.getTime()*60));
            if (currentDateTime.isAfter(endDateTime)) {
                customer.getAcceptedOrders().remove(order);
                customer.getCompletedOrders().add(order);
                customerRepository.save(customer);
                Driver driver = order.getDrivers().get(0);
                driver.getAcceptedOrders().remove(order);
                driver.getCompletedOrders().add(order);
                driverRepository.save(driver);
            }
        }
    }

    private void filterPendingOrders(Customer customer, List<TaxiOrder> pendingOrders) {
        LocalDateTime currentDateTime = LocalDateTime.now();
        Iterator<TaxiOrder> iterator = pendingOrders.iterator();
        while (iterator.hasNext()) {
            TaxiOrder order = iterator.next();
            LocalDateTime startDateTime = LocalDateTime.parse(order.getDateTime());
            if (currentDateTime.isAfter(startDateTime)) {
                customer.getDeniedOrders().add(order);
                for (Driver driver : order.getDrivers()) {
                    driver.getPendingOrders().remove(order);
                    driver.getDeniedOrders().add(order);
                    driverRepository.save(driver);
                }
                iterator.remove();
            }
        }
        customerRepository.save(customer);
    }

    private Coordinates mapCoordinates(CoordinatesRequest coordinatesRequest) {
        Coordinates coordinates = new Coordinates();
        coordinates.setLatitude(coordinatesRequest.getLatitude());
        coordinates.setLongitude(coordinatesRequest.getLongitude());
        return coordinates;
    }

    private List<Coordinates> mapRoutePoints(List<CoordinatesRequest> coordinatesRequests) {
        List<Coordinates> routePoints = new ArrayList<>();
        for (CoordinatesRequest coordinatesRequest : coordinatesRequests) {
            Coordinates routePoint = new Coordinates();
            routePoint.setLatitude(coordinatesRequest.getLatitude());
            routePoint.setLongitude(coordinatesRequest.getLongitude());
            routePoints.add(routePoint);
        }
        return routePoints;
    }

    private boolean doRangesOverlap(LocalDateTime startDateTime1, LocalDateTime endDateTime1, LocalDateTime startDateTime2, LocalDateTime endDateTime2) {
        return !startDateTime1.isAfter(endDateTime2) && !endDateTime1.isBefore(startDateTime2);
    }

    private Customer getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (Customer) authentication.getPrincipal();
    }
}
