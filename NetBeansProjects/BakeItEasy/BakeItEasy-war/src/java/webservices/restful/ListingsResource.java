/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import ejb.session.stateless.ListingSessionBeanLocal;
import entity.Listing;
import enumeration.ListingCategory;
import error.exception.BuyerNotFoundException;
import error.exception.InputDataValidationException;
import error.exception.ListingHasOngoingOrdersException;
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
    
    // CHECKED: AARON
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Listing> getAllListings() {
        return listingSessionBeanLocal.retrieveAllListings();
    } // end get all listings
    
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
        }
    } //end like listing
    
}
