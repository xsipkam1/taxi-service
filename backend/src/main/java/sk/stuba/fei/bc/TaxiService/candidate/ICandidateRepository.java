package sk.stuba.fei.bc.TaxiService.candidate;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ICandidateRepository extends JpaRepository<Candidate, Long> {
    Candidate findCandidateById(Long id);
    List<Candidate> findAll();
}
