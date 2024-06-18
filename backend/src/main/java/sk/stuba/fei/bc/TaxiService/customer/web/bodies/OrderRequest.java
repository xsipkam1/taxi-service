package sk.stuba.fei.bc.TaxiService.customer.web.bodies;

import lombok.Data;
import sk.stuba.fei.bc.TaxiService.coordinates.bodies.CoordinatesRequest;

import java.util.List;

@Data
public class OrderRequest {
    private String from;
    private String to;
    private String dateTime;
    private String distance;
    private double time;
    private int quantity;
    private List<Long> driverIds;
    private String type;

    private CoordinatesRequest fromCoordinates;
    private CoordinatesRequest toCoordinates;
    private List<CoordinatesRequest> route;
}
