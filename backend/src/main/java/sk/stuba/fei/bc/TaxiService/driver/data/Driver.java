package sk.stuba.fei.bc.TaxiService.driver.data;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import sk.stuba.fei.bc.TaxiService.car.Car;
import sk.stuba.fei.bc.TaxiService.order.data.TaxiOrder;
import sk.stuba.fei.bc.TaxiService.review.Review;
import sk.stuba.fei.bc.TaxiService.security.Role;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Driver implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String login;
    private String fname;
    private String lname;
    private String password;
    private String telephone;
    private boolean enabled;
    private String profilePicUrl;
    private double cost;
    @ManyToOne
    private Car car;
    @Enumerated(EnumType.STRING)
    private Role role;
    private LocalDateTime hireDate;
    @ManyToMany(fetch = FetchType.EAGER)
    private List<TaxiOrder> pendingOrders = new ArrayList<>();
    @ManyToMany(fetch = FetchType.EAGER)
    private List<TaxiOrder> deniedOrders = new ArrayList<>();
    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "driver_accepted_id")
    private List<TaxiOrder> acceptedOrders = new ArrayList<>();
    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "driver_completed_id")
    private List<TaxiOrder> completedOrders = new ArrayList<>();
    @OneToMany(mappedBy = "driver", fetch = FetchType.EAGER)
    private List<Review> reviews = new ArrayList<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return login;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}
