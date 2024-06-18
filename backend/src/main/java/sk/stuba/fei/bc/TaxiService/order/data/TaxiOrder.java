package sk.stuba.fei.bc.TaxiService.order.data;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import sk.stuba.fei.bc.TaxiService.coordinates.data.Coordinates;
import sk.stuba.fei.bc.TaxiService.customer.data.Customer;
import sk.stuba.fei.bc.TaxiService.driver.data.Driver;
import sk.stuba.fei.bc.TaxiService.review.Review;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Data
@NoArgsConstructor
public class TaxiOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @ManyToOne
    private Customer customer;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "taxi_order_driver", joinColumns = @JoinColumn(name = "taxi_order_id"), inverseJoinColumns = @JoinColumn(name = "driver_id"))
    private List<Driver> drivers;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "taxi_order_driver_denied", joinColumns = @JoinColumn(name = "taxi_order_id"), inverseJoinColumns = @JoinColumn(name = "driver_id"))
    private List<Driver> deniedDrivers;


    @Column(name = "from_location")
    private String from;
    @Column(name = "to_location")
    private String to;
    private String dateTime;
    private String distance;
    private double time;
    private int quantity;
    private String type;
    private LocalDateTime orderDate;
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "taxi_order_id")
    private List<Coordinates> route;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "from_coordinates_id", referencedColumnName = "id")
    private Coordinates fromCoordinates;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "to_coordinates_id", referencedColumnName = "id")
    private Coordinates toCoordinates;

    @OneToOne(mappedBy = "taxiOrder", cascade = CascadeType.ALL)
    private Review review;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "order_driver_original_cost", joinColumns = @JoinColumn(name = "order_id"))
    @MapKeyJoinColumn(name = "driver_id")
    @Column(name = "original_cost")
    private Map<Driver, Double> originalDriverCosts = new HashMap<>();

    public TaxiOrder(Customer customer, List<Driver> drivers, List<Driver> deniedDrivers, String from, String to, String dateTime, String distance, double time, int quantity, String type,  Map<Driver, Double> originalDriverCosts) {
        this.customer = customer;
        this.drivers = drivers;
        this.deniedDrivers = deniedDrivers;
        this.from = from;
        this.to = to;
        this.dateTime = dateTime;
        this.distance = distance;
        this.time = time;
        this.quantity =quantity;
        this.type = type;
        this.originalDriverCosts = originalDriverCosts;
        this.orderDate = LocalDateTime.now();
    }
}