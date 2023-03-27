/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Order;
import error.exception.BuyerNotFoundException;
import error.exception.InputDataValidationException;
import error.exception.ListingNotFoundException;
import error.exception.OrderNotFoundException;
import error.exception.SellerNotFoundException;
import error.exception.UnknownPersistenceException;
import javax.ejb.Local;

/**
 *
 * @author Nelson Choo
 */
@Local
public interface OrderSessionBeanLocal {

    public Order retrieveOrderById(Long orderId) throws OrderNotFoundException;

    public void editOrder(Order order) throws OrderNotFoundException;

    public void deleteOrder(Long orderId) throws OrderNotFoundException;

    public Long createNewOrder(Order order, Long buyerId, Long sellerId, Long listingId) throws SellerNotFoundException, BuyerNotFoundException, ListingNotFoundException, UnknownPersistenceException, InputDataValidationException;
    
}
