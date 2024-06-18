package sk.stuba.fei.bc.TaxiService.admin.web.bodies;

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
public class DriverResponse {
    private Long id;
    private String fname;
    private String lname;
    private String telephone;
    private double cost;
    private LocalDateTime hireDate;
    private Long carId;
    private String carName;
    private String carPictureUrl;
    private int carPassengers;
    private int ridesCompleted;
    private List<ReviewResponse> reviews;
    private double ranking;
    private String profilePicUrl;

    public DriverResponse(Driver driver) {
        this.id=driver.getId();
        this.fname=driver.getFname();
        this.lname=driver.getLname();
        this.telephone=driver.getTelephone();
        this.cost=driver.getCost();
        this.hireDate=driver.getHireDate();
        this.carId=driver.getCar() != null ? driver.getCar().getId() : null;
        this.carName=driver.getCar() != null ? driver.getCar().getName() : null;
        this.carPassengers=driver.getCar() != null ? driver.getCar().getPassengers() : null;
        this.ridesCompleted=driver.getCompletedOrders().size();
        this.initializeReviews(driver);
        this.calculateRanking(driver);
        this.profilePicUrl=driver.getProfilePicUrl();
        this.carPictureUrl=driver.getCar().getCarPictureUrl();
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
