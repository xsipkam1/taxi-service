package sk.stuba.fei.bc.TaxiService.driver.web.bodies;

import lombok.Data;
import sk.stuba.fei.bc.TaxiService.coordinates.bodies.CoordinatesResponse;
import sk.stuba.fei.bc.TaxiService.customer.web.bodies.ReviewResponse;
import sk.stuba.fei.bc.TaxiService.driver.data.Driver;
import sk.stuba.fei.bc.TaxiService.order.bodies.RouteResponse;
import sk.stuba.fei.bc.TaxiService.order.data.TaxiOrder;

@Data
public class OrderResponse {
    private Long id;
    private String from;
    private String to;
    private String dateTime;
    private String distance;
    private double time;
    private int quantity;
    private double driverCost;
    private OrderCustomerDetails customer;
    private CoordinatesResponse fromCoordinates;
    private CoordinatesResponse toCoordinates;
    private RouteResponse route;
    private ReviewResponse review;

    public OrderResponse(TaxiOrder order, Driver driver) {
        this.id = order.getId();
        this.from = order.getFrom();
        this.to = order.getTo();
        this.dateTime = order.getDateTime();
        this.distance = order.getDistance();
        this.time = order.getTime();
        this.quantity = order.getQuantity();
        this.driverCost = order.getOriginalDriverCosts().get(driver);
        this.customer = new OrderCustomerDetails(order.getCustomer());
        this.fromCoordinates = new CoordinatesResponse(order.getFromCoordinates());
        this.toCoordinates = new CoordinatesResponse(order.getToCoordinates());
        this.route = new RouteResponse(order.getRoute());
        this.initializeReview(order);
    }

    private void initializeReview(TaxiOrder order) {
        if (order.getReview() != null) {
            this.review = new ReviewResponse(order.getReview());
        }
    }
}