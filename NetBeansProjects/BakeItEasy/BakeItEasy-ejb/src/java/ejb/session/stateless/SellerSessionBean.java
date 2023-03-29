/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Listing;
import entity.Order;
import entity.Report;
import entity.Seller;
import enumeration.OrderStatus;
import error.exception.InputDataValidationException;
import error.exception.InvalidLoginCredentialException;
import error.exception.OrderIsNotAcceptedException;
import error.exception.OrderIsNotPendingException;
import error.exception.OrderNotFoundException;
import error.exception.SellerEmailExistException;
import error.exception.SellerHasOutstandingOrdersException;
import error.exception.SellerNotFoundException;
import error.exception.SellerPhoneNumberExistException;
import error.exception.SellerUsernameExistException;
import error.exception.UnknownPersistenceException;
import java.util.List;
import java.util.Set;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.NonUniqueResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceException;
import javax.persistence.Query;
import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

/**
 *
 * @author aaronf
 */
@Stateless
public class SellerSessionBean implements SellerSessionBeanLocal {

    @EJB(name = "ListingSessionBeanLocal")
    private ListingSessionBeanLocal listingSessionBeanLocal;

    @EJB(name = "OrderSessionBeanLocal")
    private OrderSessionBeanLocal orderSessionBeanLocal;

    @PersistenceContext(unitName = "BakeItEasy-ejbPU")
    private EntityManager em;

    private final ValidatorFactory validatorFactory;
    private final Validator validator;

    public SellerSessionBean() {
        this.validatorFactory = Validation.buildDefaultValidatorFactory();
        this.validator = validatorFactory.getValidator();
    }

    @Override
    public Long createNewSeller(Seller newSeller) throws UnknownPersistenceException, InputDataValidationException, SellerUsernameExistException, SellerEmailExistException, SellerPhoneNumberExistException {
        Set<ConstraintViolation<Seller>> constraintViolations = validator.validate(newSeller);

        if (constraintViolations.isEmpty()) {
            try {
                if (isUsernameAvailable(newSeller.getUsername())) {
                    if (isEmailAvailable(newSeller.getEmail())) {
                        if (isPhoneNumberAvailable(newSeller.getPhoneNo())) {
                            em.persist(newSeller);
                            em.flush();
                            return newSeller.getSellerId();
                        } else {
                            throw new SellerUsernameExistException();
                        }
                    } else {
                        throw new SellerEmailExistException();
                    }
                } else {
                    throw new SellerPhoneNumberExistException();
                }
            } catch (PersistenceException ex) {
                if (ex.getCause() != null && ex.getCause().getClass().getName().equals("org.eclipse.persistence.exceptions.DatabaseException")) {
                    if (ex.getCause().getCause() != null && ex.getCause().getCause().getClass().getName().equals("java.sql.SQLIntegrityConstraintViolationException")) {
                        throw new SellerUsernameExistException();
                    } else {
                        throw new UnknownPersistenceException(ex.getMessage());
                    }
                } else {
                    throw new UnknownPersistenceException(ex.getMessage());
                }
            } catch (SellerUsernameExistException ex) {
                throw new SellerUsernameExistException();
            } catch (SellerEmailExistException ex) {
                throw new SellerEmailExistException();
            } catch (SellerPhoneNumberExistException ex) {
                throw new SellerPhoneNumberExistException();
            }
        } else {
            throw new InputDataValidationException(prepareInputDataValidationErrorsMessage(constraintViolations));
        }
    }

    // seller must not have outstanding orders
    @Override
    public void deleteSeller(Long sellerId) throws SellerNotFoundException, SellerHasOutstandingOrdersException {
        try {
            Seller seller = retrieveSellerBySellerId(sellerId);

            for (Listing individualListing : seller.getListings()) { // check that this listing is not tied to any outstanding orders first
                if (listingSessionBeanLocal.doesListingHaveOutstandingOrders(individualListing)) {
                    throw new SellerHasOutstandingOrdersException("Seller has outstanding orders (Pending/Accepted), please handle before deletion!");
                }
            }
            
            List<Listing> sellerListings = seller.getListings();
            List<Report> sellerReports = seller.getReports();
            
            for (Listing individualListing : sellerListings) {
                em.remove(individualListing);
            }
            
            for (Report reportAgainst : sellerReports) {
               em.remove(reportAgainst);
            }

            em.remove(seller);
        } catch (SellerNotFoundException ex) {
            throw new SellerNotFoundException(ex.getMessage());
        } catch (SellerHasOutstandingOrdersException ex) {
            throw new SellerHasOutstandingOrdersException(ex.getMessage());
        }
    }

    @Override
    public Seller sellerLogin(String email, String password) throws InvalidLoginCredentialException, SellerNotFoundException {
        try {
            Query query = em.createQuery("SELECT s FROM Seller s WHERE s.email = :inEmail");
            query.setParameter("inEmail", email);
            Seller seller = (Seller) query.getSingleResult();

            if (seller != null) {

                if (seller.getPassword().equals(password)) {
                    return seller;
                } else {
                    throw new InvalidLoginCredentialException("Invalid login credentials for: " + email);
                }
            } else {
                throw new SellerNotFoundException("Seller with email " + email + " not found!");
            }
        } catch (NoResultException ex) {
            throw new SellerNotFoundException("Seller with email " + email + " not found!");
        }
    }

    @Override
    public Seller retrieveSellerBySellerId(Long sellerId) throws SellerNotFoundException {
        Seller seller = em.find(Seller.class, sellerId);

        if (seller != null) {
            return seller;
        } else {
            throw new SellerNotFoundException("Seller ID: " + sellerId + " does not exist!");
        }
    }

