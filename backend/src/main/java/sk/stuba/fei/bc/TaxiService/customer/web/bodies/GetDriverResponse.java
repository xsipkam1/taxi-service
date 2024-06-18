package sk.stuba.fei.bc.TaxiService.customer.web.bodies;

import lombok.Data;
import sk.stuba.fei.bc.TaxiService.driver.data.Driver;
import sk.stuba.fei.bc.TaxiService.review.Review;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class GetDriverResponse {
    private Long id;
    private String fname;
    private String lname;
    private String profilePicUrl;
    private DriverCarResponse car;
    private double cost;
    private double ranking;
    private int ridesCompleted;
    private List<ReviewResponse> reviews;
    private LocalDateTime hireDate;
    private String telephone;

    public GetDriverResponse(Driver driver) {
        this.id = driver.getId();
        this.fname = driver.getFname();
        this.lname = driver.getLname();
        this.car = new DriverCarResponse(driver);
        this.cost = driver.getCost();
        this.calculateRanking(driver);
        this.ridesCompleted = driver.getCompletedOrders().size();
        this.initializeReviews(driver);
        this.hireDate = driver.getHireDate();
        this.telephone = driver.getTelephone();
        this.profilePicUrl = driver.getProfilePicUrl();
    }

    private void calculateRanking(Driver driver) {
        int totalRating = 0;
        int totalReviews = driver.getReviews().size();
        for (Review review : driver.getReviews()) {
            totalRating += review.getRating();
        }
        if (totalReviews > 0) {
            double rawRanking = (double) totalRating / totalReviews;
            this.ranking = Math.round(rawRanking * 10.0) / 10.0;
        } else {
            this.ranking = 0;
        }
    }

    private void initializeReviews(Driver driver) {
        this.reviews = new ArrayList<>();
        for (Review review : driver.getReviews()) {
            this.reviews.add(new ReviewResponse(review));
        }
    }
}
