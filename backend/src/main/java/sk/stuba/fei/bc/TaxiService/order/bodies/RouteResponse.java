package sk.stuba.fei.bc.TaxiService.order.bodies;

import lombok.Data;
import sk.stuba.fei.bc.TaxiService.coordinates.data.Coordinates;

import java.util.ArrayList;
import java.util.List;

@Data
public class RouteResponse {
    private List<List<Double>> coordinates;
    private String type;
    public RouteResponse(List<Coordinates> routePoints) {
        this.coordinates = new ArrayList<>();
        for (Coordinates point : routePoints) {
            List<Double> coordinate = new ArrayList<>();
            coordinate.add(point.getLongitude());
            coordinate.add(point.getLatitude());
            this.coordinates.add(coordinate);
        }
        this.type = "LineString";
    }
}
