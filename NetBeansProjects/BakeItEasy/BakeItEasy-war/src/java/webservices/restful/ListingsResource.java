/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import ejb.session.stateless.BuyerSessionBeanLocal;
import ejb.session.stateless.ListingSessionBeanLocal;
import entity.Listing;
import entity.Order;
import entity.Seller;
import enumeration.ListingCategory;
import error.exception.BuyerIsFollowingSellerAlreadyException;
import error.exception.BuyerIsNotFollowingSellerException;
import error.exception.BuyerNotFoundException;
import error.exception.InputDataValidationException;
import error.exception.ListingHasOngoingOrdersException;
import error.exception.ListingIsNotLikedException;
import error.exception.ListingLikedAlreadyException;
import error.exception.ListingNotFoundException;
import error.exception.OrderNotFoundException;
import error.exception.SellerNotFoundException;
import error.exception.UnknownPersistenceException;
import java.math.BigDecimal;
import java.util.List;
import javax.ejb.EJB;
import javax.ws.rs.Produces;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.enterprise.context.RequestScoped;
import javax.json.Json;
import javax.json.JsonObject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * REST Web Service
 *
 * @author aaronf
 */
@Path("listings")
@RequestScoped
public class ListingsResource {

    @EJB
    private ListingSessionBeanLocal listingSessionBeanLocal;

    @EJB
    private BuyerSessionBeanLocal buyerSessionBeanLocal;

    // CHECKED: AARON
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Listing> getAllListings() {
        return listingSessionBeanLocal.retrieveAllListings();
    } // end get all listings
    
    // CHECKED: AARON
    @GET
    @Path("/admin")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Listing> getAllListingsAdmin() {
        return listingSessionBeanLocal.retrieveAllListingsAdmin();
    } // end get all listings for admin

