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
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceException;
import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

/**
 *
 * @author Nelson Choo
 */
@Stateless
public class OrderSessionBean implements OrderSessionBeanLocal {

    @EJB
    private SellerSessionBeanLocal sellerSessionBeanLocal;
    
    @EJB
    private BuyerSessionBeanLocal buyerSessionBeanLocal;
    
    @EJB
    private ListingSessionBeanLocal listingSessionBeanLocal;
    
    @PersistenceContext(unitName = "BakeItEasy-ejbPU")
    private EntityManager em;
    
    private final ValidatorFactory validatorFactory;
    private final Validator validator;

    public OrderSessionBean() {
        this.validatorFactory = Validation.buildDefaultValidatorFactory();
        this.validator = validatorFactory.getValidator();
    }
    
    @Override
    public Long createNewOrder(Order order, Long buyerId, Long listingId) throws BuyerNotFoundException, ListingNotFoundException, UnknownPersistenceException, InputDataValidationException {
        Set<ConstraintViolation<Order>> constraintViolations = validator.validate(order);

        if (constraintViolations.isEmpty()) {
            try {
                Buyer buyer = buyerSessionBeanLocal.retrieveBuyerById(buyerId);
                buyer.getOrders().add(order);               
                Listing listing = listingSessionBeanLocal.retrieveListingByListingId(listingId);
                listing.getOrders().add(order);
                order.setBuyer(buyer);
                order.setListing(listing);
                em.persist(order);
                em.flush();
                return order.getOrderId();
            } catch (PersistenceException ex) {
                if (ex.getCause() != null && ex.getCause().getClass().getName().equals("org.eclipse.persistence.exceptions.DatabaseException")) {
                    if (ex.getCause().getCause() != null && ex.getCause().getCause().getClass().getName().equals("java.sql.SQLIntegrityConstraintViolationException")) {
                        throw new UnknownPersistenceException(ex.getMessage());
                    } else {
                        throw new UnknownPersistenceException(ex.getMessage());
                    }
                } else {
                    throw new UnknownPersistenceException(ex.getMessage());
                }
            }
        } else {
            throw new InputDataValidationException(prepareInputDataValidationErrorsMessage(constraintViolations));
        }
    }
    
    @Override
    public Order retrieveOrderById(Long orderId) throws OrderNotFoundException {
        Order order = em.find(Order.class, orderId);
        
        if (order != null) {
            return order;
        } else {
            throw new OrderNotFoundException("Order " + orderId + " does not exist.");
        }
    }
    
    @Override
    public void editOrder(Order order) throws OrderNotFoundException {
        try {
            Order orderToUpdate = retrieveOrderById(order.getOrderId());
            
            orderToUpdate.setPrice(order.getPrice());
            orderToUpdate.setQuantity(order.getQuantity());
            orderToUpdate.setDescription(order.getDescription());
            orderToUpdate.setOrderStatus(order.getOrderStatus());
            orderToUpdate.setAddress(order.getAddress());
        } catch (OrderNotFoundException ex) {
            throw new OrderNotFoundException(ex.getMessage());
        }
    }
    
    @Override
    public void deleteOrder(Long orderId) throws OrderNotFoundException {
        try {
            Order order = retrieveOrderById(orderId);
            
            order.getListing().getOrders().remove(order);
            em.remove(order);
        } catch (OrderNotFoundException ex) {
            throw new OrderNotFoundException(ex.getMessage());
        }
    }
    
    @Override
    public List<Order> getBuyerOrders(Long buyerId) throws BuyerNotFoundException {
        try {
            Buyer buyer = buyerSessionBeanLocal.retrieveBuyerById(buyerId);
            
            return buyer.getOrders();
        } catch (BuyerNotFoundException ex) {
            throw new BuyerNotFoundException(ex.getMessage());
        }
    }
    
    @Override
    public List<Order> getSellerOrders(Long sellerId) throws SellerNotFoundException {
        try {
            Seller seller = sellerSessionBeanLocal.retrieveSellerBySellerId(sellerId);
            
            List<Order> result = new ArrayList<Order>();
            
            for (Listing listing: seller.getListings()) {
                List<Order> orders = listing.getOrders();
                
                result.addAll(orders);
            }
            
            return result;
        } catch (SellerNotFoundException ex) {
            throw new SellerNotFoundException(ex.getMessage());
        }
    }
    
    private String prepareInputDataValidationErrorsMessage(Set<ConstraintViolation<Order>> constraintViolations) {
        String msg = "Input data validation error!:";

        for (ConstraintViolation constraintViolation : constraintViolations) {
            msg += "\n\t" + constraintViolation.getPropertyPath() + " - " + constraintViolation.getInvalidValue() + "; " + constraintViolation.getMessage();
        }

        return msg;
    }
}
