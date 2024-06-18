package sk.stuba.fei.bc.TaxiService.customer.web.bodies;

import lombok.Data;
import sk.stuba.fei.bc.TaxiService.customer.data.Customer;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class GetActiveOrdersResponse {
    private List<OrderResponse> pendingOrders;
    private List<OrderResponse> acceptedOrders;

    public GetActiveOrdersResponse(Customer customer) {
        this.pendingOrders = customer.getPendingOrders().stream().map(OrderResponse::new).collect(Collectors.toList());
        this.acceptedOrders = customer.getAcceptedOrders().stream().map(OrderResponse::new).collect(Collectors.toList());
    }
}