    @Override
    public Seller retrieveSellerByUsername(String username) throws SellerNotFoundException {
        Query query = em.createQuery("SELECT s FROM Seller s WHERE s.username = :inUsername");
        query.setParameter("inUsername", username);

        try {
            return (Seller) query.getSingleResult();
        } catch (NoResultException | NonUniqueResultException ex) {
            throw new SellerNotFoundException("Seller username: " + username + " does not exist!");
        }
    }

    @Override
    public Seller retrieveSellerByEmail(String email) throws SellerNotFoundException {
        Query query = em.createQuery("SELECT s FROM Seller s WHERE s.email = :inEmail");
        query.setParameter("inEmail", email);

        try {
            return (Seller) query.getSingleResult();
        } catch (NoResultException | NonUniqueResultException ex) {
            throw new SellerNotFoundException("Seller email: " + email + " does not exist!");
        }
    }

    @Override
    public Seller retrieveSellerByPhoneNumber(String phoneNo) throws SellerNotFoundException {
        Query query = em.createQuery("SELECT s FROM Seller s WHERE s.phoneNo = :inPhoneNumber");
        query.setParameter("inPhoneNumber", phoneNo);

        try {
            return (Seller) query.getSingleResult();
        } catch (NoResultException | NonUniqueResultException ex) {
            throw new SellerNotFoundException("Seller phone number: " + phoneNo + " does not exist!");
        }
    }

    @Override
    public List<Seller> retrieveAllSellers() {
        Query query = em.createQuery("SELECT s FROM Seller s");
        return query.getResultList();
    }

    // UPDATE TO SEE WHICH FIELDS CAN BE UPDATED
    @Override
    public void updateSeller(Seller updatedSeller) throws InputDataValidationException, SellerNotFoundException {
        Set<ConstraintViolation<Seller>> constraintViolations = validator.validate(updatedSeller);

        if (constraintViolations.isEmpty()) {
            Seller sellerToUpdate = retrieveSellerBySellerId(updatedSeller.getSellerId());
            sellerToUpdate.setName(updatedSeller.getName());
            sellerToUpdate.setPassword(updatedSeller.getPassword());
            sellerToUpdate.setPhoneNo(updatedSeller.getPhoneNo());
        } else {
            throw new InputDataValidationException(prepareInputDataValidationErrorsMessage(constraintViolations));
        }
    }
    // DELETE TO SEE WHAT ORDER IMPLEMENTED (I.E. ORDER STATUS)

    // TO DO: CHANGE ORDER STATUS (WHEN SELLER ACCEPTS ORDER)
    @Override
    public void acceptOrder(Long orderId) throws OrderNotFoundException, OrderIsNotPendingException {
        Order orderToAccept = orderSessionBeanLocal.retrieveOrderById(orderId);
        if (orderToAccept.getOrderStatus() == OrderStatus.PENDING) {
            orderToAccept.setOrderStatus(OrderStatus.ACCEPTED);
            orderSessionBeanLocal.editOrder(orderToAccept);
        } else {
            throw new OrderIsNotPendingException("Order unable to be accepted as it is not in pending state!");
        }
    }

    @Override
    public void rejectOrder(Long orderId) throws OrderNotFoundException, OrderIsNotPendingException {
        Order orderToReject = orderSessionBeanLocal.retrieveOrderById(orderId);
        if (orderToReject.getOrderStatus() == OrderStatus.PENDING) {
            orderToReject.setOrderStatus(OrderStatus.REJECTED);
            orderSessionBeanLocal.editOrder(orderToReject);
        } else {
            throw new OrderIsNotPendingException("Order unable to be rejected as it is not in pending state!");
        }
    }

    @Override
    public void completeOrder(Long orderId) throws OrderNotFoundException, OrderIsNotAcceptedException {
        Order orderToAccept = orderSessionBeanLocal.retrieveOrderById(orderId);
        if (orderToAccept.getOrderStatus() == OrderStatus.ACCEPTED) {
            orderToAccept.setOrderStatus(OrderStatus.COMPLETED);
            orderSessionBeanLocal.editOrder(orderToAccept);
        } else {
            throw new OrderIsNotAcceptedException("Order unable to be accepted as it is not in pending state!");
        }
    }

    private boolean isUsernameAvailable(String username) {
        Query query = em.createQuery("SELECT s FROM Seller s WHERE s.username = :inUsername");
        query.setParameter("inUsername", username);
        List<Seller> sellers = query.getResultList();

        return sellers.isEmpty();
    }

    private boolean isEmailAvailable(String email) {
        Query query = em.createQuery("SELECT s FROM Seller s WHERE s.email = :inEmail");
        query.setParameter("inEmail", email);
        List<Seller> sellers = query.getResultList();

        return sellers.isEmpty();
    }

    private boolean isPhoneNumberAvailable(String phoneNo) {
        Query query = em.createQuery("SELECT s FROM Seller s WHERE s.phoneNo = :inPhoneNumber");
        query.setParameter("inPhoneNumber", phoneNo);
        List<Seller> sellers = query.getResultList();

        return sellers.isEmpty();
    }

    private String prepareInputDataValidationErrorsMessage(Set<ConstraintViolation<Seller>> constraintViolations) {
        String msg = "Input data validation error!:";

        for (ConstraintViolation constraintViolation : constraintViolations) {
            msg += "\n\t" + constraintViolation.getPropertyPath() + " - " + constraintViolation.getInvalidValue() + "; " + constraintViolation.getMessage();
        }

        return msg;
    }
}