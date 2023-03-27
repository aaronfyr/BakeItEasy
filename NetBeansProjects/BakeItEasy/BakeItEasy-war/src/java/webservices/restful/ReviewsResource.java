/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import ejb.session.stateless.OrderSessionBeanLocal;
import ejb.session.stateless.ReviewSessionBeanLocal;
import entity.Order;
import entity.Review;
import error.exception.BuyerNotFoundException;
import error.exception.InputDataValidationException;
import error.exception.ListingNotFoundException;
import error.exception.OrderNotFoundException;
import error.exception.ReviewNotFoundException;
import error.exception.SellerNotFoundException;
import error.exception.UnknownPersistenceException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ejb.EJB;
import javax.json.Json;
import javax.json.JsonObject;
import javax.persistence.NoResultException;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 *
 * @author elysia
 */
@Path("reviews")
public class ReviewsResource {
    
    @EJB
    private ReviewSessionBeanLocal reviewSessionBeanLocal;
    
    @EJB
    private OrderSessionBeanLocal orderSessionBeanLocal;

    // get all reviews
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Review> getAllReviews() {
        return reviewSessionBeanLocal.retrieveAllReviews();
    } //end getAllReviews

    // get reviews with id = {id}
    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getReview(@PathParam("id") Long reviewId) {
        try {
            Review review = reviewSessionBeanLocal.retrieveReviewById(reviewId);
            return Response.status(200).entity(
                    review
            ).type(MediaType.APPLICATION_JSON).build();
        } catch (NoResultException e) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found")
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        } catch (ReviewNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found: review id " + reviewId)
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        }
    } //end getReview

    // TODO: TEST THIS
    // create a new review
    // request body:
    /*
    {
    "title": "review 123",
    "reviewText": "review text",
    "rating": 5,
    "dateCreated": "2023-03-03T00:00:00"
    }
     */
    @POST
    @Path("/orders/{order_id}/reviews")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Review createReview(Review r, @PathParam("order_id") Long orderId) {
        try {
            Order order = orderSessionBeanLocal.retrieveOrderById(orderId);
            Long buyerId = order.getBuyer().getBuyerId();
            Long sellerId = order.getSeller().getSellerId();
            Long listingId = order.getListing().getListingId();
            reviewSessionBeanLocal.createNewReview(r, buyerId, sellerId, orderId, listingId);
        } catch (InputDataValidationException ex) {
            Logger.getLogger(AdminsResource.class.getName()).log(Level.SEVERE, null, ex); // not too sure how to catch this exception
        } catch (BuyerNotFoundException | SellerNotFoundException | OrderNotFoundException | UnknownPersistenceException | ListingNotFoundException ex) {
            Logger.getLogger(ReviewsResource.class.getName()).log(Level.SEVERE, null, ex);
        }
        return r;
    } //end createReview
    
    // edit review
    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response editReview(@PathParam("id") Long reviewId, Review review) {
        review.setReviewId(reviewId);
        try {
            reviewSessionBeanLocal.updateReview(review);
            return Response.status(204).build();
        } catch (NoResultException e) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found")
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        } catch (ReviewNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found: review id " + reviewId)
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        }
    } //end editReview

    // delete review of id = {id}
    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteReview(@PathParam("id") Long reviewId) {
        try {
            reviewSessionBeanLocal.removeReview(reviewId);
            return Response.status(204).build();
        } catch (NoResultException e) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found")
                    .build();

            return Response.status(404).entity(exception).build();
        } catch (ReviewNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found: review id " + reviewId)
                    .build();

            return Response.status(404).entity(exception).build();
        }
    } //end deleteReview
}
