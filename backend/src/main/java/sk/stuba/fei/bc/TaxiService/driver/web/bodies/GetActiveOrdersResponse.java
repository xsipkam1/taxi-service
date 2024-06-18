package sk.stuba.fei.bc.TaxiService.driver.web.bodies;

import lombok.Data;
import sk.stuba.fei.bc.TaxiService.driver.data.Driver;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class GetActiveOrdersResponse {
    private List<OrderResponse> pendingOrders;
    private List<OrderResponse> acceptedOrders;

    public GetActiveOrdersResponse(Driver driver) {
        this.pendingOrders = driver.getPendingOrders().stream().map(order -> new OrderResponse(order, driver)).collect(Collectors.toList());
        this.acceptedOrders = driver.getAcceptedOrders().stream().map(order -> new OrderResponse(order, driver)).collect(Collectors.toList());
    }
}
