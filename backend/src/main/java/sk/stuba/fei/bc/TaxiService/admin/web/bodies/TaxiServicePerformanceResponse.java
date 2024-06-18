package sk.stuba.fei.bc.TaxiService.admin.web.bodies;

import lombok.Data;
import sk.stuba.fei.bc.TaxiService.customer.data.Customer;
import sk.stuba.fei.bc.TaxiService.driver.data.Driver;

import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Data
public class TaxiServicePerformanceResponse {
    private int orders;
    private double earnings;
    private int customers;
    private int drivers;
    private Map<LocalDate, Long> registeredCustomersPerDay;
    private Map<LocalDate, Long> registeredDriversPerDay;
    private Map<LocalDate, Long> completedOrdersPerDay;
    private Map<LocalDate, Double> earningsPerDay;

    public TaxiServicePerformanceResponse(List<Driver> drivers, List<Customer> customers) {
        Locale.setDefault(Locale.US);
        this.orders = drivers.stream().mapToInt(driver -> driver.getCompletedOrders().size()).sum();
        this.earnings =  drivers.stream()
                .flatMapToDouble(driver -> driver.getCompletedOrders().stream()
                        .mapToDouble(order -> {
                            Driver orderDriver = order.getDrivers().get(0);
                            return Double.parseDouble(order.getDistance().replace(',', '.')) * order.getOriginalDriverCosts().get(orderDriver);
                        }))
                .sum();
        this.customers = (int) customers.stream().filter(Customer::isEnabled).count();
        this.drivers = (int) drivers.stream().filter(Driver::isEnabled).count();
        this.registeredCustomersPerDay = customers.stream()
                .collect(Collectors.groupingBy(
                        customer -> customer.getRegistrationDate().toLocalDate(),
                        Collectors.counting()
                ));
        this.registeredDriversPerDay = drivers.stream()
                .collect(Collectors.groupingBy(
                        driver -> driver.getHireDate().toLocalDate(),
                        Collectors.counting()
                ));
        this.completedOrdersPerDay = drivers.stream()
                .flatMap(driver -> driver.getCompletedOrders().stream())
                .collect(Collectors.groupingBy(
                        order -> order.getOrderDate().toLocalDate(),
                        Collectors.counting()
                ));
        this.earningsPerDay = drivers.stream()
                .flatMap(driver -> driver.getCompletedOrders().stream())
                .collect(Collectors.groupingBy(
                        order -> order.getOrderDate().toLocalDate(),
                        Collectors.summingDouble(order -> {
                            Driver orderDriver = order.getDrivers().get(0);
                            return Double.parseDouble(order.getDistance().replace(',', '.')) * order.getOriginalDriverCosts().get(orderDriver);
                        }))
                );
    }
}
