package sk.stuba.fei.bc.TaxiService.admin.web.bodies;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import sk.stuba.fei.bc.TaxiService.customer.data.Customer;
import sk.stuba.fei.bc.TaxiService.driver.data.Driver;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CustomerResponse {
    private Long id;
    private String fname;
    private String lname;
    private String telephone;
    private LocalDateTime registrationDate;
    private int ordersCount;
    private double ordersWorth;
    private String profilePicUrl;

    public CustomerResponse(Customer customer) {
        this.id=customer.getId();
        this.fname=customer.getFname();
        this.lname=customer.getLname();
        this.telephone=customer.getTelephone();
        this.registrationDate=customer.getRegistrationDate();
        this.ordersCount=customer.getCompletedOrders().size();
        this.ordersWorth=calculateOrdersWorth(customer);
        this.profilePicUrl=customer.getProfilePicUrl();
    }

    private double calculateOrdersWorth(Customer customer) {
        return customer.getCompletedOrders().stream()
                .mapToDouble(order -> {
                    Driver driver = order.getDrivers().get(0);
                    double distance = Double.parseDouble(order.getDistance());
                    double cost = order.getOriginalDriverCosts().get(driver);
                    return cost * distance;
                })
                .sum();
    }
}
