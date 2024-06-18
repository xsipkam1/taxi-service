package sk.stuba.fei.bc.TaxiService.admin.web.bodies;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CarCheckRequest {
    private String name;
    private int passengers;
}
