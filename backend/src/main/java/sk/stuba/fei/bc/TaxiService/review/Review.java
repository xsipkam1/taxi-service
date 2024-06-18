package sk.stuba.fei.bc.TaxiService.review;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import sk.stuba.fei.bc.TaxiService.customer.data.Customer;
import sk.stuba.fei.bc.TaxiService.driver.data.Driver;
import sk.stuba.fei.bc.TaxiService.order.data.TaxiOrder;

@Entity
@Data
@NoArgsConstructor
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String plus;
    private String minus;
    private int rating;

    @ManyToOne
    private Customer customer;

    @OneToOne
    @JoinColumn(name = "taxi_order_id")
    private TaxiOrder taxiOrder;

    @ManyToOne
    private Driver driver;

    public Review(Customer customer, TaxiOrder taxiOrder, Driver driver, String plus, String minus, int rating) {
        this.customer=customer;
        this.taxiOrder=taxiOrder;
        this.driver=driver;
        this.plus=plus;
        this.minus=minus;
        this.rating=rating;
    }

}
