/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Review;
import error.ReviewNotFoundException;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author elysia
 */
@Local
public interface ReviewSessionBeanLocal {

    public Review retrieveReviewById(Long reviewId) throws ReviewNotFoundException;

    public List<Review> retrieveAllReviews();

    public void removeReview(Long reviewId) throws ReviewNotFoundException;
    
}
