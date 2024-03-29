/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import ejb.session.stateless.BuyerSessionBeanLocal;
import ejb.session.stateless.CommentSessionBeanLocal;
import ejb.session.stateless.OrderSessionBeanLocal;
import ejb.session.stateless.PostSessionBeanLocal;
import ejb.session.stateless.ReportSessionBeanLocal;
import entity.Buyer;
import entity.Comment;
import entity.Listing;
import entity.Order;
import entity.Post;
import entity.Report;
import entity.Seller;
import error.exception.BuyerEmailExistException;
import error.exception.BuyerHasReportedSellerException;
import error.exception.BuyerIsBannedException;
import error.exception.BuyerNotFoundException;
import error.exception.BuyerPhoneNumberExistException;
import error.exception.BuyerUsernameExistException;
import error.exception.CurrentPasswordDoesNotMatchException;
import error.exception.InputDataValidationException;
import error.exception.InvalidLoginCredentialException;
import error.exception.NewAndConfirmPasswordsDoNotMatchException;
import error.exception.NewPasswordIsSameAsCurrentPasswordException;
import error.exception.OrderIsNotPendingException;
import error.exception.OrderNotFoundException;
import error.exception.PostNotFoundException;
import error.exception.SellerNotFoundException;
import error.exception.UnknownPersistenceException;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ejb.EJB;
import javax.json.Json;
import javax.json.JsonObject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * REST Web Service
 *
 * @author Uni
 */
@Path("buyers")
public class BuyersResource {

    @EJB
    private BuyerSessionBeanLocal buyerSessionBeanLocal;

    @EJB
    private ReportSessionBeanLocal reportSessionBeanLocal;

    @EJB
    private PostSessionBeanLocal postSessionBeanLocal;

    @EJB
    private OrderSessionBeanLocal orderSessionBeanLocal;

