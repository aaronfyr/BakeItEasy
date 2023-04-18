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
import enumeration.ListingCategory;
import enumeration.OrderStatus;
import error.exception.BuyerNotFoundException;
import error.exception.InputDataValidationException;
import error.exception.ListingHasOngoingOrdersException;
import error.exception.ListingIsNotLikedException;
import error.exception.ListingLikedAlreadyException;
import error.exception.ListingNotFoundException;
import error.exception.OrderNotFoundException;
import error.exception.SellerNotFoundException;
import error.exception.UnknownPersistenceException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
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
 * @author aaronf
 */
@Stateless
public class ListingSessionBean implements ListingSessionBeanLocal {

    @EJB(name = "BuyerSessionBeanLocal")
    private BuyerSessionBeanLocal buyerSessionBeanLocal;

    @EJB(name = "OrderSessionBeanLocal")
    private OrderSessionBeanLocal orderSessionBeanLocal;

    @EJB(name = "SellerSessionBeanLocal")
    private SellerSessionBeanLocal sellerSessionBeanLocal;

    @PersistenceContext(unitName = "BakeItEasy-ejbPU")
    private EntityManager em;

    private final ValidatorFactory validatorFactory;
    private final Validator validator;

    public ListingSessionBean() {
        this.validatorFactory = Validation.buildDefaultValidatorFactory();
        this.validator = validatorFactory.getValidator();
    }

