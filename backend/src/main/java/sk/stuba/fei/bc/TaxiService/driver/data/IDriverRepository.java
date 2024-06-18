package sk.stuba.fei.bc.TaxiService.driver.data;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IDriverRepository extends JpaRepository<Driver, Long> {
    Driver findDriverByLogin(String login);
    Driver findDriverById(Long id);
    boolean existsByLogin(String login);
    List<Driver> findAll();
}
