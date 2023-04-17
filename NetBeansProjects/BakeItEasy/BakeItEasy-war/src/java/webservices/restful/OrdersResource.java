/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import ejb.session.stateless.OrderSessionBeanLocal;
import ejb.session.stateless.ReportSessionBeanLocal;
import ejb.session.stateless.ReviewSessionBeanLocal;
import entity.Buyer;
import entity.Listing;
import entity.Order;
import entity.Review;
import entity.Seller;
import error.exception.BuyerNotFoundException;
import error.exception.InputDataValidationException;
import error.exception.ListingNotFoundException;
import error.exception.OrderHasExistingReview;
import error.exception.OrderIsNotCompletedException;
import error.exception.OrderNotFoundException;
import error.exception.UnknownPersistenceException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ejb.EJB;
import javax.json.Json;
import javax.json.JsonObject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

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
    
    @EJB
    private ReportSessionBeanLocal reportSessionBeanLocal;
    
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
    public Response createReviewForOrder(@PathParam("id") Long orderId, Review r) {
        try {
            Order order = orderSessionBeanLocal.retrieveOrderById(orderId);
            reviewSessionBeanLocal.createNewReview(r, orderId);
            return Response.status(200).entity(r).type(MediaType.APPLICATION_JSON).build();
        } catch (UnknownPersistenceException | InputDataValidationException ex) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Unknown Persistence or Input Data Validation error").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (OrderNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Order not found").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (OrderIsNotCompletedException ex) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Order not completed").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (OrderHasExistingReview ex) {
            JsonObject exception = Json.createObjectBuilder().add("error", "A review has previously been created for this order").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    } //end createReviewForOrder
    
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{buyer_id}/{listing_id}")
    public Response createOrder(@PathParam("buyer_id") Long buyer_id, @PathParam("listing_id") Long listing_id, Order o) {
        try {
            orderSessionBeanLocal.createNewOrder(o, buyer_id, listing_id);
            return Response.status(200).entity(o).type(MediaType.APPLICATION_JSON).build();
        } catch (UnknownPersistenceException | InputDataValidationException e) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Unknown Persistence or Input Data Validation error").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (BuyerNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Buyer not found").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (ListingNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Listing not found").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    } //end createOrder
    
    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getOrder(@PathParam("id") Long orderId) {
        try {
            Order order = orderSessionBeanLocal.retrieveOrderById(orderId);
            return Response.status(200).entity(
                    order
            ).type(MediaType.APPLICATION_JSON).build();
        } catch (OrderNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found: order id " + orderId)
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        }
    } //end getOrder
    
    @GET
    @Path("/{id}/buyer")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getOrderBuyer(@PathParam("id") Long orderId) {
        try {
            Buyer buyer = orderSessionBeanLocal.getOrderBuyer(orderId);
            return Response.status(200).entity(
                    buyer
            ).type(MediaType.APPLICATION_JSON).build();
        } catch (OrderNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found: order id " + orderId)
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        }
    } //end getOrderBuyer
    
    @GET
    @Path("/{id}/listing")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getListing(@PathParam("id") Long orderId) {
        try {
            Listing listing = orderSessionBeanLocal.getListing(orderId);
            return Response.status(200).entity(
                    listing
            ).type(MediaType.APPLICATION_JSON).build();
        } catch (OrderNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found: order id " + orderId)
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        }
    } //end getListing
    
    @GET
    @Path("/{id}/seller")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getSeller(@PathParam("id") Long orderId) {
        try {
            Seller seller = orderSessionBeanLocal.getSeller(orderId);
            return Response.status(200).entity(
                    seller
            ).type(MediaType.APPLICATION_JSON).build();
        } catch (OrderNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found: order id " + orderId)
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        }
    } //end getSeller
    
    @GET
    @Path("/{order_id}/sellerPhoneNo")
    @Produces(MediaType.APPLICATION_JSON)
    public String getSellerPhoneNoByOrderId(@PathParam("order_id") Long orderId) throws OrderNotFoundException {
        return orderSessionBeanLocal.getSellerPhoneNoByOrderId(orderId);
    } //end getSellerPhoneNoByOrderId

    @GET
    @Path("/{id}/hasExistingReview")
    @Produces(MediaType.APPLICATION_JSON)
    public boolean hasExistingReview(@PathParam("id") Long orderId) throws OrderNotFoundException {
        return reviewSessionBeanLocal.reviewExists(orderId);
    } // end hasExistingReview
    
    @GET
    @Path("/{id}/buyerPhoneNo")
    @Produces(MediaType.APPLICATION_JSON)
    public String getBuyerPhoneNoFromOrderId(@PathParam("id") Long orderId) throws OrderNotFoundException {
        return orderSessionBeanLocal.getBuyerPhoneNoByOrderId(orderId);
    } // end getBuyerPhoneNoFromOrderId

}
