package sk.stuba.fei.bc.TaxiService.driver.web.bodies;

import lombok.Data;
import sk.stuba.fei.bc.TaxiService.driver.data.Driver;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class GetPastOrdersResponse {
    private List<OrderResponse> deniedOrders;
    private List<OrderResponse> completedOrders;

    public GetPastOrdersResponse(Driver driver) {
        this.deniedOrders = driver.getDeniedOrders().stream().map(order -> new OrderResponse(order, driver)).collect(Collectors.toList());
        this.completedOrders = driver.getCompletedOrders().stream().map(order -> new OrderResponse(order, driver)).collect(Collectors.toList());
    }
}
