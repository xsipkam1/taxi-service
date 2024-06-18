package sk.stuba.fei.bc.TaxiService.review;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IReviewRepository extends JpaRepository<Review, Long> {
    Review findReviewById(Long id);
}
