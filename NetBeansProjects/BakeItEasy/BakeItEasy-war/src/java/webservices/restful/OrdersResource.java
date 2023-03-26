/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import ejb.session.stateless.OrderSessionBeanLocal;
import ejb.session.stateless.ReviewSessionBeanLocal;
import entity.Admin;
import entity.Order;
import entity.Review;
import error.exception.AdminUsernameExistsException;
import error.exception.BuyerNotFoundException;
import error.exception.InputDataValidationException;
import error.exception.ListingNotFoundException;
import error.exception.OrderNotFoundException;
import error.exception.SellerNotFoundException;
import error.exception.UnknownPersistenceException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ejb.EJB;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

/**
 *
 * @author elysia
 */
@Path("orders")
public class OrdersResource {
    
    @EJB
    private ReviewSessionBeanLocal reviewSessionBeanLocal;
    
    @EJB
    private OrderSessionBeanLocal orderSessionBeanLocal;
    
    // TODO: TEST
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
    @Path("/{id}/reviews")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Review createReviewForOrder(@PathParam("id") Long orderId, Review r) {
        try {
            Order order = orderSessionBeanLocal.retrieveOrderById(orderId);
            Long listingId = order.getListing().getListingId();
            reviewSessionBeanLocal.createNewReview(r, orderId);
        } catch (UnknownPersistenceException | InputDataValidationException ex) {
            Logger.getLogger(AdminsResource.class.getName()).log(Level.SEVERE, null, ex);
        } catch (OrderNotFoundException ex) {
            Logger.getLogger(OrdersResource.class.getName()).log(Level.SEVERE, null, ex);
        }
        return r;
    } //end createReviewForOrder
}
