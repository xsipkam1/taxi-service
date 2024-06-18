package sk.stuba.fei.bc.TaxiService.coordinates.bodies;

import lombok.Data;
import sk.stuba.fei.bc.TaxiService.coordinates.data.Coordinates;

@Data
public class CoordinatesResponse {
    private double latitude;
    private double longitude;
    public CoordinatesResponse(Coordinates coordinates) {
        this.latitude = coordinates.getLatitude();
        this.longitude = coordinates.getLongitude();
    }
}
