package sk.stuba.fei.bc.TaxiService.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import sk.stuba.fei.bc.TaxiService.admin.data.Admin;
import sk.stuba.fei.bc.TaxiService.admin.data.IAdminRepository;
import sk.stuba.fei.bc.TaxiService.customer.data.Customer;
import sk.stuba.fei.bc.TaxiService.customer.data.ICustomerRepository;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import sk.stuba.fei.bc.TaxiService.driver.data.Driver;
import sk.stuba.fei.bc.TaxiService.driver.data.IDriverRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private ICustomerRepository customerRepository;
    @Autowired
    private IAdminRepository adminRepository;
    @Autowired
    private IDriverRepository driverRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Customer customer = customerRepository.findCustomerByLogin(username);
        if (customer != null) {
            return customer;
        }
        Driver driver = driverRepository.findDriverByLogin(username);
        if (driver != null) {
            return driver;
        }
        Admin admin = adminRepository.findAdminByLogin(username);
        if (admin != null) {
            return admin;
        }
        throw new UsernameNotFoundException("User not found");
    }
}
