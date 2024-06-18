package sk.stuba.fei.bc.TaxiService.driver.web.bodies;

import lombok.Data;
import sk.stuba.fei.bc.TaxiService.customer.data.Customer;

@Data
public class OrderCustomerDetails {
    private Long id;
    private String fname;
    private String lname;
    private String telephone;
    private String profilePicUrl;

    public OrderCustomerDetails(Customer customer) {
        this.id = customer.getId();
        this.fname = customer.getFname();
        this.lname = customer.getLname();
        this.telephone = customer.getTelephone();
        this.profilePicUrl = customer.getProfilePicUrl();
    }
}
