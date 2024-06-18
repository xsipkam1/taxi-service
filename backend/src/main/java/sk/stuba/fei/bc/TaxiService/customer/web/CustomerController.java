package sk.stuba.fei.bc.TaxiService.customer.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sk.stuba.fei.bc.TaxiService.customer.service.ICustomerService;
import sk.stuba.fei.bc.TaxiService.customer.web.bodies.*;
import sk.stuba.fei.bc.TaxiService.exception.IllegalOperationException;

import java.util.List;


@RestController
@RequestMapping("/customer")
public class CustomerController {
    @Autowired
    private ICustomerService service;

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

    @PostMapping("/get-available-drivers")
    public List<GetDriverResponse> getAvailableDrivers(@RequestBody GetAvailableDriversRequest body) {
        return this.service.getAvailableDrivers(body);
    }

    @PostMapping("/order")
    public void createTaxiOrder(@RequestBody OrderRequest order) throws IllegalOperationException{
        this.service.createTaxiOrder(order);
    }

    @GetMapping("/active-orders")
    public GetActiveOrdersResponse getAllActiveOrdersResponse(){
        return this.service.getAllActiveOrdersResponse();
    }

    @GetMapping("/past-orders")
    public GetPastOrdersResponse getAllPastOrdersResponse(){
        return this.service.getAllPastOrdersResponse();
    }

    @DeleteMapping("/order/{orderId}")
    public void cancelOrder(@PathVariable Long orderId) {
        this.service.cancelOrder(orderId);
    }

    @DeleteMapping("/delete-denied/{orderId}")
    public void deleteDeniedOrder(@PathVariable Long orderId) {
        this.service.deleteDeniedOrder(orderId);
    }

    @PostMapping("/post-review/{orderId}")
    public void postReview(@PathVariable Long orderId, @RequestBody ReviewRequest body) {
        this.service.postReview(orderId, body);
    }
}
