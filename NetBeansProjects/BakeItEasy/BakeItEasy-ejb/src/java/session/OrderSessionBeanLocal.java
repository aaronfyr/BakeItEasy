/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Order;
import error.OrderNotFoundException;
import javax.ejb.Local;

/**
 *
 * @author Nelson Choo
 */
@Local
public interface OrderSessionBeanLocal {

    public Long createNewOrder(Order order);

    public Order retrieveOrderById(Long orderId) throws OrderNotFoundException;

    public void editOrder(Order order) throws OrderNotFoundException;

    public void deleteOrder(Long orderId) throws OrderNotFoundException;
    
}
