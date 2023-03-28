/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import ejb.session.stateless.AdminSessionBeanLocal;
import ejb.session.stateless.AppointmentSessionBeanLocal;
import ejb.session.stateless.ListingSessionBeanLocal;
import ejb.session.stateless.ReviewSessionBeanLocal;
import ejb.session.stateless.SellerSessionBeanLocal;
import entity.Appointment;
import entity.Listing;
import entity.Report;
import entity.Review;
import entity.Seller;
import enumeration.ListingCategory;
import error.exception.InputDataValidationException;
import error.exception.InvalidLoginCredentialException;
import error.exception.ListingNotFoundException;
import error.exception.SellerEmailExistException;
import error.exception.SellerNotFoundException;
import error.exception.SellerPhoneNumberExistException;
import error.exception.SellerUsernameExistException;
import error.exception.UnknownPersistenceException;
import java.math.BigDecimal;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ejb.EJB;
import javax.ws.rs.Path;
import javax.enterprise.context.RequestScoped;
import javax.json.Json;
import javax.json.JsonObject;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
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
    private AppointmentSessionBeanLocal appointmentSessionBeanLocal;
    
    // get all reviews for seller with id = {id}
    @GET
    @Path("/{seller_id}/reviews")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Review> getAllSellerReviews(@PathParam("seller_id") Long sellerId) throws SellerNotFoundException {
        return reviewSessionBeanLocal.retrieveSellerReviews(sellerId);
    } //end getAllSellerReviews

    // get all reports for seller with id = {id}
    @GET
    @Path("/{seller_id}/reports")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Report> getAllSellerReports(@PathParam("seller_id") Long sellerId) throws SellerNotFoundException {
        Seller seller = sellerSessionBeanLocal.retrieveSellerBySellerId(sellerId);
        return seller.getReports();
    } //end getAllSellerReports

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Seller createSeller(Seller seller) throws UnknownPersistenceException, InputDataValidationException, SellerUsernameExistException, SellerEmailExistException, SellerPhoneNumberExistException {

        sellerSessionBeanLocal.createNewSeller(seller);
        return seller;
    } // end create seller
    
//    @DELETE
//    @Path("/{seller_id}")
//    @Produces(MediaType.APPLICATION_JSON)
//    public Response deleteSeller(@PathParam("seller_id") Long sellerId) {
//        try {
//            sellerSessionBeanLocal;
//            return Response.status(204).build();
//        } catch (SellerNotFoundException e) {
//            JsonObject exception = Json.createObjectBuilder()
//                    .add("error", "Customer not found")
//                    .build();
//            
//            return Response.status(404).entity(exception).build();
//        }
//    } //end delete seller

    @GET
    @Path("/{email}/{password}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response sellerLogin(@PathParam("email") String email, @PathParam("password") String password) {
        try {
            Seller seller = sellerSessionBeanLocal.sellerLogin(email, password);
            return Response.status(200).entity(seller).type(MediaType.APPLICATION_JSON).build();
        } catch (InvalidLoginCredentialException | SellerNotFoundException e) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Login invalid").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    } //end loginSeller

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Seller> getAllSellers() {
        return sellerSessionBeanLocal.retrieveAllSellers();
    } // end get all sellers

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

    @GET
    @Path("/query")
    @Produces(MediaType.APPLICATION_JSON)
    public Response searchSeller(@QueryParam("username") String username) throws SellerNotFoundException {

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
    } // end search for a seller

    @GET
    @Path("/{seller_id}/listings")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Listing> getSellerListings(@PathParam("seller_id") Long sellerId) {
        return listingSessionBeanLocal.retrieveSellerListings(sellerId);
    } // end get listings for current seller

    /*
    Is this method necessary?
    */
    @GET
    @Path("/{seller_id}/listings/{listing_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getSellerSpecificListing(@PathParam("seller_id") Long sellerId, @PathParam("listing_id") Long listingId) {
        Listing listing = listingSessionBeanLocal.retrieveListingBySellerIdAndListingId(sellerId, listingId);
        return Response.status(200).entity(listing).type(MediaType.APPLICATION_JSON).build();
    } // end get specific listing for current seller
    
    @GET
    @Path("/{seller_id}/listings/query")
    @Produces(MediaType.APPLICATION_JSON)
    public Response searchSellerListings(@PathParam("seller_id") Long sellerId, @QueryParam("category") ListingCategory listingCategory) {

        if (listingCategory != null) {
            List<Listing> result = listingSessionBeanLocal.retrieveListingByListingCategoryAndSellerId(listingCategory, sellerId);
            GenericEntity<List<Listing>> entity = new GenericEntity<List<Listing>>(result) {
            };

            return Response.status(200).entity(entity).build();
        } else {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "No query conditions")
                    .build();

            return Response.status(400).entity(exception).build();
        }
    } // end search seller listings
    
    @GET
    @Path("/{seller_id}/appointments")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Appointment> getAllSellerAppointments(@PathParam("seller_id") Long sellerId) {
        return appointmentSessionBeanLocal.retrieveSellerAppointments(sellerId);
    } // end get all appointments for current seller
    
    @GET
    @Path("/{seller_id}/appointments/{appointment_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getSellerSpecificAppointment(@PathParam("seller_id") Long sellerId, @PathParam("appointment_id") Long appointmentId) {
        Appointment appointment = appointmentSessionBeanLocal.retrieveAppointmentBySellerIdAndAppointmentId(sellerId, appointmentId);
        return Response.status(200).entity(appointment).type(MediaType.APPLICATION_JSON).build();
    } // end get specific appointment for current seller

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

    @PUT
    @Path("/{seller_id}/listings")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response editListing(Listing listing) {
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
    } // end delete listing for current seller

