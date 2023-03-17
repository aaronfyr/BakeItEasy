/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Address;
import error.AddressNotFoundException;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author elysia
 */
@Local
public interface AddressSessionBeanLocal {

    public Address retrieveAddressById(Long addressId) throws AddressNotFoundException;

    public Long createNewAddress(Address address);

    public List<Address> retrieveAllAddresses();

    public void removeBuyerAddress(Long buyerId) throws AddressNotFoundException;

    public void removeSellerAddress(Long sellerId) throws AddressNotFoundException;

    public void removeOrderAddress(Long orderId) throws AddressNotFoundException;

    public void removeAddress(Long addressId) throws AddressNotFoundException;
    
}
