/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import ejb.session.stateless.ListingSessionBeanLocal;
import entity.Listing;
import enumeration.ListingCategory;
import error.exception.InputDataValidationException;
import error.exception.ListingNotFoundException;
import error.exception.SellerNotFoundException;
import error.exception.UnknownPersistenceException;
import java.util.List;
import javax.ejb.EJB;
import javax.ws.rs.Produces;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.enterprise.context.RequestScoped;
import javax.json.Json;
import javax.json.JsonObject;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
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
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Listing> getAllListings() {
        return listingSessionBeanLocal.retrieveAllListings();
    } // end get all listings
    
    @GET
    @Path("/query")
    @Produces(MediaType.APPLICATION_JSON)
    public Response searchListings(@QueryParam("category") ListingCategory listingCategory) {

        if (listingCategory != null) {
            List<Listing> result = listingSessionBeanLocal.retrieveListingByListingCategory(listingCategory);
            GenericEntity<List<Listing>> entity = new GenericEntity<List<Listing>>(result) {
            };

            return Response.status(200).entity(entity).build();
        } else {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "No query conditions")
                    .build();

            return Response.status(400).entity(exception).build();
        }
    } // end search listings
    
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
    
    @POST
    @Path("/{seller_id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Listing createListing(Listing listing, @PathParam("seller_id") Long sellerId) throws SellerNotFoundException, InputDataValidationException, UnknownPersistenceException {

        listingSessionBeanLocal.createNewListing(listing, sellerId);
        return listing;
    } // end create listing
}
