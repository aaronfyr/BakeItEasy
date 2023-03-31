/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Listing;
import entity.Order;
import entity.Seller;
import enumeration.ListingCategory;
import enumeration.OrderStatus;
import error.exception.InputDataValidationException;
import error.exception.ListingHasOngoingOrdersException;
import error.exception.ListingNotFoundException;
import error.exception.SellerNotFoundException;
import error.exception.UnknownPersistenceException;
import java.math.BigDecimal;
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
 * @author aaronf
 */
@Stateless
public class ListingSessionBean implements ListingSessionBeanLocal {

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
        } else {
            throw new InputDataValidationException(prepareInputDataValidationErrorsMessage(constraintViolations));
        }
    }

    @Override
    public void deleteListing(Long listingId) throws ListingNotFoundException, ListingHasOngoingOrdersException {
        try {
            Listing listingToRemove = retrieveListingByListingId(listingId);

            if (doesListingHaveOutstandingOrders(listingToRemove)) {
                throw new ListingHasOngoingOrdersException("Listing has ongoing orders (Pending/Accepted), please handle before deletion!");
            }

            listingToRemove.getSeller().getListings().remove(listingToRemove); // disassociate from seller's listing
            List<Order> orders = listingToRemove.getOrders();
            for (Order order : orders) {
                em.remove(order);
            }

            em.remove(listingToRemove);
        } catch (ListingHasOngoingOrdersException ex) {
            throw new ListingHasOngoingOrdersException(ex.getMessage());
        }
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
        Query query = em.createQuery("SELECT l FROM Listing l");

        return query.getResultList();
    }

    @Override
    public List<Listing> retrieveSellerListings(Long sellerId) {
        Query query = em.createQuery("SELECT l FROM Listing l WHERE l.seller.sellerId = :inSellerId");
        query.setParameter("inSellerId", sellerId);

        return query.getResultList();
    }

    @Override
    public List<Listing> retrieveListingByListingCategory(ListingCategory listingCategory) {
        Query query = em.createQuery("SELECT l FROM Listing l WHERE l.listingCategory = :inListingCategory");
        query.setParameter("inListingCategory", listingCategory);
        return query.getResultList();
    }

    @Override
    public List<Listing> retrieveListingByListingCategoryAndSellerId(ListingCategory listingCategory, Long sellerId) {
        Query query = em.createQuery("SELECT l FROM Listing l WHERE l.listingCategory = :inListingCategory AND l.seller.sellerId = :inSellerId");
        query.setParameter("inListingCategory", listingCategory);
        query.setParameter("inSellerId", sellerId);
        return query.getResultList();
    }

    @Override
    public List<Listing> retrieveListingByQuantityGreater(Integer quantityGreaterThan) {
        Query query = em.createQuery("SELECT l FROM Listing l WHERE l.maxQuantity >= :inQuantityGreaterThan");
        query.setParameter("inQuantityGreaterThan", quantityGreaterThan);
        return query.getResultList();
    }

    @Override
    public List<Listing> retrieveListingByQuantityLesser(Integer quantityLesserThan) {
        Query query = em.createQuery("SELECT l FROM Listing l WHERE l.maxQuantity <= :inQuantityLesserThan");
        query.setParameter("inQuantityLesserThan", quantityLesserThan);
        return query.getResultList();
    }

    @Override
    public List<Listing> retrieveListingByPrice(BigDecimal price) {
        Query query = em.createQuery("SELECT l FROM Listing l WHERE l.price = :inPrice");
        query.setParameter("inPrice", price);
        return query.getResultList();
    }

    @Override
    public List<Listing> retrieveListingByPriceRange(BigDecimal startPrice, BigDecimal endPrice) {
        Query query = em.createQuery("SELECT l FROM Listing l WHERE l.price BETWEEN :inStartPrice AND :inEndPrice");
        query.setParameter("inStartPrice", startPrice);
        query.setParameter("inEndPrice", endPrice);
        return query.getResultList();
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

    private String prepareInputDataValidationErrorsMessage(Set<ConstraintViolation<Listing>> constraintViolations) {
        String msg = "Input data validation error!:";

        for (ConstraintViolation constraintViolation : constraintViolations) {
            msg += "\n\t" + constraintViolation.getPropertyPath() + " - " + constraintViolation.getInvalidValue() + "; " + constraintViolation.getMessage();
        }

        return msg;
    }

}
