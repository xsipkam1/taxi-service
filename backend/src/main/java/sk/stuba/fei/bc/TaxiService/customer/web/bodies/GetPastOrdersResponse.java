package sk.stuba.fei.bc.TaxiService.customer.web.bodies;

import lombok.Data;
import sk.stuba.fei.bc.TaxiService.customer.data.Customer;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class GetPastOrdersResponse {
    private List<OrderResponse> deniedOrders;
    private List<OrderResponse> completedOrders;

    public GetPastOrdersResponse(Customer customer) {
        this.deniedOrders = customer.getDeniedOrders().stream().map(OrderResponse::new).collect(Collectors.toList());
        this.completedOrders = customer.getCompletedOrders().stream().map(OrderResponse::new).collect(Collectors.toList());
    }
}
