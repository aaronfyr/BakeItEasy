/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import ejb.session.stateless.ListingSessionBeanLocal;
import ejb.session.stateless.SellerSessionBeanLocal;
import entity.Listing;
import entity.Seller;
import enumeration.ListingCategory;
import error.exception.InputDataValidationException;
import error.exception.ListingNotFoundException;
import error.exception.SellerEmailExistException;
import error.exception.SellerNotFoundException;
import error.exception.SellerPhoneNumberExistException;
import error.exception.SellerUsernameExistException;
import error.exception.UnknownPersistenceException;
import java.math.BigDecimal;
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
    private ListingSessionBeanLocal listingSessionBeanLocal;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Seller createSeller(Seller seller) throws UnknownPersistenceException, InputDataValidationException, SellerUsernameExistException, SellerEmailExistException, SellerPhoneNumberExistException {
        sellerSessionBeanLocal.createNewSeller(seller);
        return seller;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Seller> getAllSellers() {
        return sellerSessionBeanLocal.retrieveAllSellers();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getSeller(@PathParam("id") Long sellerId) {
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
    }

    @GET
    @Path("/query")
    @Produces(MediaType.APPLICATION_JSON)
    public Response searchSeller(
            @QueryParam("username") String username,
            @QueryParam("phone") String phone,
            @QueryParam("email") String email) throws SellerNotFoundException {

        if (username != null) {
            Seller result = sellerSessionBeanLocal.retrieveSellerByUsername(username);
            GenericEntity<Seller> entity = new GenericEntity<Seller>(result) {
            };

            return Response.status(200).entity(entity).build();
        } else if (phone != null) {
            Seller result = sellerSessionBeanLocal.retrieveSellerByPhoneNumber(phone);
            GenericEntity<Seller> entity = new GenericEntity<Seller>(result) {
            };

            return Response.status(200).entity(entity).build();
        } else if (email != null) {
            Seller result = sellerSessionBeanLocal.retrieveSellerByEmail(email);
            GenericEntity<Seller> entity = new GenericEntity<Seller>(result) {
            };

            return Response.status(200).entity(entity).build();
        } else {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "No query conditions")
                    .build();

            return Response.status(400).entity(exception).build();
        }
    }

    @POST
    @Path("/{seller_id}/listings")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addListing(@PathParam("seller_id") Long sellerId, Listing listing) {
        try {
            listingSessionBeanLocal.createNewListing(listing, sellerId);
            Seller seller = sellerSessionBeanLocal.retrieveSellerBySellerId(sellerId);

            return Response.status(200).entity(seller).build();
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
    }

    @PUT
    @Path("/{seller_id}/listings")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response editListing(Listing listing) {
        try {
            listingSessionBeanLocal.updateListing(listing);
            return Response.status(204).build();
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
    }

    @DELETE
    @Path("{seller_id}/listings/{listing_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteListing(@PathParam("id") Long listingId) {
        try {
            listingSessionBeanLocal.deleteListing(listingId);
            return Response.status(204).build();
        } catch (ListingNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Listing not found")
                    .build();

            return Response.status(404).entity(exception).build();
        }
    }

    @GET
    @Path("/{seller_id}/listings")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Listing> getAllListings() {
        return listingSessionBeanLocal.retrieveAllListings();
    }

    @GET
    @Path("/{seller_id}/listings/query")
    @Produces(MediaType.APPLICATION_JSON)
    public Response searchListings(
            @QueryParam("category") ListingCategory listingCategory,
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
            List<Listing> results = listingSessionBeanLocal.retrieveListingByQuantityLesser(quantityGreater);

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

    }

}
