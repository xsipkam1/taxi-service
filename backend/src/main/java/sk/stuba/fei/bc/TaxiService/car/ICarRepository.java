package sk.stuba.fei.bc.TaxiService.car;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ICarRepository extends JpaRepository<Car, Long> {
    boolean existsCarByNameAndPassengers(String name, int passengers);
    Car findCarByNameAndAndPassengers(String name, int passengers);
}
