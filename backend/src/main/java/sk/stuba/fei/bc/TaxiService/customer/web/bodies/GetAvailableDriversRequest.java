package sk.stuba.fei.bc.TaxiService.customer.web.bodies;

import lombok.Data;

@Data
public class GetAvailableDriversRequest {
    private String dateTime;
    private double time;
    private int quantity;
}
