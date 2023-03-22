/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Buyer;
import error.exception.BuyerNotFoundException;
import error.exception.InputDataValidationException;
import error.exception.InvalidLoginCredentialException;
import error.exception.SellerNotFoundException;
import error.exception.UnknownPersistenceException;
import java.util.List;
import java.util.Set;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceException;
import javax.persistence.Query;
import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

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
    
    private final ValidatorFactory validatorFactory;
    private final Validator validator;

    public BuyerSessionBean() {
        this.validatorFactory = Validation.buildDefaultValidatorFactory();
        this.validator = validatorFactory.getValidator();
    }
    
    @Override
    public Long createNewBuyer(Buyer buyer) throws UnknownPersistenceException, InputDataValidationException {
        Set<ConstraintViolation<Buyer>> constraintViolations = validator.validate(buyer);

        if (constraintViolations.isEmpty()) {
            try {
                em.persist(buyer);
                em.flush();
                return buyer.getBuyerId();
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
            buyerToUpdate.setAddress(buyer.getAddress());
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
    
    @Override
    public Buyer buyerLogin(String username, String password) throws InvalidLoginCredentialException, BuyerNotFoundException {
        try {
            Query query = em.createQuery("SELECT b FROM Buyer b WHERE b.username = :inUsername");
            query.setParameter("inUsername", username);
            Buyer buyer = (Buyer) query.getSingleResult();

            if (buyer != null) {

                if (buyer.getPassword().equals(password)) {
                    return buyer;
                } else {
                    throw new InvalidLoginCredentialException("Invalid login credentials for: " + username);
                }
            } else {
                throw new BuyerNotFoundException("Buyer with username " + username + " not found!");
            }
        } catch (NoResultException ex) {
            throw new BuyerNotFoundException("Buyer with username " + username + " not found!");
        }
    }
    
    private String prepareInputDataValidationErrorsMessage(Set<ConstraintViolation<Buyer>> constraintViolations) {
        String msg = "Input data validation error!:";

        for (ConstraintViolation constraintViolation : constraintViolations) {
            msg += "\n\t" + constraintViolation.getPropertyPath() + " - " + constraintViolation.getInvalidValue() + "; " + constraintViolation.getMessage();
        }

        return msg;
    }

}
