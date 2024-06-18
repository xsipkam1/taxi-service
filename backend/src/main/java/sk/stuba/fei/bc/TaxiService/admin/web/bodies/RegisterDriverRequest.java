package sk.stuba.fei.bc.TaxiService.admin.web.bodies;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterDriverRequest {
    private String fname;
    private String lname;
    private String login;
    private String password;
    private String telephone;
    private double cost;
    private String carName;
    private String carPictureUrl;
    private int carPassengers;
}
