package sk.stuba.fei.bc.TaxiService.customer.service;

import sk.stuba.fei.bc.TaxiService.customer.web.bodies.*;
import sk.stuba.fei.bc.TaxiService.exception.IllegalOperationException;

import java.util.List;

public interface ICustomerService {
    DetailsResponse getUserInfo();
    void changePassword(ChangePasswordRequest request) throws IllegalOperationException;
    void deleteProfile();
    List<GetDriverResponse> getAvailableDrivers(GetAvailableDriversRequest body);
    void createTaxiOrder(OrderRequest order) throws IllegalOperationException;
    GetActiveOrdersResponse getAllActiveOrdersResponse();
    GetPastOrdersResponse getAllPastOrdersResponse();
    void cancelOrder(Long orderId);
    void deleteDeniedOrder(Long orderId);
    void postReview(Long orderId, ReviewRequest body);
    void uploadProfilePicture(String url);
    void deleteProfilePicture();
}
