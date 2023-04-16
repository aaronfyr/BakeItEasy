/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Buyer;
import entity.Listing;
import entity.Order;
import entity.Seller;
import error.exception.BuyerNotFoundException;
import error.exception.InputDataValidationException;
import error.exception.ListingNotFoundException;
import error.exception.OrderNotFoundException;
import error.exception.SellerNotFoundException;
import error.exception.UnknownPersistenceException;
import java.util.List;
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
    
    public Long createNewOrder(Order order, Long buyerId, Long listingId) throws BuyerNotFoundException, ListingNotFoundException, UnknownPersistenceException, InputDataValidationException;

    public List<Order> getBuyerOrders(Long buyerId) throws BuyerNotFoundException;

    public List<Order> getSellerOrders(Long sellerId) throws SellerNotFoundException;

    public Buyer getOrderBuyer(Long orderId) throws OrderNotFoundException;

    public Listing getListing(Long orderId) throws OrderNotFoundException;

    public Seller getSeller(Long orderId) throws OrderNotFoundException;

    public String getSellerPhoneNoByOrderId(Long orderId) throws OrderNotFoundException;
    
}
