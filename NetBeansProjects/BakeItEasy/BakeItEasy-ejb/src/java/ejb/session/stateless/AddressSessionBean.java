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
import error.exception.AddressNotFoundException;
import error.exception.BuyerNotFoundException;
import error.exception.InputDataValidationException;
import error.exception.OrderNotFoundException;
import error.exception.SellerNotFoundException;
import error.exception.UnknownPersistenceException;
import java.util.List;
import java.util.Set;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceException;
import javax.persistence.Query;
import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

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
    
    private final ValidatorFactory validatorFactory;
    private final Validator validator;

    public AddressSessionBean() {
        this.validatorFactory = Validation.buildDefaultValidatorFactory();
        this.validator = validatorFactory.getValidator();
    }
    
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
    public Long createNewAddress(Address address) throws UnknownPersistenceException, InputDataValidationException {
        Set<ConstraintViolation<Address>> constraintViolations = validator.validate(address);

        if (constraintViolations.isEmpty()) {
            try {
                em.persist(address);
                em.flush();
                return address.getAddressId();
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
    public List<Address> retrieveAllAddresses() {
        Query query = em.createQuery("SELECT a FROM Address a");
        return query.getResultList();
    }
    
    // remove address from buyer
    @Override
    public void removeBuyerAddress(Long buyerId) throws BuyerNotFoundException {
        Buyer buyer = buyerSessionBeanLocal.retrieveBuyerById(buyerId);
        buyer.setAddress(null);
    }
    
    // remove address from seller
    @Override
    public void removeSellerAddress(Long sellerId) throws SellerNotFoundException {
        Seller seller = sellerSessionBeanLocal.retrieveSellerBySellerId(sellerId);
        seller.setAddress(null);
    }
    
    // remove address from order
    @Override
    public void removeOrderAddress(Long orderId) throws OrderNotFoundException {
        Order order = orderSessionBeanLocal.retrieveOrderById(orderId);
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
    
    private String prepareInputDataValidationErrorsMessage(Set<ConstraintViolation<Address>> constraintViolations) {
        String msg = "Input data validation error!:";

        for (ConstraintViolation constraintViolation : constraintViolations) {
            msg += "\n\t" + constraintViolation.getPropertyPath() + " - " + constraintViolation.getInvalidValue() + "; " + constraintViolation.getMessage();
        }

        return msg;
    }
    
}
