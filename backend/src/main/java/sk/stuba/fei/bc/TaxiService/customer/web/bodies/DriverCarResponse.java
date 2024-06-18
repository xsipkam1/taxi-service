package sk.stuba.fei.bc.TaxiService.customer.web.bodies;

import lombok.Data;
import sk.stuba.fei.bc.TaxiService.driver.data.Driver;

@Data
public class DriverCarResponse {
    private Long id;
    private String name;
    private String carPictureUrl;
    private int passengers;

    public DriverCarResponse(Driver driver) {
        this.id = driver.getCar().getId();
        this.name = driver.getCar().getName();
        this.passengers = driver.getCar().getPassengers();
        this.carPictureUrl = driver.getCar().getCarPictureUrl();
    }
}