    // checked
    @Override
    public Long createNewListing(Listing newListing, Long sellerId) throws SellerNotFoundException, InputDataValidationException, UnknownPersistenceException {
        Set<ConstraintViolation<Listing>> constraintViolations = validator.validate(newListing);

        if (constraintViolations.isEmpty()) {
            try {
                Seller seller = sellerSessionBeanLocal.retrieveSellerBySellerId(sellerId);
                newListing.setSeller(seller);
                seller.getListings().add(newListing);
                em.persist(newListing);
                em.flush();
                return newListing.getListingId();
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

    // checked
    @Override
    public void updateListing(Listing updatedListing) throws InputDataValidationException, ListingNotFoundException {
        Set<ConstraintViolation<Listing>> constraintViolations = validator.validate(updatedListing);

        if (constraintViolations.isEmpty()) {
            Listing listingToUpdate = retrieveListingByListingId(updatedListing.getListingId());
            listingToUpdate.setName(updatedListing.getName());
            listingToUpdate.setPrice(updatedListing.getPrice());
            listingToUpdate.setMaxQuantity(updatedListing.getMaxQuantity());
            listingToUpdate.setDescription(updatedListing.getDescription());
            listingToUpdate.setImagePaths(updatedListing.getImagePaths());
            listingToUpdate.setListingCategory(updatedListing.getListingCategory());
            listingToUpdate.setMinPrepDays(updatedListing.getMinPrepDays());
        } else {
            throw new InputDataValidationException(prepareInputDataValidationErrorsMessage(constraintViolations));
        }
    }

    // checked
    @Override
    public void likeListing(Long buyerId, Long listingId) throws ListingNotFoundException, BuyerNotFoundException, ListingLikedAlreadyException {
        if (!isListingLikedAlready(buyerId, listingId)) {
            Listing listingToLike = retrieveListingByListingId(listingId);
            Buyer buyerLiker = buyerSessionBeanLocal.retrieveBuyerById(buyerId);

            buyerLiker.getLikedListings().add(listingToLike);
            listingToLike.getLikers().add(buyerLiker);
        } else {
            throw new ListingLikedAlreadyException("Listing has been liked by buyer already! Unable to like listing!");
        }

    }

    // checked
    @Override
    public void unlikeListing(Long buyerId, Long listingId) throws ListingNotFoundException, BuyerNotFoundException, ListingIsNotLikedException {
        if (isListingLikedAlready(buyerId, listingId)) {
            Listing listingToUnlike = retrieveListingByListingId(listingId);
            Buyer buyerLiker = buyerSessionBeanLocal.retrieveBuyerById(buyerId);

            buyerLiker.getLikedListings().remove(listingToUnlike);
            listingToUnlike.getLikers().remove(buyerLiker);
        } else {
            throw new ListingIsNotLikedException("Listing is not liked by buyer! Unable to unlike listing!");
        }
    }

    private boolean isListingLikedAlready(Long buyerId, Long listingId) throws ListingNotFoundException, BuyerNotFoundException {
        Listing listingToLike = retrieveListingByListingId(listingId);
        Buyer buyerLiker = buyerSessionBeanLocal.retrieveBuyerById(buyerId);

        if (listingToLike.getLikers().contains(buyerLiker)) {
            return true;
        } else {
            return false;
        }
    }

    // checked
    // method to check whether listing is liked by the buyer
    @Override
    public void deleteListing(Long listingId) throws ListingNotFoundException, ListingHasOngoingOrdersException, OrderNotFoundException {
        try {
            Listing listingToRemove = retrieveListingByListingId(listingId);

            if (doesListingHaveOutstandingOrders(listingToRemove)) {
                throw new ListingHasOngoingOrdersException("Listing has ongoing orders (Pending/Accepted), please handle before deletion!");
            }

            listingToRemove.getSeller().getListings().remove(listingToRemove); // disassociate from seller's listing

            List<Order> ordersTaggedToListing = retrieveOrdersByListingId(listingId);
            for (Order order : ordersTaggedToListing) { // orders have cascade to remove other children
                order.getBuyer().getOrders().remove(order);
                listingToRemove.getOrders().remove(order);
                em.remove(order);
            }

            em.remove(listingToRemove);
        } catch (ListingHasOngoingOrdersException ex) {
            throw new ListingHasOngoingOrdersException(ex.getMessage());
        }
    }

    @Override
    public List<Order> retrieveOrdersByListingId(Long listingId) {
        Query query = em.createQuery("SELECT o FROM Order o WHERE o.listing.listingId = :inListingId");
        query.setParameter("inListingId", listingId);

        return query.getResultList();
    }

    @Override
    public Listing retrieveListingByListingId(Long listingId) throws ListingNotFoundException {
        Listing listing = em.find(Listing.class, listingId);

        if (listing != null) {
            return listing;
        } else {
            throw new ListingNotFoundException("Listing ID: " + listingId + " does not exist!");
        }
    }

    @Override
    public Listing retrieveListingBySellerIdAndListingId(Long sellerId, Long listingId) {
        Query query = em.createQuery("SELECT l FROM Listing l WHERE l.seller.sellerId = :inSellerId AND l.listingId = :inListingId");
        query.setParameter("inSellerId", sellerId);
        query.setParameter("inListingId", listingId);

        return (Listing) query.getSingleResult();
    }

    @Override
    public List<Listing> retrieveAllListings() {
        Query query = em.createQuery("SELECT l FROM Listing l WHERE l.seller.isBanned = false ORDER BY l.dateOfCreation DESC");

        return query.getResultList();
    }

    @Override
    public List<Listing> retrieveAllListingsAdmin() {
        Query query = em.createQuery("SELECT l FROM Listing l ORDER BY l.dateOfCreation DESC");

        return query.getResultList();
    }

    @Override
    public List<Listing> retrieveSellerListings(Long sellerId) {
        Query query = em.createQuery("SELECT l FROM Listing l WHERE l.seller.sellerId = :inSellerId ORDER BY l.dateOfCreation DESC");
        query.setParameter("inSellerId", sellerId);

        return query.getResultList();
    }

    @Override
    public List<Listing> retrieveListingByListingCategory(ListingCategory listingCategory) {
        Query query = em.createQuery("SELECT l FROM Listing l WHERE l.listingCategory = :inListingCategory ORDER BY l.dateOfCreation DESC");
        query.setParameter("inListingCategory", listingCategory);
        return query.getResultList();
    }

    @Override
    public List<Listing> retrieveListingByListingCategoryAndSellerId(ListingCategory listingCategory, Long sellerId) {
        Query query = em.createQuery("SELECT l FROM Listing l WHERE l.listingCategory = :inListingCategory AND l.seller.sellerId = :inSellerId ORDER BY l.dateOfCreation DESC");
        query.setParameter("inListingCategory", listingCategory);
        query.setParameter("inSellerId", sellerId);
        return query.getResultList();
    }

    @Override
    public List<Listing> retrieveListingByQuantityGreater(Integer quantityGreaterThan) {
        Query query = em.createQuery("SELECT l FROM Listing l WHERE l.maxQuantity >= :inQuantityGreaterThan ORDER BY l.dateOfCreation DESC");
        query.setParameter("inQuantityGreaterThan", quantityGreaterThan);
        return query.getResultList();
    }

    @Override
    public List<Listing> retrieveListingByQuantityLesser(Integer quantityLesserThan) {
        Query query = em.createQuery("SELECT l FROM Listing l WHERE l.maxQuantity <= :inQuantityLesserThan ORDER BY l.dateOfCreation DESC");
        query.setParameter("inQuantityLesserThan", quantityLesserThan);
        return query.getResultList();
    }

    @Override
    public List<Listing> retrieveListingByPrice(BigDecimal price) {
        Query query = em.createQuery("SELECT l FROM Listing l WHERE l.price = :inPrice ORDER BY l.price ASC");
        query.setParameter("inPrice", price);
        return query.getResultList();
    }

    @Override
    public List<Listing> retrieveListingByPriceRange(BigDecimal startPrice, BigDecimal endPrice) {
        Query query = em.createQuery("SELECT l FROM Listing l WHERE l.price BETWEEN :inStartPrice AND :inEndPrice ORDER BY l.price ASC");
        query.setParameter("inStartPrice", startPrice);
        query.setParameter("inEndPrice", endPrice);
        return query.getResultList();
    }

    @Override
    public Seller retrieveSellerByListingId(Long listingId) throws ListingNotFoundException {
        Listing currentListing = retrieveListingByListingId(listingId);
        return currentListing.getSeller();
    }

    @Override
    public Boolean doesListingHaveOutstandingOrders(Listing listing) {
        for (Order order : listing.getOrders()) {
            if (order.getOrderStatus() == OrderStatus.PENDING || order.getOrderStatus() == OrderStatus.ACCEPTED) {
                return true;
            }
        }
        return false;
    }

    @Override
    public List<Order> getListingOrders(Long listingId) throws ListingNotFoundException {
        try {
            Listing listing = retrieveListingByListingId(listingId);

            return listing.getOrders();
        } catch (ListingNotFoundException ex) {
            throw new ListingNotFoundException(ex.getMessage());
        }
    }

    @Override
    public Seller getListingsSeller(Long listingId) throws ListingNotFoundException {
        try {
            Listing listing = retrieveListingByListingId(listingId);

            return listing.getSeller();
        } catch (ListingNotFoundException ex) {
            throw new ListingNotFoundException(ex.getMessage());
        }
    }

    @Override
    public List<Listing> getFollowedSellerListings(Long buyerId) throws BuyerNotFoundException {
        Buyer buyer = buyerSessionBeanLocal.retrieveBuyerById(buyerId);

        List<Listing> allFollowedSellerListings = new ArrayList<>();
        for (Seller followedSeller : buyer.getFollowings()) {
            if (!followedSeller.getIsBanned()) {
                allFollowedSellerListings.addAll(followedSeller.getListings());
            }
        }
        return allFollowedSellerListings;
    }

    @Override
    public boolean isListingLikedByCurrentBuyer(Long buyerId, Long listingId) throws BuyerNotFoundException, ListingNotFoundException {
        Buyer buyer = buyerSessionBeanLocal.retrieveBuyerById(buyerId);

        Listing listing = retrieveListingByListingId(listingId);

        return listing.getLikers().contains(buyer);
    }
    // Add isListingLiked with buyer id and listing id

    @Override
    public Integer getNumberOfPendingOrdersByListingId(Long listingId) throws ListingNotFoundException {
        Listing currentListing = retrieveListingByListingId(listingId);

        int quantity = 0;
        for (Order order : currentListing.getOrders()) {
            if (order.getOrderStatus() == OrderStatus.PENDING) {
                quantity += 1;
            }
        }
        return quantity;
    }

    @Override
    public Integer getNumberOfAcceptedOrdersByListingId(Long listingId) throws ListingNotFoundException {
        Listing currentListing = retrieveListingByListingId(listingId);

        int quantity = 0;
        for (Order order : currentListing.getOrders()) {
            if (order.getOrderStatus() == OrderStatus.ACCEPTED) {
                quantity += 1;
            }
        }
        return quantity;
    }

    @Override
    public Integer getNumberOfRejectedOrdersByListingId(Long listingId) throws ListingNotFoundException {
        Listing currentListing = retrieveListingByListingId(listingId);

        int quantity = 0;
        for (Order order : currentListing.getOrders()) {
            if (order.getOrderStatus() == OrderStatus.REJECTED) {
                quantity += 1;
            }
        }
        return quantity;
    }

    @Override
    public Integer getNumberOfCompletedOrdersByListingId(Long listingId) throws ListingNotFoundException {
        Listing currentListing = retrieveListingByListingId(listingId);

        int quantity = 0;
        for (Order order : currentListing.getOrders()) {
            if (order.getOrderStatus() == OrderStatus.COMPLETED) {
                quantity += 1;
            }
        }
        return quantity;
    }

    @Override
    public Integer getNumberOfCancelledOrdersByListingId(Long listingId) throws ListingNotFoundException {
        Listing currentListing = retrieveListingByListingId(listingId);

        int quantity = 0;
        for (Order order : currentListing.getOrders()) {
            if (order.getOrderStatus() == OrderStatus.CANCELLED) {
                quantity += 1;
            }
        }
        return quantity;
    }

    @Override
    public String getSellerPhoneNoByListingId(Long listingId) throws ListingNotFoundException {
        Listing currentListing = retrieveListingByListingId(listingId);

        Seller seller = currentListing.getSeller();

        return seller.getPhoneNo();

    }

    // Get phone number through listing and order
    private String prepareInputDataValidationErrorsMessage(Set<ConstraintViolation<Listing>> constraintViolations) {
        String msg = "Input data validation error!:";

        for (ConstraintViolation constraintViolation : constraintViolations) {
            msg += "\n\t" + constraintViolation.getPropertyPath() + " - " + constraintViolation.getInvalidValue() + "; " + constraintViolation.getMessage();
        }

        return msg;
    }

}
