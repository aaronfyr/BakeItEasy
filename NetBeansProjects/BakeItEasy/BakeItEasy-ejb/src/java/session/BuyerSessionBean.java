/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Buyer;
import error.BuyerNotFoundException;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

/**
 *
 * @author Nelson Choo
 */
@Stateless
public class BuyerSessionBean implements BuyerSessionBeanLocal {

    @PersistenceContext(unitName = "BakeItEasy-ejbPU")
    private EntityManager em;

    // Add business logic below. (Right-click in editor and choose
    // "Insert Code > Add Business Method")
    
    @Override
    public Long createNewBuyer(Buyer buyer) {
        em.persist(buyer);
        em.flush();
        return buyer.getBuyerId();
    }
    
    @Override
    public Buyer retrieveBuyerById(Long buyerId) throws BuyerNotFoundException {
        Buyer buyer = em.find(Buyer.class, buyerId);
        
        if (buyer != null) {
            buyer.getReviews().size();
            buyer.getOrders().size();
            buyer.getReports().size();
            buyer.getPosts().size();
            buyer.getComments().size();
            return buyer;
        } else {
            throw new BuyerNotFoundException("Buyer " + buyerId + " does not exist.");
        }
    }
    
    @Override
    public List<Buyer> searchBuyersByName(String name) {
        Query q;
        if (name != null) {
            q = em.createQuery("SELECT b FROM Buyer b WHERE LOWER(b.name) LIKE :inName");
            q.setParameter("inName", "%" + name.toLowerCase() + "%");
        } else {
            q = em.createQuery("SELECT b FROM Buyer b");
        }
        
        return q.getResultList();
    }
    
    @Override
    public void editBuyer(Buyer buyer) throws BuyerNotFoundException {
        try {
            Buyer buyerToUpdate = retrieveBuyerById(buyer.getBuyerId());
            
            buyerToUpdate.setName(buyer.getName());
            buyerToUpdate.setEmail(buyer.getEmail());
            buyerToUpdate.setUsername(buyer.getUsername());
            buyerToUpdate.setPassword(buyer.getPassword());
            buyerToUpdate.setPhoneNo(buyer.getPhoneNo());
            buyerToUpdate.setIsBanned(buyer.isIsBanned());
        } catch (BuyerNotFoundException ex) {
            throw new BuyerNotFoundException(ex.getMessage());
        }
    }
    
    @Override
    public void deleteBuyer(Long buyerId) throws BuyerNotFoundException {
        try {
            Buyer buyer = retrieveBuyerById(buyerId);
            
            em.remove(buyer);
        } catch (BuyerNotFoundException ex) {
            throw new BuyerNotFoundException(ex.getMessage());
        }
    }
}
