/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import ejb.session.stateless.BuyerSessionBeanLocal;
import ejb.session.stateless.CommentSessionBeanLocal;
import ejb.session.stateless.ListingSessionBeanLocal;
import ejb.session.stateless.OrderSessionBeanLocal;
import ejb.session.stateless.PostSessionBeanLocal;
import ejb.session.stateless.ReviewSessionBeanLocal;
import ejb.session.stateless.SellerSessionBeanLocal;
import entity.Buyer;
import entity.Comment;
import entity.Listing;
import entity.Order;
import entity.Post;
import entity.Report;
import entity.Review;
import entity.Seller;
import enumeration.ListingCategory;
import error.exception.BuyerIsFollowingSellerAlreadyException;
import error.exception.BuyerIsNotFollowingSellerException;
import error.exception.BuyerNotFoundException;
import error.exception.InputDataValidationException;
import error.exception.InvalidLoginCredentialException;
import error.exception.ListingNotFoundException;
import error.exception.OrderIsNotAcceptedException;
import error.exception.OrderIsNotPendingException;
import error.exception.OrderNotFoundException;
import error.exception.PostNotFoundException;
import error.exception.SellerEmailExistException;
import error.exception.SellerHasOutstandingOrdersException;
import error.exception.SellerIsBannedException;
import error.exception.SellerNotFoundException;
import error.exception.SellerPhoneNumberExistException;
import error.exception.SellerUsernameExistException;
import error.exception.UnknownPersistenceException;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import javax.ejb.EJB;
import javax.ws.rs.Path;
import javax.enterprise.context.RequestScoped;
import javax.json.Json;
import javax.json.JsonObject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * REST Web Service
 *
 * @author aaronf
 */
@Path("sellers")
@RequestScoped
public class SellersResource {

    @EJB
    private SellerSessionBeanLocal sellerSessionBeanLocal;

    @EJB
    private ListingSessionBeanLocal listingSessionBeanLocal;

    @EJB
    private ReviewSessionBeanLocal reviewSessionBeanLocal;

    @EJB
    private PostSessionBeanLocal postSessionBeanLocal;
    
    @EJB
    private OrderSessionBeanLocal orderSessionBeanLocal;
    
    @EJB
    private BuyerSessionBeanLocal buyerSessionBeanLocal;
    
    @EJB
    private CommentSessionBeanLocal commentSessionBeanLocal;

    // CHECKED: ELYSIA
    // get all reviews for seller with id = {id}
    @GET
    @Path("/{seller_id}/reviews")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Review> getAllSellerReviews(@PathParam("seller_id") Long sellerId) throws SellerNotFoundException {
        return reviewSessionBeanLocal.retrieveSellerReviews(sellerId);
    } //end getAllSellerReviews

    // CHECKED: ELYSIA
    // get all reports for seller with id = {id}
    @GET
    @Path("/{seller_id}/reports")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Report> getAllSellerReports(@PathParam("seller_id") Long sellerId) throws SellerNotFoundException {
        Seller seller = sellerSessionBeanLocal.retrieveSellerBySellerId(sellerId);
        return seller.getReports();
    } //end getAllSellerReports

