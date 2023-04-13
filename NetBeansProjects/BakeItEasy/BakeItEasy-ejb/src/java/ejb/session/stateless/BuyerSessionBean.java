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
import enumeration.OrderStatus;
import error.exception.BuyerEmailExistException;
import error.exception.BuyerIsBannedException;
import error.exception.BuyerIsFollowingSellerAlreadyException;
import error.exception.BuyerIsNotFollowingSellerException;
import error.exception.BuyerNotFoundException;
import error.exception.BuyerPhoneNumberExistException;
import error.exception.BuyerUsernameExistException;
import error.exception.InputDataValidationException;
import error.exception.InvalidLoginCredentialException;
import error.exception.ListingNotFoundException;
import error.exception.OrderIsNotPendingException;
import error.exception.OrderNotFoundException;
import error.exception.SellerNotFoundException;
import error.exception.UnknownPersistenceException;
import java.util.List;
import java.util.Set;
import javax.ejb.EJB;
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

    @EJB(name = "SellerSessionBeanLocal")
    private SellerSessionBeanLocal sellerSessionBeanLocal;

    @EJB(name = "ListingSessionBeanLocal")
    private ListingSessionBeanLocal listingSessionBeanLocal;

    @EJB
    private OrderSessionBeanLocal orderSessionBeanLocal;

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
    public Long createNewBuyer(Buyer buyer) throws UnknownPersistenceException, InputDataValidationException, BuyerPhoneNumberExistException, BuyerEmailExistException, BuyerUsernameExistException {
        Set<ConstraintViolation<Buyer>> constraintViolations = validator.validate(buyer);

        if (constraintViolations.isEmpty()) {
            try {
                if (isUsernameAvailable(buyer.getUsername())) {
                    if (isEmailAvailable(buyer.getEmail())) {
                        if (isPhoneNumberAvailable(buyer.getPhoneNo())) {
                            em.persist(buyer);
                            em.flush();
                            return buyer.getBuyerId();
                        } else {
                            throw new BuyerPhoneNumberExistException("Phone number already exist!");
                        }
                    } else {
                        throw new BuyerEmailExistException("Email already exist!");
                    }
                } else {
                    throw new BuyerUsernameExistException("Username already exist!");
                }
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
            buyer.getOrders().size();
            buyer.getReports().size();
            buyer.getPosts().size();
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
            buyerToUpdate.setImagePath(buyer.getImagePath());
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
    public Buyer buyerLogin(String email, String password) throws InvalidLoginCredentialException, BuyerNotFoundException, BuyerIsBannedException {
        try {
            Query query = em.createQuery("SELECT b FROM Buyer b WHERE b.email = :inEmail");
            query.setParameter("inEmail", email);
            Buyer buyer = (Buyer) query.getSingleResult();

            if (buyer != null) {

                if (buyer.getPassword().equals(password)) {
                    if (!buyer.isIsBanned()) {
                        return buyer;
                    } else {
                        throw new BuyerIsBannedException("Buyer with email " + email + " is banned!");
                    }
                } else {
                    throw new InvalidLoginCredentialException("Invalid login credentials for: " + email);
                }
            } else {
                throw new BuyerNotFoundException("Buyer with email " + email + " not found!");
            }
        } catch (NoResultException ex) {
            throw new BuyerNotFoundException("Buyer with email " + email + " not found!");
        }
    }

    @Override
    public void cancelOrder(Long orderId) throws OrderNotFoundException, OrderIsNotPendingException {
        Order orderToCancel = orderSessionBeanLocal.retrieveOrderById(orderId);
        if (orderToCancel.getOrderStatus() == OrderStatus.PENDING) {
            orderToCancel.setOrderStatus(OrderStatus.CANCELLED);
            orderSessionBeanLocal.editOrder(orderToCancel);
        } else {
            throw new OrderIsNotPendingException("Order unable to be cancelled as it is not in pending state!");
        }
    }

    @Override
    public void updateBuyer(Buyer updatedBuyer) throws BuyerNotFoundException, BuyerPhoneNumberExistException, BuyerUsernameExistException, InputDataValidationException {
        Set<ConstraintViolation<Buyer>> constraintViolations = validator.validate(updatedBuyer);

        if (constraintViolations.isEmpty()) {
            Buyer buyerToUpdate = retrieveBuyerById(updatedBuyer.getBuyerId());

            // phone, username no change
            if (buyerToUpdate.getPhoneNo().equals(updatedBuyer.getPhoneNo())
                    && buyerToUpdate.getUsername().equals(updatedBuyer.getUsername())) {
                buyerToUpdate.setName(updatedBuyer.getName());
                buyerToUpdate.setPassword(updatedBuyer.getPassword());
                buyerToUpdate.setImagePath(updatedBuyer.getImagePath());
            } else if (!buyerToUpdate.getPhoneNo().equals(updatedBuyer.getPhoneNo())
                    && buyerToUpdate.getUsername().equals(updatedBuyer.getUsername())) { // phone change, username same
                if (isPhoneNumberAvailable(updatedBuyer.getPhoneNo())) {
                    buyerToUpdate.setName(updatedBuyer.getName());
                    buyerToUpdate.setPassword(updatedBuyer.getPassword());
                    buyerToUpdate.setPhoneNo(updatedBuyer.getPhoneNo());
                    buyerToUpdate.setImagePath(updatedBuyer.getImagePath());
                } else {
                    throw new BuyerPhoneNumberExistException("New phone number provided exist!");
                }
            } else if (buyerToUpdate.getPhoneNo().equals(updatedBuyer.getPhoneNo())
                    && !buyerToUpdate.getUsername().equals(updatedBuyer.getUsername())) { // phone same, username change
                if (isUsernameAvailable(updatedBuyer.getUsername())) {
                    buyerToUpdate.setName(updatedBuyer.getName());
                    buyerToUpdate.setPassword(updatedBuyer.getPassword());
                    buyerToUpdate.setUsername(updatedBuyer.getUsername());
                    buyerToUpdate.setImagePath(updatedBuyer.getImagePath());
                } else {
                    throw new BuyerUsernameExistException("New username provided exist!");
                }
            } else if (!buyerToUpdate.getPhoneNo().equals(updatedBuyer.getPhoneNo())
                    && !buyerToUpdate.getUsername().equals(updatedBuyer.getUsername())) { // phone change, username change
                if (isPhoneNumberAvailable(updatedBuyer.getPhoneNo())) {
                    if (isUsernameAvailable(updatedBuyer.getUsername())) {
                        buyerToUpdate.setName(updatedBuyer.getName());
                        buyerToUpdate.setPassword(updatedBuyer.getPassword());
                        buyerToUpdate.setPhoneNo(updatedBuyer.getPhoneNo());
                        buyerToUpdate.setUsername(updatedBuyer.getUsername());
                        buyerToUpdate.setImagePath(updatedBuyer.getImagePath());
                    } else {
                        throw new BuyerUsernameExistException("New username provided exist!");
                    }
                } else {
                    throw new BuyerPhoneNumberExistException("New phone number provided exist!");
                }
            }

        } else {
            throw new InputDataValidationException(prepareInputDataValidationErrorsMessage(constraintViolations));
        }
    }

    @Override
    public List<Seller> retrieveListOfFollowing(Long buyerId) throws BuyerNotFoundException {
        Buyer buyerFollower = retrieveBuyerById(buyerId);
        return buyerFollower.getFollowings();
    }

    @Override
    public void followSeller(Long buyerId, Long listingId) throws ListingNotFoundException, BuyerNotFoundException, BuyerIsFollowingSellerAlreadyException {
        if (!isFollowingSellerAlreadyListingId(buyerId, listingId)) { // if seller does not have this buyer as follower
            Seller sellerToFollow = listingSessionBeanLocal.retrieveSellerByListingId(listingId);
            Buyer buyerFollower = retrieveBuyerById(buyerId);

            buyerFollower.getFollowings().add(sellerToFollow);
            sellerToFollow.getFollowers().add(buyerFollower);
        } else {
            throw new BuyerIsFollowingSellerAlreadyException("Buyer is already following seller!");
        }
    }

    @Override
    public void unfollowSeller(Long buyerId, Long listingId) throws ListingNotFoundException, BuyerNotFoundException, BuyerIsNotFollowingSellerException {
        if (isFollowingSellerAlreadyListingId(buyerId, listingId)) { // if seller has this buyer as follower
            Seller sellerToUnfollow = listingSessionBeanLocal.retrieveSellerByListingId(listingId);
            Buyer buyerFollower = retrieveBuyerById(buyerId);

            buyerFollower.getFollowings().remove(sellerToUnfollow);
            sellerToUnfollow.getFollowers().remove(buyerFollower);
        } else {
            throw new BuyerIsNotFollowingSellerException("Buyer was not following seller! Unable to unfollow!");
        }
    }

    @Override
    public void followSellerThroughProfile(Long buyerId, Long sellerId) throws SellerNotFoundException, BuyerNotFoundException, BuyerIsFollowingSellerAlreadyException {
        if (!isFollowingSellerAlreadySellerId(buyerId, sellerId)) { // if seller does not have this buyer as follower
            Seller sellerToFollow = sellerSessionBeanLocal.retrieveSellerBySellerId(sellerId);
            Buyer buyerFollower = retrieveBuyerById(buyerId);

            buyerFollower.getFollowings().add(sellerToFollow);
            sellerToFollow.getFollowers().add(buyerFollower);
        } else {
            throw new BuyerIsFollowingSellerAlreadyException("Buyer is already following seller!");
        }
    }

    @Override
    public void unfollowSellerThroughProfile(Long buyerId, Long sellerId) throws SellerNotFoundException, BuyerNotFoundException, BuyerIsNotFollowingSellerException {
        if (isFollowingSellerAlreadySellerId(buyerId, sellerId)) { // if seller has this buyer as follower
            Seller sellerToUnfollow = sellerSessionBeanLocal.retrieveSellerBySellerId(sellerId);
            Buyer buyerFollower = retrieveBuyerById(buyerId);

            buyerFollower.getFollowings().remove(sellerToUnfollow);
            sellerToUnfollow.getFollowers().remove(buyerFollower);
        } else {
            throw new BuyerIsNotFollowingSellerException("Buyer was not following seller! Unable to unfollow!");
        }
    }

    @Override
    public List<Listing> getLikedListings(Long buyerId) throws BuyerNotFoundException {
        try {
            Buyer buyer = retrieveBuyerById(buyerId);

            return buyer.getLikedListings();
        } catch (BuyerNotFoundException ex) {
            throw new BuyerNotFoundException(ex.getMessage());
        }
    }

    private boolean isFollowingSellerAlreadyListingId(Long buyerId, Long listingId) throws ListingNotFoundException, BuyerNotFoundException, BuyerNotFoundException {
        Seller sellerToFollow = listingSessionBeanLocal.retrieveSellerByListingId(listingId);
        Buyer buyerFollower = retrieveBuyerById(buyerId);
        if (sellerToFollow.getFollowers().contains(buyerFollower)) {
            return true;
        } else {
            return false;
        }
    }

    private boolean isFollowingSellerAlreadySellerId(Long buyerId, Long sellerId) throws SellerNotFoundException, BuyerNotFoundException {
        Seller sellerToFollow = sellerSessionBeanLocal.retrieveSellerBySellerId(sellerId);
        Buyer buyerFollower = retrieveBuyerById(buyerId);
        if (sellerToFollow.getFollowers().contains(buyerFollower)) {
            return true;
        } else {
            return false;
        }
    }

    private boolean isUsernameAvailable(String username) {
        Query query = em.createQuery("SELECT b FROM Buyer b WHERE b.username = :inUsername");
        query.setParameter("inUsername", username);
        List<Buyer> buyers = query.getResultList();

        return buyers.isEmpty();
    }

    private boolean isEmailAvailable(String email) {
        Query query = em.createQuery("SELECT b FROM Buyer b WHERE b.email = :inEmail");
        query.setParameter("inEmail", email);
        List<Buyer> buyers = query.getResultList();

        return buyers.isEmpty();
    }

    private boolean isPhoneNumberAvailable(String phoneNo) {
        Query query = em.createQuery("SELECT b FROM Buyer b WHERE b.phoneNo = :inPhoneNumber");
        query.setParameter("inPhoneNumber", phoneNo);
        List<Buyer> buyers = query.getResultList();

        return buyers.isEmpty();
    }

    private String prepareInputDataValidationErrorsMessage(Set<ConstraintViolation<Buyer>> constraintViolations) {
        String msg = "Input data validation error!:";

        for (ConstraintViolation constraintViolation : constraintViolations) {
            msg += "\n\t" + constraintViolation.getPropertyPath() + " - " + constraintViolation.getInvalidValue() + "; " + constraintViolation.getMessage();
        }

        return msg;
    }

}
