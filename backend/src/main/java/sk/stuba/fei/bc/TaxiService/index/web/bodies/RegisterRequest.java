package sk.stuba.fei.bc.TaxiService.index.web.bodies;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String fname;
    private String lname;
    private String login;
    private String password;
    private String phoneNumber;
}
