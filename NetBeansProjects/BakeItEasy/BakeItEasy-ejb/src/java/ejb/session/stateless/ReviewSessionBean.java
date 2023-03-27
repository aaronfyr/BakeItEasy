/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Buyer;
import entity.Listing;
import entity.Order;
import entity.Review;
import entity.Seller;
import error.exception.BuyerNotFoundException;
import error.exception.InputDataValidationException;
import error.exception.ListingNotFoundException;
import error.exception.OrderNotFoundException;
import error.exception.ReviewNotFoundException;
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
 * @author elysia
 */
@Stateless
public class ReviewSessionBean implements ReviewSessionBeanLocal {

    @PersistenceContext(unitName = "BakeItEasy-ejbPU")
    private EntityManager em;
    
    @EJB
    private BuyerSessionBeanLocal buyerSessionBeanLocal;

    @EJB
    private SellerSessionBeanLocal sellerSessionBeanLocal;

    @EJB
    private OrderSessionBeanLocal orderSessionBeanLocal;
    
    @EJB
    private ReviewSessionBeanLocal reviewSessionBeanLocal;
    
    @EJB
    private ListingSessionBeanLocal listingSessionBeanLocal;
    
    private final ValidatorFactory validatorFactory;
    private final Validator validator;

    public ReviewSessionBean() {
        this.validatorFactory = Validation.buildDefaultValidatorFactory();
        this.validator = validatorFactory.getValidator();
    }

    @Override
    public Review retrieveReviewById(Long reviewId) throws ReviewNotFoundException {
        Review review = em.find(Review.class, reviewId);

        if (review != null) {
            return review;
        } else {
            throw new ReviewNotFoundException("Review does not exist: " + reviewId);
        }
    }

    @Override
    public Long createNewReview(Review review, Long buyerId, Long sellerId, Long orderId, Long listingId) throws BuyerNotFoundException, SellerNotFoundException, OrderNotFoundException, UnknownPersistenceException, InputDataValidationException, ListingNotFoundException {
        Set<ConstraintViolation<Review>> constraintViolations = validator.validate(review);

        if (constraintViolations.isEmpty()) {
            try {
                em.persist(review);
                Buyer buyer = buyerSessionBeanLocal.retrieveBuyerById(buyerId);
                Seller seller = sellerSessionBeanLocal.retrieveSellerBySellerId(sellerId);
                Order order = orderSessionBeanLocal.retrieveOrderById(orderId);
                Listing listing = listingSessionBeanLocal.retrieveListingByListingId(listingId);
                review.setBuyer(buyer);
                review.setSeller(seller);
                review.setOrder(order);
                review.setListing(listing);
                buyer.getReviews().add(review);
                seller.getReviews().add(review);
                order.setReview(review);
                listing.getReviews().add(review);
                em.flush();
                return review.getReviewId();
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
    public List<Review> retrieveAllReviews() {
        Query query = em.createQuery("SELECT r FROM Review r");
        return query.getResultList();
    }
    
    @Override
    public void updateReview(Review r) throws NoResultException, ReviewNotFoundException {
        Review oldR = retrieveReviewById(r.getReviewId());

        oldR.setTitle(r.getTitle());
        oldR.setReviewText(r.getReviewText());
        oldR.setRating(r.getRating());
        oldR.setImagePaths(r.getImagePaths());
        oldR.setDateCreated(r.getDateCreated());
        oldR.setBuyer(r.getBuyer());
        oldR.setSeller(r.getSeller());
        oldR.setOrder(r.getOrder());
        oldR.setListing(r.getListing());
    } //end updateReview

    // remove report from db
    @Override
    public void removeReview(Long reviewId) throws ReviewNotFoundException {
        Review review = reviewSessionBeanLocal.retrieveReviewById(reviewId);
        Buyer buyer = review.getBuyer();
        Seller seller = review.getSeller();
        Order order = review.getOrder();
        buyer.getReviews().remove(review);
        seller.getReviews().remove(review);
        order.setReview(null);
        em.remove(review);
    }
    private String prepareInputDataValidationErrorsMessage(Set<ConstraintViolation<Review>> constraintViolations) {
        String msg = "Input data validation error!:";

        for (ConstraintViolation constraintViolation : constraintViolations) {
            msg += "\n\t" + constraintViolation.getPropertyPath() + " - " + constraintViolation.getInvalidValue() + "; " + constraintViolation.getMessage();
        }

        return msg;
    }
    
}
