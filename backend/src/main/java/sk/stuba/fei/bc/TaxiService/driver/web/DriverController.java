package sk.stuba.fei.bc.TaxiService.driver.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sk.stuba.fei.bc.TaxiService.customer.web.bodies.ChangePasswordRequest;
import sk.stuba.fei.bc.TaxiService.customer.web.bodies.ProfilePictureRequest;
import sk.stuba.fei.bc.TaxiService.driver.service.IDriverService;
import sk.stuba.fei.bc.TaxiService.driver.web.bodies.DetailsResponse;
import sk.stuba.fei.bc.TaxiService.driver.web.bodies.GetActiveOrdersResponse;
import sk.stuba.fei.bc.TaxiService.driver.web.bodies.GetPastOrdersResponse;
import sk.stuba.fei.bc.TaxiService.exception.IllegalOperationException;


@RestController
@RequestMapping("/driver")
public class DriverController {

    @Autowired
    private IDriverService service;

    @GetMapping("/info")
    public ResponseEntity<DetailsResponse> getUserInfo() {
        return ResponseEntity.ok(this.service.getUserInfo());
    }

    @PutMapping("/change-password")
    public void changePassword(@RequestBody ChangePasswordRequest request) throws IllegalOperationException {
        this.service.changePassword(request);
    }

    @PostMapping("/upload-pic")
    public void uploadProfilePicture(@RequestBody ProfilePictureRequest request) {
        this.service.uploadProfilePicture(request.getUrl());
    }

    @DeleteMapping("/delete-pic")
    public void deleteProfilePicture() {
        this.service.deleteProfilePicture();
    }

    @DeleteMapping("/delete")
    public void deleteProfile() {
        this.service.deleteProfile();
    }

    @GetMapping("/active-orders")
    public GetActiveOrdersResponse getAllActiveOrdersResponse(){
        return this.service.getAllActiveOrdersResponse();
    }

    @GetMapping("/past-orders")
    public GetPastOrdersResponse getAllPastOrdersResponse(){
        return this.service.getAllPastOrdersResponse();
    }

    @GetMapping("/accept-order/{orderId}")
    public void acceptOrder(@PathVariable Long orderId) {
        this.service.acceptOrder(orderId);
    }

    @DeleteMapping("/deny-order/{orderId}")
    public void denyOrder(@PathVariable Long orderId) {
        this.service.denyOrder(orderId);
    }

    @DeleteMapping("/delete-denied/{orderId}")
    public void deleteDeniedOrder(@PathVariable Long orderId) {
        this.service.deleteDeniedOrder(orderId);
    }
}
