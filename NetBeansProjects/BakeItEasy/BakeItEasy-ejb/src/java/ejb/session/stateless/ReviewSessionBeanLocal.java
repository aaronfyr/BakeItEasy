/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Review;
import error.exception.BuyerNotFoundException;
import error.exception.InputDataValidationException;
import error.exception.ListingNotFoundException;
import error.exception.OrderHasExistingReview;
import error.exception.OrderIsNotCompletedException;
import error.exception.OrderNotFoundException;
import error.exception.ReviewNotFoundException;
import error.exception.SellerNotFoundException;
import error.exception.UnknownPersistenceException;
import java.util.List;
import javax.ejb.Local;
import javax.persistence.NoResultException;

/**
 *
 * @author elysia
 */
@Local
public interface ReviewSessionBeanLocal {

    public Review retrieveReviewById(Long reviewId) throws ReviewNotFoundException;

    public List<Review> retrieveAllReviews();

    public void removeReview(Long reviewId) throws ReviewNotFoundException;

    public void updateReview(Review r) throws NoResultException, ReviewNotFoundException;

    public Long createNewReview(Review review, Long orderId) throws OrderNotFoundException, UnknownPersistenceException, InputDataValidationException, OrderIsNotCompletedException, OrderHasExistingReview;

    public List<Review> retrieveSellerReviews(Long sellerId) throws SellerNotFoundException;

    public boolean reviewExists(Long orderId) throws OrderNotFoundException;
}
