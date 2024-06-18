package sk.stuba.fei.bc.TaxiService.customer.data;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
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
public class Customer implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String login;
    private String password;
    private String fname;
    private String lname;
    private String profilePicUrl;
    private boolean enabled;
    @Enumerated(EnumType.STRING)
    private Role role;
    private LocalDateTime registrationDate;
    private String telephone;
    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_pending_id")
    private List<TaxiOrder> pendingOrders = new ArrayList<>();
    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_denied_id")
    private List<TaxiOrder> deniedOrders = new ArrayList<>();
    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_accepted_id")
    private List<TaxiOrder> acceptedOrders = new ArrayList<>();
    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_completed_id")
    private List<TaxiOrder> completedOrders = new ArrayList<>();
    @OneToMany(mappedBy = "customer", fetch = FetchType.EAGER)
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
