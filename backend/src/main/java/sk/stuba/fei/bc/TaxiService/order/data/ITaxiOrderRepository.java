package sk.stuba.fei.bc.TaxiService.order.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ITaxiOrderRepository  extends JpaRepository<TaxiOrder, Long> {
    TaxiOrder findTaxiOrderById(Long id);
    void removeTaxiOrderById(Long id);
}