    // CHECKED: AARON
    @GET
    @Path("/query")
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

    } // end query for listings

    // CHECKED: AARON
    @GET
    @Path("/{listing_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getSpecificListing(@PathParam("listing_id") Long listingId) {
        try {
            Listing listing = listingSessionBeanLocal.retrieveListingByListingId(listingId);
            return Response.status(200).entity(listing).type(MediaType.APPLICATION_JSON).build();
        } catch (ListingNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found")
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        }
    } // end get specific listing

    // CHECKED: AARON
    @POST
    @Path("/{seller_id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Listing createListing(Listing listing, @PathParam("seller_id") Long sellerId) throws SellerNotFoundException, InputDataValidationException, UnknownPersistenceException {

        listingSessionBeanLocal.createNewListing(listing, sellerId);
        return listing;
    } // end create listing

    // CHECKED: AARON
    @DELETE
    @Path("/{listing_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteListing(@PathParam("listing_id") Long listingId) {
        try {
            listingSessionBeanLocal.deleteListing(listingId);
            return Response.status(204).build();
        } catch (ListingNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Listing not found")
                    .build();

            return Response.status(404).entity(exception).build();
        } catch (ListingHasOngoingOrdersException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Listing has ongoing orders, please handle before deletion!")
                    .build();

            return Response.status(404).entity(exception).build();
        } catch (OrderNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Listing has order that cannot be found!")
                    .build();

            return Response.status(404).entity(exception).build();
        }
    } //end delete listing

    // CHECKED: AARON
    @PUT
    @Path("/{listing_id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response editListing(@PathParam("listing_id") Long listingId, Listing listing) {
        listing.setListingId(listingId);
        try {
            listingSessionBeanLocal.updateListing(listing);
            return Response.status(204).build();
        } catch (InputDataValidationException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Input data validation exception")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (ListingNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Listing not found")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    } //end edit listing

    // CHECKED: AARON
    @PUT
    @Path("/{listing_id}/{buyer_id}/like")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response likeListing(@PathParam("listing_id") Long listingId, @PathParam("buyer_id") Long buyerId) {
        try {
            listingSessionBeanLocal.likeListing(buyerId, listingId);
            return Response.status(204).build();
        } catch (BuyerNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Buyer not found")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (ListingNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Listing not found")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (ListingLikedAlreadyException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Listing is already liked by buyer! Unable to like listing!")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    } //end like listing

    // CHECKED: AARON
    @PUT
    @Path("/{listing_id}/{buyer_id}/unlike")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response unlikeListing(@PathParam("listing_id") Long listingId, @PathParam("buyer_id") Long buyerId) {
        try {
            listingSessionBeanLocal.unlikeListing(buyerId, listingId);
            return Response.status(204).build();
        } catch (BuyerNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Buyer not found")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (ListingNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Listing not found")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        } catch (ListingIsNotLikedException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Listing is not liked by buyer! Unable to unlike listing!")
                    .build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    } //end like listing

    @GET
    @Path("/{listing_id}/seller")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getListingsSeller(@PathParam("listing_id") Long listingId) {
        try {
            Seller seller = listingSessionBeanLocal.getListingsSeller(listingId);
            return Response.status(200).entity(seller).type(MediaType.APPLICATION_JSON).build();
        } catch (ListingNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found")
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        }
    } // end get specific listing's seller

    // CHECKED: AARON
    @PUT
    @Path("/{listing_id}/{buyer_id}/follow")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response followSeller(@PathParam("listing_id") Long listingId, @PathParam("buyer_id") Long buyerId) {
        try {
            buyerSessionBeanLocal.followSeller(buyerId, listingId);
            return Response.status(204).build();
        } catch (ListingNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Listing not found")
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
    } //end follow seller

    // CHECKED: AARON
    @PUT
    @Path("/{listing_id}/{buyer_id}/unfollow")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response unfollowSeller(@PathParam("listing_id") Long listingId, @PathParam("buyer_id") Long buyerId) {
        try {
            buyerSessionBeanLocal.unfollowSeller(buyerId, listingId);
            return Response.status(204).build();
        } catch (ListingNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Listing not found")
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

    // CHECKED: ELYSIA
    @GET
    @Path("/{listing_id}/orders")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Order> getAllListingOrders(@PathParam("listing_id") Long listingId) throws ListingNotFoundException {
        Listing listing = listingSessionBeanLocal.retrieveListingByListingId(listingId);
        return listing.getOrders();
    } //end getAllListingOrders

    // CHECKED: ELYSIA
    @GET
    @Path("/{listing_id}/likes")
    @Produces(MediaType.APPLICATION_JSON)
    public Integer getNumberOfListingLikes(@PathParam("listing_id") Long listingId) throws ListingNotFoundException {
        Listing listing = listingSessionBeanLocal.retrieveListingByListingId(listingId);
        return listing.getLikers().size();
    } //end getNumberOfListingLikes

    // CHECKED: AARON
    @GET
    @Path("/{buyer_id}/followed")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Listing> getAllFollowedSellersListings(@PathParam("buyer_id") Long buyerId) throws BuyerNotFoundException {
        return listingSessionBeanLocal.getFollowedSellerListings(buyerId);
    } //end getAllFollowedSellersListings

    // CHECKED: AARON
    @GET
    @Path("/{buyer_id}/{listing_id}/isListingLiked")
    @Produces(MediaType.APPLICATION_JSON)
    public boolean isListingLikedByCurrentBuyer(@PathParam("listing_id") Long listingId, @PathParam("buyer_id") Long buyerId) throws BuyerNotFoundException, ListingNotFoundException {
        return listingSessionBeanLocal.isListingLikedByCurrentBuyer(buyerId, listingId);
    } //end isListingLikedByCurrentBuyer

    // CHECKED: AARON
    @GET
    @Path("/{listing_id}/pendingOrdersQuantity")
    @Produces(MediaType.APPLICATION_JSON)
    public Integer getNumberOfPendingOrdersByListingId(@PathParam("listing_id") Long listingId) throws ListingNotFoundException {
        return listingSessionBeanLocal.getNumberOfPendingOrdersByListingId(listingId);
    } //end getNumberOfPendingOrdersByListingId

    // CHECKED: AARON
    @GET
    @Path("/{listing_id}/acceptedOrdersQuantity")
    @Produces(MediaType.APPLICATION_JSON)
    public Integer getNumberOfAcceptedOrdersByListingId(@PathParam("listing_id") Long listingId) throws ListingNotFoundException {
        return listingSessionBeanLocal.getNumberOfAcceptedOrdersByListingId(listingId);
    } //end getNumberOfAcceptedOrdersByListingId

    // CHECKED: AARON
    @GET
    @Path("/{listing_id}/rejectedOrdersQuantity")
    @Produces(MediaType.APPLICATION_JSON)
    public Integer getNumberOfRejectedOrdersByListingId(@PathParam("listing_id") Long listingId) throws ListingNotFoundException {
        return listingSessionBeanLocal.getNumberOfRejectedOrdersByListingId(listingId);
    } //end getNumberOfRejectedOrdersByListingId

    // CHECKED: AARON
    @GET
    @Path("/{listing_id}/completedOrdersQuantity")
    @Produces(MediaType.APPLICATION_JSON)
    public Integer getNumberOfCompletedOrdersByListingId(@PathParam("listing_id") Long listingId) throws ListingNotFoundException {
        return listingSessionBeanLocal.getNumberOfCompletedOrdersByListingId(listingId);
    } //end getNumberOfCompletedOrdersByListingId

    // CHECKED: AARON
    @GET
    @Path("/{listing_id}/cancelledOrdersQuantity")
    @Produces(MediaType.APPLICATION_JSON)
    public Integer getNumberOfCancelledOrdersByListingId(@PathParam("listing_id") Long listingId) throws ListingNotFoundException {
        return listingSessionBeanLocal.getNumberOfCancelledOrdersByListingId(listingId);
    } //end getNumberOfCancelledOrdersByListingId

    // CHECKED: AARON
    @GET
    @Path("/{listing_id}/sellerPhoneNo")
    @Produces(MediaType.APPLICATION_JSON)
    public String getSellerPhoneNoByListingId(@PathParam("listing_id") Long listingId) throws ListingNotFoundException {
        return listingSessionBeanLocal.getSellerPhoneNoByListingId(listingId);
    } //end getSellerPhoneNoByListingId
}
