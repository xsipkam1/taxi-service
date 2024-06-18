package sk.stuba.fei.bc.TaxiService.customer.web.bodies;

import lombok.Data;
import sk.stuba.fei.bc.TaxiService.review.Review;

@Data
public class ReviewResponse {
    private Long id;
    private String fname;
    private String lname;
    private String plus;
    private String minus;
    private String profilePicUrl;
    private int rating;

    public ReviewResponse(Review review) {
        this.id = review.getId();
        this.fname = review.getCustomer().getFname();
        this.lname = review.getCustomer().getLname();
        this.plus = review.getPlus();
        this.minus = review.getMinus();
        this.rating = review.getRating();
        this.profilePicUrl = review.getCustomer().getProfilePicUrl();
    }
}
