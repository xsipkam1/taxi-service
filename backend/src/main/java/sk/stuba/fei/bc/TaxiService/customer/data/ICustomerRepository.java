package sk.stuba.fei.bc.TaxiService.customer.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ICustomerRepository extends JpaRepository<Customer, Long> {
    Customer findCustomerByLogin(String login);
    Customer findCustomerById(Long id);
    boolean existsByLogin(String login);
    List<Customer> findAll();
}
