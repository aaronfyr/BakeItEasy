/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Address;
import error.exception.AddressNotFoundException;
import error.exception.BuyerNotFoundException;
import error.exception.InputDataValidationException;
import error.exception.OrderNotFoundException;
import error.exception.SellerNotFoundException;
import error.exception.UnknownPersistenceException;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author elysia
 */
@Local
public interface AddressSessionBeanLocal {

    public Address retrieveAddressById(Long addressId) throws AddressNotFoundException;

    public Long createNewAddress(Address address) throws UnknownPersistenceException, InputDataValidationException;

    public List<Address> retrieveAllAddresses();

    public void removeBuyerAddress(Long buyerId) throws BuyerNotFoundException;

    public void removeSellerAddress(Long sellerId) throws SellerNotFoundException;

    public void removeOrderAddress(Long orderId) throws OrderNotFoundException;

    public void removeAddress(Long addressId) throws AddressNotFoundException;

}
