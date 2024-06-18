package sk.stuba.fei.bc.TaxiService.driver.web.bodies;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import sk.stuba.fei.bc.TaxiService.customer.web.bodies.ReviewResponse;
import sk.stuba.fei.bc.TaxiService.driver.data.Driver;
import sk.stuba.fei.bc.TaxiService.review.Review;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DetailsResponse {
    private String fname;
    private String lname;
    private String login;
    private LocalDateTime hireDate;
    private double cost;
    private String carName;
    private String carPictureUrl;
    private int pendingAmount;
    private int completedAmount;
    private int deniedAmount;
    private List<ReviewResponse> reviews;
    private double ranking;
    private String profilePicUrl;

    public DetailsResponse(Driver driver) {
        this.fname = driver.getFname();
        this.lname = driver.getLname();
        this.login = driver.getLogin();
        this.hireDate = driver.getHireDate();
        this.cost = driver.getCost();
        this.carName = driver.getCar().getName();
        this.pendingAmount = driver.getPendingOrders().size()+driver.getAcceptedOrders().size()+driver.getCompletedOrders().size()+driver.getDeniedOrders().size();
        this.completedAmount = driver.getCompletedOrders().size();
        this.deniedAmount = driver.getDeniedOrders().size();
        this.initializeReviews(driver);
        this.calculateRanking(driver);
        this.profilePicUrl = driver.getProfilePicUrl();
        this.carPictureUrl = driver.getCar().getCarPictureUrl();
    }

    private void initializeReviews(Driver driver) {
        this.reviews = new ArrayList<>();
        for (Review review : driver.getReviews()) {
            this.reviews.add(new ReviewResponse(review));
        }
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
}
