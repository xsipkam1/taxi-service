package sk.stuba.fei.bc.TaxiService.customer.web.bodies;

import lombok.Data;
import sk.stuba.fei.bc.TaxiService.coordinates.bodies.CoordinatesResponse;
import sk.stuba.fei.bc.TaxiService.driver.data.Driver;
import sk.stuba.fei.bc.TaxiService.order.bodies.RouteResponse;
import sk.stuba.fei.bc.TaxiService.order.data.TaxiOrder;
import sk.stuba.fei.bc.TaxiService.review.Review;

import java.util.ArrayList;
import java.util.List;

@Data
public class OrderResponse {
    private Long id;
    private String from;
    private String to;
    private String dateTime;
    private String distance;
    private double time;
    private int quantity;
    private List<OrderDriverDetails> drivers;
    private List<OrderDriverDetails> deniedDrivers;
    private CoordinatesResponse fromCoordinates;
    private CoordinatesResponse toCoordinates;
    private RouteResponse route;
    private String type;
    private ReviewResponse review;

    public OrderResponse(TaxiOrder order) {
        this.id = order.getId();
        this.from = order.getFrom();
        this.to = order.getTo();
        this.dateTime = order.getDateTime();
        this.distance = order.getDistance();
        this.time = order.getTime();
        this.quantity = order.getQuantity();
        this.drivers = new ArrayList<>();
        this.initializeDrivers(order.getDrivers(), order);
        this.initializeDeniedDrivers(order.getDeniedDrivers(), order);
        this.fromCoordinates = new CoordinatesResponse(order.getFromCoordinates());
        this.toCoordinates = new CoordinatesResponse(order.getToCoordinates());
        this.route = new RouteResponse(order.getRoute());
        this.type = order.getType();
        this.initializeReview(order);
    }

    private void initializeReview(TaxiOrder order) {
        if (order.getReview() != null) {
            this.review = new ReviewResponse(order.getReview());
        }
    }

    private void initializeDrivers(List<Driver> driverList, TaxiOrder order) {
        this.drivers = new ArrayList<>();
        for (Driver driver : driverList) {
            this.drivers.add(new OrderDriverDetails(driver, order));
        }
    }

    private void initializeDeniedDrivers(List<Driver> driverDeniedList, TaxiOrder order) {
        this.deniedDrivers = new ArrayList<>();
        for (Driver driver : driverDeniedList) {
            this.deniedDrivers.add(new OrderDriverDetails(driver, order));
        }
    }

}