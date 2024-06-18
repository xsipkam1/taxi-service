package sk.stuba.fei.bc.TaxiService.car;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import sk.stuba.fei.bc.TaxiService.driver.data.Driver;

import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private int passengers;
    private String carPictureUrl;
    @OneToMany(mappedBy = "car", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<Driver> drivers;

}
