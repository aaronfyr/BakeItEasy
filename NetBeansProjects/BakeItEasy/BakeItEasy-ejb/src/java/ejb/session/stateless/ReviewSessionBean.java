/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Admin;
import entity.Buyer;
import entity.Order;
import entity.Report;
import entity.Review;
import entity.Seller;
import error.AdminNotFoundException;
import error.ReportNotFoundException;
import error.ReviewNotFoundException;
import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

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
    public Long createNewReview(Review review, Long buyerId, Long sellerId, Long orderId) throws BuyerNotFoundException, SellerNotFoundException, OrderNotFoundException {
        try {
            em.persist(review);
            Buyer buyer = buyerSessionBeanLocal.retrieveBuyerById(buyerId);
            Seller seller = sellerSessionBeanLocal.retrieveSellerById(sellerId);
            Order order = orderSessionBeanLocal.retrieveOrderById(orderId);
            buyer.getReviews().add(review);
            seller.getReviews().add(review);
            order.setReview(review);
            em.flush();
            return review.getReviewId();
        } catch (BuyerNotFoundException ex) {
            throw new BuyerNotFoundException(ex.getMessage());
        } catch (SellerNotFoundException ex) {
            throw new SellerNotFoundException(ex.getMessage());
        } catch (OrderNotFoundException ex) {
            throw new OrderNotFoundException(ex.getMessage());
        }
    }

    @Override
    public List<Review> retrieveAllReviews() {
        Query query = em.createQuery("SELECT r FROM Review r");
        return query.getResultList();
    }

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
}
