/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Address;
import entity.Buyer;
import entity.Order;
import entity.Seller;
import error.AddressNotFoundException;
import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

/**
 *
 * @author elysia
 */
@Stateless
public class AddressSessionBean implements AddressSessionBeanLocal {

    @PersistenceContext(unitName = "BakeItEasy-ejbPU")
    private EntityManager em;
    
    @EJB
    private AddressSessionBeanLocal addressSessionBeanLocal;
    
    @EJB
    private BuyerSessionBeanLocal buyerSessionBeanLocal;
    
    @EJB
    private SellerSessionBeanLocal sellerSessionBeanLocal;
    
    @EJB
    private OrderSessionBeanLocal orderSessionBeanLocal;
    
    @Override
    public Address retrieveAddressById(Long addressId) throws AddressNotFoundException {
        Address address = em.find(Address.class, addressId);

        if (address != null) {
            return address;
        } else {
            throw new AddressNotFoundException("Address does not exist: " + addressId);
        }
    }
    
    @Override
    public Long createNewAddress(Address address) {
        em.persist(address);
        em.flush();
        return address.getAddressId();
    }
    
    @Override
    public List<Address> retrieveAllAddresses() {
        Query query = em.createQuery("SELECT a FROM Address a");
        return query.getResultList();
    }
    
    // remove address from buyer
    @Override
    public void removeBuyerAddress(Long buyerId) throws AddressNotFoundException {
        Buyer buyer = buyerSessionBeanLocal.retrieveBuyerById(buyerId);
        Address address = buyer.getAddress();
        buyer.setAddress(null);
    }
    
    // remove address from seller
    @Override
    public void removeSellerAddress(Long sellerId) throws AddressNotFoundException {
        Seller seller = sellerSessionBeanLocal.retrieveSellerById(sellerId);
        Address address = seller.getAddress();
        seller.setAddress(null);
    }
    
    // remove address from order
    @Override
    public void removeOrderAddress(Long orderId) throws AddressNotFoundException {
        Order order = orderSessionBeanLocal.retrieveOrderById(orderId);
        Address address = order.getAddress();
        order.setAddress(null);
    }
    
    // remove address from db
    @Override
    public void removeAddress(Long addressId) throws AddressNotFoundException {
        Address address = addressSessionBeanLocal.retrieveAddressById(addressId);
        
        Query query = em.createQuery("SELECT b FROM Buyer b WHERE b.address.addressId = :inAddressId");
        query.setParameter("inAddressId", addressId);
        List<Buyer> buyers = query.getResultList();
        for (Buyer buyer : buyers) {
            buyer.setAddress(null);
        }
        
        query = em.createQuery("SELECT s FROM Seller s WHERE s.address.addressId = :inAddressId");
        query.setParameter("inAddressId", addressId);
        List<Seller> sellers = query.getResultList();
        for (Seller seller : sellers) {
            seller.setAddress(null);
        }
        
        query = em.createQuery("SELECT o FROM Order o WHERE o.address.addressId = :inAddressId");
        query.setParameter("inAddressId", addressId);
        List<Order> orders = query.getResultList();
        for (Order order : orders) {
            order.setAddress(null);
        }
        
        em.remove(address);
    }
    
}
