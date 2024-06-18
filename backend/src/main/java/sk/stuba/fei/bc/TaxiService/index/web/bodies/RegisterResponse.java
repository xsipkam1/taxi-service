package sk.stuba.fei.bc.TaxiService.index.web.bodies;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import sk.stuba.fei.bc.TaxiService.customer.data.Customer;
import sk.stuba.fei.bc.TaxiService.security.Role;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterResponse {
    private Long id;
    private String fname;
    private String lname;
    private String login;
    private Role role;

    public RegisterResponse(Customer customer) {
        this.id = customer.getId();
        this.fname = customer.getFname();
        this.lname = customer.getLname();
        this.login = customer.getLogin();
        this.role = customer.getRole();
    }
}
