/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Listing;
import entity.Seller;
import enumeration.ListingCategory;
import error.exception.InputDataValidationException;
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
            listingToUpdate.setQuantityLeft(updatedListing.getQuantityLeft());
            listingToUpdate.setDescription(updatedListing.getDescription());
            listingToUpdate.setImagePaths(updatedListing.getImagePaths());
            listingToUpdate.setListingCategory(updatedListing.getListingCategory());
        } else {
            throw new InputDataValidationException(prepareInputDataValidationErrorsMessage(constraintViolations));
        }
    }

    @Override
    public void deleteListing(Long listingId) throws ListingNotFoundException {
        Listing listingToRemove = retrieveListingByListingId(listingId);
        listingToRemove.getSeller().getListings().remove(listingToRemove);
        // loop through listingToRemove's orders and reviews and delete them
        em.remove(listingToRemove);
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
    public List<Listing> retrieveListingByListingCategory(ListingCategory listingCategory) {
        Query query = em.createQuery("SELECT l FROM Listing l WHERE l.listingCategory = :inListingCategory");
        query.setParameter("inListingCategory", listingCategory);
        return query.getResultList();
    }
    
    @Override
    public List<Listing> retrieveListingByQuantity(Integer quantityLeft) {
        Query query = em.createQuery("SELECT l FROM Listing l WHERE l.quantityLeft = :inQuantityLeft");
        query.setParameter("inQuantityLeft", quantityLeft);
        return query.getResultList();
    }
    
    @Override
    public List<Listing> retrieveListingByQuantityGreater(Integer quantityGreaterThan) {
        Query query = em.createQuery("SELECT l FROM Listing l WHERE l.quantityLeft >= :inQuantityGreaterThan");
        query.setParameter("inQuantityGreaterThan", quantityGreaterThan);
        return query.getResultList();
    }
    
    @Override
    public List<Listing> retrieveListingByQuantityLesser(Integer quantityLesserThan) {
        Query query = em.createQuery("SELECT l FROM Listing l WHERE l.quantityLeft <= :inQuantityLesserThan");
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

    private String prepareInputDataValidationErrorsMessage(Set<ConstraintViolation<Listing>> constraintViolations) {
        String msg = "Input data validation error!:";

        for (ConstraintViolation constraintViolation : constraintViolations) {
            msg += "\n\t" + constraintViolation.getPropertyPath() + " - " + constraintViolation.getInvalidValue() + "; " + constraintViolation.getMessage();
        }

        return msg;
    }

}
