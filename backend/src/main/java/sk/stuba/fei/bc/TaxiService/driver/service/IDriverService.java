package sk.stuba.fei.bc.TaxiService.driver.service;

import sk.stuba.fei.bc.TaxiService.customer.web.bodies.ChangePasswordRequest;
import sk.stuba.fei.bc.TaxiService.driver.web.bodies.DetailsResponse;
import sk.stuba.fei.bc.TaxiService.driver.web.bodies.GetActiveOrdersResponse;
import sk.stuba.fei.bc.TaxiService.driver.web.bodies.GetPastOrdersResponse;
import sk.stuba.fei.bc.TaxiService.exception.IllegalOperationException;

public interface IDriverService {
    DetailsResponse getUserInfo();
    void changePassword(ChangePasswordRequest request) throws IllegalOperationException;
    void deleteProfile();
    GetActiveOrdersResponse getAllActiveOrdersResponse();
    GetPastOrdersResponse getAllPastOrdersResponse();
    void acceptOrder(Long orderId);
    void denyOrder(Long orderId);
    void deleteDeniedOrder(Long orderId);
    void uploadProfilePicture(String url);
    void deleteProfilePicture();
}
