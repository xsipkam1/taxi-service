package sk.stuba.fei.bc.TaxiService.customer.web.bodies;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import sk.stuba.fei.bc.TaxiService.customer.data.Customer;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DetailsResponse {
    private String fname;
    private String lname;
    private String login;
    private String profilePicUrl;
    private LocalDateTime registrationDate;
    private int pendingAmount;
    private int completedAmount;
    private int deniedAmount;

    public DetailsResponse(Customer customer) {
        this.login=customer.getLogin();
        this.fname=customer.getFname();
        this.lname=customer.getLname();
        this.registrationDate=customer.getRegistrationDate();
        this.pendingAmount = customer.getPendingOrders().size()+customer.getCompletedOrders().size()+customer.getDeniedOrders().size()+customer.getAcceptedOrders().size();
        this.completedAmount = customer.getCompletedOrders().size();
        this.deniedAmount = customer.getDeniedOrders().size();
        this.profilePicUrl = customer.getProfilePicUrl();
    }
}
