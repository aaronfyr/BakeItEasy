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
    public Long createNewReview(Review review, Long orderId) throws OrderNotFoundException, UnknownPersistenceException, InputDataValidationException {
        Set<ConstraintViolation<Review>> constraintViolations = validator.validate(review);

        if (constraintViolations.isEmpty()) {
            try {
                em.persist(review);
                Order order = orderSessionBeanLocal.retrieveOrderById(orderId);
                review.setOrder(order);
                order.setReview(review);
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
    public List<Review> retrieveSellerReviews(Long sellerId) throws SellerNotFoundException {
        sellerSessionBeanLocal.retrieveSellerBySellerId(sellerId);
        Query query = em.createQuery("SELECT r FROM Review r WHERE r.order.listing.seller.sellerId = :inSellerId");
        query.setParameter("inSellerId", sellerId);
        List<Review> sellerReviews = query.getResultList();
        return sellerReviews;
    }
    
    @Override
    public void updateReview(Review r) throws NoResultException, ReviewNotFoundException {
        Review oldR = retrieveReviewById(r.getReviewId());

        oldR.setTitle(r.getTitle());
        oldR.setReviewText(r.getReviewText());
        oldR.setRating(r.getRating());
        oldR.setImagePaths(r.getImagePaths());
        oldR.setDateCreated(r.getDateCreated());
        oldR.setOrder(r.getOrder());
    } //end updateReview

    // remove report from db
    @Override
    public void removeReview(Long reviewId) throws ReviewNotFoundException {
        Review review = reviewSessionBeanLocal.retrieveReviewById(reviewId);
        Order order = review.getOrder();
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
