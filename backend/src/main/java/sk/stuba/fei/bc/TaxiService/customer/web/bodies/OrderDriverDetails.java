package sk.stuba.fei.bc.TaxiService.customer.web.bodies;

import lombok.Data;
import sk.stuba.fei.bc.TaxiService.driver.data.Driver;
import sk.stuba.fei.bc.TaxiService.order.data.TaxiOrder;

@Data
public class OrderDriverDetails {
    private Long id;
    private String fname;
    private String lname;
    private double cost;
    private String telephone;
    private DriverCarResponse car;
    private String profilePicUrl;

    public OrderDriverDetails(Driver driver, TaxiOrder order) {
        this.id = driver.getId();
        this.fname = driver.getFname();
        this.lname = driver.getLname();
        this.cost = order.getOriginalDriverCosts().get(driver);
        this.telephone = driver.getTelephone();
        this.profilePicUrl = driver.getProfilePicUrl();
        this.car = new DriverCarResponse(driver);
    }
}