    // CHECKED: AARON
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createSeller(Seller seller) {
        try {
            Long id = sellerSessionBeanLocal.createNewSeller(seller);
            Seller newSeller = sellerSessionBeanLocal.retrieveSellerBySellerId(id);
            return Response.status(200).entity(newSeller).type(MediaType.APPLICATION_JSON).build();
        } catch (UnknownPersistenceException | InputDataValidationException e) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Unknown Persistence or Input Data Validation error").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (SellerUsernameExistException e) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Username already exist").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (SellerEmailExistException e) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Email already exist").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (SellerPhoneNumberExistException e) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Phone Number already exist").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (SellerNotFoundException e) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Seller not found").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    } // end create seller
    
    // CHECKED: AARON
    @PUT
    @Path("/{seller_id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response editSeller(@PathParam("seller_id") Long sellerId, Seller seller) {
        seller.setSellerId(sellerId);
        try {
            sellerSessionBeanLocal.updateSeller(seller);
            return Response.status(204).build();
        } catch (InputDataValidationException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Input data validation exception")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (SellerNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Seller not found")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (SellerPhoneNumberExistException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Seller new phone number exist!")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (SellerUsernameExistException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Seller new username exist!")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    } //end edit seller

    // CHECKED: AARON
    @DELETE
    @Path("/{seller_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteSeller(@PathParam("seller_id") Long sellerId) {
        try {
            sellerSessionBeanLocal.deleteSeller(sellerId);
            return Response.status(204).build();
        } catch (SellerNotFoundException e) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Seller not found")
                    .build();

            return Response.status(404).entity(exception).build();
        } catch (SellerHasOutstandingOrdersException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Seller has outstanding orders, please handle before deletion!")
                    .build();

            return Response.status(404).entity(exception).build();
        }
    } //end delete seller

    // CHECKED: AARON
    @GET
    @Path("/{email}/{password}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response sellerLogin(@PathParam("email") String email, @PathParam("password") String password) {
        try {
            Seller seller = sellerSessionBeanLocal.sellerLogin(email, password);
            return Response.status(200).entity(seller).type(MediaType.APPLICATION_JSON).build();
        } catch (InvalidLoginCredentialException e) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Login invalid").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch(SellerNotFoundException e) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Seller not found").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (SellerIsBannedException e) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Seller is banned").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    } //end loginSeller

    // CHECKED: AARON
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Seller> getAllSellers() {
        return sellerSessionBeanLocal.retrieveAllSellers();
    } // end get all sellers

    // CHECKED: AARON
    @GET
    @Path("/{seller_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getSpecificSeller(@PathParam("seller_id") Long sellerId) {
        try {
            Seller seller = sellerSessionBeanLocal.retrieveSellerBySellerId(sellerId);
            return Response.status(200).entity(seller).type(MediaType.APPLICATION_JSON).build();
        } catch (SellerNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found")
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        }
    } // end get specific seller
    
    // CHECKED: AARON
    @PUT
    @Path("/{seller_id}/{buyer_id}/follow")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response followSellerThroughProfile(@PathParam("seller_id") Long sellerId, @PathParam("buyer_id") Long buyerId) {
        try {
            buyerSessionBeanLocal.followSellerThroughProfile(buyerId, sellerId);
            return Response.status(204).build();
        } catch (SellerNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Seller not found")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (BuyerNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Buyer not found")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (BuyerIsFollowingSellerAlreadyException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Buyer is already following this seller! Unable to follow!")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    } //end follow seller through profile
    
    // CHECKED: AARON
    @PUT
    @Path("/{seller_id}/{buyer_id}/unfollow")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response unfollowSellerThroughProfile(@PathParam("seller_id") Long sellerId, @PathParam("buyer_id") Long buyerId) {
        try {
            buyerSessionBeanLocal.unfollowSellerThroughProfile(buyerId, sellerId);
            return Response.status(204).build();
        } catch (SellerNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Seller not found")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (BuyerNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Buyer not found")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (BuyerIsNotFollowingSellerException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Buyer is not following this seller! Unable to unfollow!")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    } //end unfollow seller
    
    // CHECKED: AARON
    @GET
    @Path("/query")
    @Produces(MediaType.APPLICATION_JSON)
    public Response searchSeller(@QueryParam("username") String username) {

        try {

            if (username != null) {
                Seller result = sellerSessionBeanLocal.retrieveSellerByUsername(username);
                GenericEntity<Seller> entity = new GenericEntity<Seller>(result) {
                };

                return Response.status(200).entity(entity).build();
            } else {
                JsonObject exception = Json.createObjectBuilder()
                        .add("error", "No query conditions")
                        .build();

                return Response.status(400).entity(exception).build();
            }

        } catch (SellerNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "No query conditions")
                    .build();

            return Response.status(400).entity(exception).build();
        }
    } // end search for a seller

    // CHECKED: AARON
    @GET
    @Path("/{seller_id}/listings")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Listing> getSellerListings(@PathParam("seller_id") Long sellerId) {
        return listingSessionBeanLocal.retrieveSellerListings(sellerId);
    } // end get listings for current seller

    /*
    Is this method necessary?
     */
    // CHECKED: AARON
    @GET
    @Path("/{seller_id}/listings/{listing_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getSellerSpecificListing(@PathParam("seller_id") Long sellerId, @PathParam("listing_id") Long listingId) {
        Listing listing = listingSessionBeanLocal.retrieveListingBySellerIdAndListingId(sellerId, listingId);
        return Response.status(200).entity(listing).type(MediaType.APPLICATION_JSON).build();
    } // end get specific listing for current seller

    // CHECKED: AARON
    @POST
    @Path("/{seller_id}/listings")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addListing(@PathParam("seller_id") Long sellerId, Listing listing) {
        try {
            listingSessionBeanLocal.createNewListing(listing, sellerId);
//            Seller seller = sellerSessionBeanLocal.retrieveSellerBySellerId(sellerId);

//            return Response.status(200).entity(seller).build();
            return Response.status(200).build();
        } catch (SellerNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Seller not found")
                    .build();

            return Response.status(404).entity(exception).build();
        } catch (InputDataValidationException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Input validation failed")
                    .build();

            return Response.status(404).entity(exception).build();
        } catch (UnknownPersistenceException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Unknown persistence error")
                    .build();

            return Response.status(404).entity(exception).build();
        }
    } // end create listing for current seller

    // CHECKED: AARON
    @GET
    @Path("/{seller_id}/listings/query")
    @Produces(MediaType.APPLICATION_JSON)
    public Response searchListings(
            @QueryParam("listingCategory") ListingCategory listingCategory,
            @QueryParam("quantityGreater") Integer quantityGreater,
            @QueryParam("quantityLesser") Integer quantityLesser,
            @QueryParam("startPrice") BigDecimal startPrice,
            @QueryParam("endPrice") BigDecimal endPrice
    ) {
        if (listingCategory != null) {
            List<Listing> results = listingSessionBeanLocal.retrieveListingByListingCategory(listingCategory);

            GenericEntity<List<Listing>> entity = new GenericEntity<List<Listing>>(results) {
            };

            return Response.status(200).entity(entity).build();
        } else if (quantityGreater != null) {
            List<Listing> results = listingSessionBeanLocal.retrieveListingByQuantityGreater(quantityGreater);

            GenericEntity<List<Listing>> entity = new GenericEntity<List<Listing>>(results) {
            };

            return Response.status(200).entity(entity).build();
        } else if (quantityLesser != null) {
            List<Listing> results = listingSessionBeanLocal.retrieveListingByQuantityLesser(quantityLesser);

            GenericEntity<List<Listing>> entity = new GenericEntity<List<Listing>>(results) {
            };

            return Response.status(200).entity(entity).build();
        } else if (startPrice != null && endPrice != null) {
            List<Listing> results = listingSessionBeanLocal.retrieveListingByPriceRange(startPrice, endPrice);

            GenericEntity<List<Listing>> entity = new GenericEntity<List<Listing>>(results) {
            };

            return Response.status(200).entity(entity).build();
        } else if (startPrice != null) {
            List<Listing> results = listingSessionBeanLocal.retrieveListingByPrice(startPrice);

            GenericEntity<List<Listing>> entity = new GenericEntity<List<Listing>>(results) {
            };

            return Response.status(200).entity(entity).build();
        } else {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "No query conditions")
                    .build();

            return Response.status(400).entity(exception).build();
        }

    } // end query for seller's listings

    // CHECKED: AARON
    @PUT
    @Path("/{order_id}/acceptorder")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response acceptOrder(@PathParam("order_id") Long orderId) {
        try {
            sellerSessionBeanLocal.acceptOrder(orderId);
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
    } //end accept order

    // CHECKED: AARON
    @PUT
    @Path("/{order_id}/rejectorder")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response rejectOrder(@PathParam("order_id") Long orderId) {
        try {
            sellerSessionBeanLocal.rejectOrder(orderId);
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
    } //end reject order

    // CHECKED: AARON
    @PUT
    @Path("/{order_id}/completeorder")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response completeOrder(@PathParam("order_id") Long orderId) {
        try {
            sellerSessionBeanLocal.completeOrder(orderId);
            return Response.status(204).build();
        } catch (OrderNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Order not found")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (OrderIsNotAcceptedException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not able to complete order as it is not accepted yet")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    } //end complete order

    @POST
    @Path("/{seller_id}/posts")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createPost(@PathParam("seller_id") Long sellerId, Post p) {
        try {
            p.setDateCreated(new Date(System.currentTimeMillis()));
            postSessionBeanLocal.createNewSellerPost(p, sellerId);
            return Response.status(200).entity(p).type(MediaType.APPLICATION_JSON).build();
        } catch (UnknownPersistenceException | InputDataValidationException e) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Unknown Persistence or Input Data Validation error").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (SellerNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Seller not found").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    } //end create post
    
    @GET
    @Path("/{seller_id}/orders")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getOrders(@PathParam("seller_id") Long sellerId) {
        try {
            List<Order> orders = orderSessionBeanLocal.getSellerOrders(sellerId);
            return Response.status(200).entity(
                    orders
            ).type(MediaType.APPLICATION_JSON).build();
        } catch (SellerNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found: seller id " + sellerId)
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        }
    } //end getOrders
    
    // CHECKED: AARON
    @GET
    @Path("/{seller_id}/followers")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFollowers(@PathParam("seller_id") Long sellerId) {
        try {
            List<Buyer> buyersFollowing = sellerSessionBeanLocal.retrieveListOfFollowers(sellerId);
            return Response.status(200).entity(buyersFollowing).type(MediaType.APPLICATION_JSON).build();
        } catch (SellerNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found: seller id " + sellerId)
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        }
    } //end getFollowers
    
    @POST
    @Path("/{seller_id}/{post_id}/comments")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createComment(@PathParam("seller_id") Long sellerId, @PathParam("post_id") Long pId, Comment c) {
        try {
            commentSessionBeanLocal.createNewSellerComment(c, pId, sellerId);
            return Response.status(200).entity(c).type(MediaType.APPLICATION_JSON).build();
        } catch (UnknownPersistenceException | InputDataValidationException e) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Unknown Persistence or Input Data Validation error").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (SellerNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Seller not found").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (PostNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Post not found").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    } //end createComment
}

/*
NOT USED FOR NOW
 */

 /*


    @PUT
    @Path("/{seller_id}/listings")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response editListing(@PathParam("seller_id") Long sellerId, Listing listing) {
        try {
            listingSessionBeanLocal.updateListing(listing);
            return Response.status(200).entity(
                    listing
            ).type(MediaType.APPLICATION_JSON).build();
        } catch (InputDataValidationException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Input validation failed")
                    .build();

            return Response.status(404).entity(exception).build();
        } catch (ListingNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Listing not found")
                    .build();

            return Response.status(404).entity(exception).build();
        }
    } // end edit listing for current seller

    @DELETE
    @Path("{seller_id}/listings/{listing_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteListing(@PathParam("seller_id") Long sellerId, @PathParam("listing_id") Long listingId) {
        try {
            listingSessionBeanLocal.deleteListing(listingId);
            return Response.status(204).build();
        } catch (ListingNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Listing not found")
                    .build();

            return Response.status(404).entity(exception).build();
        }
    } // end delete listing for current seller

}


 */