//    @GET
//    @Path("/{seller_id}/listings/query")
//    @Produces(MediaType.APPLICATION_JSON)
//    public Response searchListings(
//            @QueryParam("category") ListingCategory listingCategory,
//            @QueryParam("quantityGreater") Integer quantityGreater,
//            @QueryParam("quantityLesser") Integer quantityLesser,
//            @QueryParam("startPrice") BigDecimal startPrice,
//            @QueryParam("endPrice") BigDecimal endPrice
//    ) {
//        if (listingCategory != null) {
//            List<Listing> results = listingSessionBeanLocal.retrieveListingByListingCategory(listingCategory);
//
//            GenericEntity<List<Listing>> entity = new GenericEntity<List<Listing>>(results) {
//            };
//
//            return Response.status(200).entity(entity).build();
//        } else if (quantityGreater != null) {
//            List<Listing> results = listingSessionBeanLocal.retrieveListingByQuantityGreater(quantityGreater);
//
//            GenericEntity<List<Listing>> entity = new GenericEntity<List<Listing>>(results) {
//            };
//
//            return Response.status(200).entity(entity).build();
//        } else if (quantityLesser != null) {
//            List<Listing> results = listingSessionBeanLocal.retrieveListingByQuantityLesser(quantityGreater);
//
//            GenericEntity<List<Listing>> entity = new GenericEntity<List<Listing>>(results) {
//            };
//
//            return Response.status(200).entity(entity).build();
//        } else if (startPrice != null && endPrice != null) {
//            List<Listing> results = listingSessionBeanLocal.retrieveListingByPriceRange(startPrice, endPrice);
//
//            GenericEntity<List<Listing>> entity = new GenericEntity<List<Listing>>(results) {
//            };
//
//            return Response.status(200).entity(entity).build();
//        } else if (startPrice != null) {
//            List<Listing> results = listingSessionBeanLocal.retrieveListingByPrice(startPrice);
//
//            GenericEntity<List<Listing>> entity = new GenericEntity<List<Listing>>(results) {
//            };
//
//            return Response.status(200).entity(entity).build();
//        } else {
//            JsonObject exception = Json.createObjectBuilder()
//                    .add("error", "No query conditions")
//                    .build();
//
//            return Response.status(400).entity(exception).build();
//        }
//
//    } // end query for seller's listings
}
