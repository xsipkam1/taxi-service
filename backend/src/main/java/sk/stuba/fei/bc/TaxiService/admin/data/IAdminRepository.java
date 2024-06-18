package sk.stuba.fei.bc.TaxiService.admin.data;

import org.springframework.data.jpa.repository.JpaRepository;


public interface IAdminRepository extends JpaRepository<Admin, Long> {
    Admin findAdminByLogin(String login);
    boolean existsByLogin(String login);
}
