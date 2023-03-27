/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import ejb.session.stateless.BuyerSessionBeanLocal;
import entity.Buyer;
import error.exception.BuyerNotFoundException;
import error.exception.InvalidLoginCredentialException;
import java.util.List;
import javax.ejb.EJB;
import javax.json.Json;
import javax.json.JsonObject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
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

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Buyer createBuyer(Buyer b) {
        try {
            b.setIsBanned(false);
            buyerSessionBeanLocal.createNewBuyer(b);
        } catch (Exception e) {
        }
        return b;
    } //end createCustomer
    
    @GET
    @Path("/{email}/{password}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response buyerLogin(@PathParam("email") String email, @PathParam("password") String password) {
        try {
            Buyer buyer = buyerSessionBeanLocal.buyerLogin(email, password);
            return Response.status(200).entity(buyer).type(MediaType.APPLICATION_JSON).build();
        } catch (Exception e) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Login invalid").build();
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
                    .add("error", "Customer not found")
                    .build();
            
            return Response.status(404).entity(exception).build();
        }
    } //end deleteCustomer
}
