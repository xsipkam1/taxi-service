package sk.stuba.fei.bc.TaxiService.customer.web.bodies;

import lombok.Data;

@Data
public class ReviewRequest {
    private String plus;
    private String minus;
    private int rating;
}
