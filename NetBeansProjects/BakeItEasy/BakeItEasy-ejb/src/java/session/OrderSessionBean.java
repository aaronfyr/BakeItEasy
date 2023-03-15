/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Order;
import error.OrderNotFoundException;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author Nelson Choo
 */
@Stateless
public class OrderSessionBean implements OrderSessionBeanLocal {

    @PersistenceContext(unitName = "BakeItEasy-ejbPU")
    private EntityManager em;

    // Add business logic below. (Right-click in editor and choose
    // "Insert Code > Add Business Method")
    
    @Override
    public Long createNewOrder(Order order) {
        em.persist(order);
        em.flush();
        
        return order.getOrderId();
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
}