    @EJB
    private CommentSessionBeanLocal commentSessionBeanLocal;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createBuyer(Buyer b) {
        try {
            Long id = buyerSessionBeanLocal.createNewBuyer(b);
            Buyer buyer = buyerSessionBeanLocal.retrieveBuyerById(id);
            return Response.status(200).entity(buyer).type(MediaType.APPLICATION_JSON).build();
        } catch (UnknownPersistenceException | InputDataValidationException e) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Unknown Persistence or Input Data Validation error").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (BuyerPhoneNumberExistException e) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Phone number already exist").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (BuyerEmailExistException e) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Email already exist").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (BuyerUsernameExistException e) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Username already exist").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (BuyerNotFoundException e) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Buyer not found").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    } //end createCustomer

    @GET
    @Path("/{email}/{password}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response buyerLogin(@PathParam("email") String email, @PathParam("password") String password) {
        try {
            Buyer buyer = buyerSessionBeanLocal.buyerLogin(email, password);
            return Response.status(200).entity(buyer).type(MediaType.APPLICATION_JSON).build();
        } catch (BuyerNotFoundException e) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Buyer’s email provided does not exist").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (InvalidLoginCredentialException e) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Incorrect password").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (BuyerIsBannedException e) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Buyer is banned").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    } //end loginCustomer

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Buyer> getAllBuyers() {
        return buyerSessionBeanLocal.searchBuyersByName(null);
    } //end getAllCustomers

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getBuyer(@PathParam("id") Long bId) {
        try {
            Buyer c = buyerSessionBeanLocal.retrieveBuyerById(bId);
            return Response.status(200).entity(c).type(MediaType.APPLICATION_JSON).build();
        } catch (BuyerNotFoundException e) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Not found").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    } //end getCustomer

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteBuyer(@PathParam("id") Long bId) {
        try {
            buyerSessionBeanLocal.deleteBuyer(bId);
            return Response.status(204).build();
        } catch (BuyerNotFoundException e) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Buyer not found")
                    .build();

            return Response.status(404).entity(exception).build();
        }
    } //end deleteCustomer

    /* request body:
    {
    "title": "report title",
    "reason": "report reason"
    }
     */
    @POST
    @Path("/{buyer_id}/sellers/{seller_id}/reports")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createReport(@PathParam("buyer_id") Long buyerId, @PathParam("seller_id") Long sellerId, Report report) {
        try {
            reportSessionBeanLocal.createNewReport(report, buyerId, sellerId);
            return Response.status(200).entity(report).type(MediaType.APPLICATION_JSON).build();
        } catch (UnknownPersistenceException | InputDataValidationException e) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Unknown Persistence or Input Data Validation error").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (BuyerNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Buyer not found").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (SellerNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Seller not found").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (BuyerHasReportedSellerException ex) {
            JsonObject exception = Json.createObjectBuilder().add("error", "You have already filed a report against this seller.").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    } //end createReport

    @POST
    @Path("/{buyer_id}/posts")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createPost(@PathParam("buyer_id") Long buyerId, Post p) {
        try {
            p.setDateCreated(new Date(System.currentTimeMillis()));
            postSessionBeanLocal.createNewBuyerPost(p, buyerId);
            return Response.status(200).entity(p).type(MediaType.APPLICATION_JSON).build();
        } catch (UnknownPersistenceException | InputDataValidationException e) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Unknown Persistence or Input Data Validation error").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (BuyerNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Buyer not found").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } 
    } //end createPost

    @GET
    @Path("/{buyer_id}/orders")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getOrders(@PathParam("buyer_id") Long buyerId) {
        try {
            List<Order> orders = orderSessionBeanLocal.getBuyerOrders(buyerId);
            return Response.status(200).entity(
                    orders
            ).type(MediaType.APPLICATION_JSON).build();
        } catch (BuyerNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found: buyer id " + buyerId)
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        }
    } //end getOrders

    @PUT
    @Path("/{order_id}/cancelorder")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response cancelOrder(@PathParam("order_id") Long orderId) {
        try {
            buyerSessionBeanLocal.cancelOrder(orderId);
            return Response.status(204).build();
        } catch (OrderNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Order not found")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (OrderIsNotPendingException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not able to accept order as it is not pending for acceptance")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    } //end cancel order

    @PUT
    @Path("/{buyer_id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response editBuyer(@PathParam("buyer_id") Long buyerId, Buyer buyer) {
        buyer.setBuyerId(buyerId);
        try {
            buyerSessionBeanLocal.updateBuyer(buyer);
            return Response.status(204).build();
        } catch (InputDataValidationException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Input data validation exception")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (BuyerNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Buyer not found")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (BuyerPhoneNumberExistException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Buyer new phone number exist!")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (BuyerUsernameExistException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Buyer new username exist!")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    } //end edit seller

    // CHECKED: AARON
    @GET
    @Path("/{buyer_id}/followings")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFollowings(@PathParam("buyer_id") Long buyerId) {
        try {
            List<Seller> sellersFollowing = buyerSessionBeanLocal.retrieveListOfFollowing(buyerId);
            return Response.status(200).entity(sellersFollowing).type(MediaType.APPLICATION_JSON).build();
        } catch (BuyerNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found: buyer id " + buyerId)
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        }
    } //end getFollowings

    @GET
    @Path("/{buyer_id}/likedlistings")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getLikedListings(@PathParam("buyer_id") Long buyerId) {
        try {
            List<Listing> likedListings = buyerSessionBeanLocal.getLikedListings(buyerId);
            return Response.status(200).entity(likedListings).type(MediaType.APPLICATION_JSON).build();
        } catch (BuyerNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found: buyer id " + buyerId)
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        }
    } //end getLikedListings

    // CHECKED: ELYSIA
    // get all reports for buyer with id = {id}
    @GET
    @Path("/{buyer_id}/reports")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Report> getAllBuyerReports(@PathParam("buyer_id") Long buyerId) throws BuyerNotFoundException {
        Buyer buyer = buyerSessionBeanLocal.retrieveBuyerById(buyerId);
        return buyer.getReports();
    } //end getAllBuyerReports

    @POST
    @Path("/{buyer_id}/{post_id}/comments")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createComment(@PathParam("buyer_id") Long buyerId, @PathParam("post_id") Long pId, Comment c) {
        try {
            commentSessionBeanLocal.createNewBuyerComment(c, pId, buyerId);
            return Response.status(200).entity(c).type(MediaType.APPLICATION_JSON).build();
        } catch (UnknownPersistenceException | InputDataValidationException e) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Unknown Persistence or Input Data Validation error").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (BuyerNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Buyer not found").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (PostNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Post not found").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    } //end createComment
    
    @GET
    @Path("/{buyer_id}/{seller_id}/hasExistingReport")
    @Produces(MediaType.APPLICATION_JSON)
    public boolean hasExistingReport(@PathParam("buyer_id") Long buyerId, @PathParam("seller_id") Long sellerId) {
        return reportSessionBeanLocal.hasBuyerReportedSeller(buyerId, sellerId);
    } // end hasExistingReport
    
    @PUT
    @Path("/{buyer_id}/changePassword")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateBuyerPassword(@PathParam("buyer_id") Long buyerId, @QueryParam("currentPassword") String currentPassword, @QueryParam("newPassword") String newPassword, @QueryParam("confirmPassword") String confirmPassword) {
        try {
            buyerSessionBeanLocal.updateBuyerPassword(buyerId, currentPassword, newPassword, confirmPassword);
            return Response.status(204).build();
        } catch (InputDataValidationException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Input data validation exception")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (NewAndConfirmPasswordsDoNotMatchException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "New password and confirm password does not match!")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (BuyerNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Buyer id given does not exist!")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (CurrentPasswordDoesNotMatchException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Current password entered does not match user's password!")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (NewPasswordIsSameAsCurrentPasswordException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "New password is same as current password! Please choose another password!")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    } //end updateBuyerPassword
}
