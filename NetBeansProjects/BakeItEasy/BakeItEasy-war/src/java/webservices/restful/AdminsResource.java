/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import ejb.session.stateless.AdminSessionBeanLocal;
import ejb.session.stateless.BuyerSessionBeanLocal;
import ejb.session.stateless.ReportSessionBeanLocal;
import entity.Admin;
import entity.Buyer;
import entity.Report;
import entity.Seller;
import error.exception.AdminNotFoundException;
import error.exception.BuyerNotFoundException;
import error.exception.InputDataValidationException;
import error.exception.InvalidLoginCredentialException;
import error.exception.ReportNotFoundException;
import error.exception.SellerNotFoundException;
import error.exception.UnknownPersistenceException;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ejb.EJB;
import javax.json.Json;
import javax.json.JsonObject;
import javax.persistence.NoResultException;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 *
 * @author elysia
 */
@Path("admins")
public class AdminsResource {
    
    @EJB
    private AdminSessionBeanLocal adminSessionBeanLocal;
    
    @EJB
    private ReportSessionBeanLocal reportSessionBeanLocal;
    
    @EJB
    private BuyerSessionBeanLocal buyerSessionBeanLocal;
    
    // get all admins
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Admin> getAllAdmins() {
        return adminSessionBeanLocal.retrieveAllAdmins();
    } //end getAllAdmins

    // get admin with id = {id}
    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAdmin(@PathParam("id") Long adminId) {
        try {
            Admin a = adminSessionBeanLocal.retrieveAdminById(adminId);
            return Response.status(200).entity(
                    a
            ).type(MediaType.APPLICATION_JSON).build();
        } catch (NoResultException e) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found")
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        } catch (AdminNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found: admin id " + adminId)
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        }
    } //end getAdmin
    
    // create a new admin
    // request body:
    /*
    {
    "name": "admin1",
    "username": "admin",
    "email": "admin@mail.com",
    "password": "password"
    }
    */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Admin createAdmin(Admin a) {
        try {
            adminSessionBeanLocal.createNewAdmin(a);
        } catch (UnknownPersistenceException | InputDataValidationException ex) {
            Logger.getLogger(AdminsResource.class.getName()).log(Level.SEVERE, null, ex);
        }
        return a;
    } //end createAdmin
    
    // login
    // request body:
    /*
    {
    "email": "admin@mail.com",
    "password": "password"
    }
     */
    @GET
    @Path("/{email}/{password}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(@PathParam("email") String email, @PathParam("password") String password) {
        try {
            Admin a = adminSessionBeanLocal.login(email, password);
            return Response.status(200).entity(a).type(MediaType.APPLICATION_JSON).build();
        } catch (InvalidLoginCredentialException ex) {
            System.out.println("hi");
            JsonObject exception = Json.createObjectBuilder().add("error", "Login invalid").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    } //end login
    
    // logout
//    @POST
//    @Path("/logout")
//    @Consumes(MediaType.APPLICATION_JSON)
//    @Produces(MediaType.APPLICATION_JSON)
//    public Response logout() {
//        return Response.status(Response.Status.NO_CONTENT).build();
//    }
    
    // assign admin to a report
    @PUT
    @Path("/{admin_id}/reports/{report_id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response assignAdminToReport(@PathParam("admin_id") Long aId, @PathParam("report_id") Long rId) {
        try {
            Report report = reportSessionBeanLocal.retrieveReportById(rId);
            reportSessionBeanLocal.assignAdmin(report, aId);
            return Response.status(200).entity(
                    report
            ).type(MediaType.APPLICATION_JSON).build();
        } catch (NoResultException e) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found")
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        } catch (AdminNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found: admin id " + aId)
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        } catch (ReportNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found: report id " + rId)
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        }
    } //end assignAdminToReport
    
    // edit admin
    /*
    {
    "name" : "admin1",
    "username": "admin",
    "email": "admin@mail.com",
    "password": "password"
    }
    */
    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response editAdmin(@PathParam("id") Long aId, Admin a) {
        a.setAdminId(aId);
        try {
            adminSessionBeanLocal.updateAdmin(a);
            return Response.status(200).entity(
                    a
            ).type(MediaType.APPLICATION_JSON).build();
        } catch (NoResultException e) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found")
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        } catch (AdminNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found: admin id " + aId)
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        }
    } //end editAdmin
    
    // delete admin of id = {id}
    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteAdmin(@PathParam("id") Long aId) {
        try {
            adminSessionBeanLocal.removeAdmin(aId);
            return Response.status(204).build();
        } catch (NoResultException e) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found")
                    .build();

            return Response.status(404).entity(exception).build();
        } catch (AdminNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found: admin id " + aId)
                    .build();

            return Response.status(404).entity(exception).build();
        }
    } //end deleteAdmin
    
    // ban buyer of id = {id}
    @PUT
    @Path("/ban/buyers/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response banBuyer(@PathParam("id") Long buyerId) {
        try {
            Buyer buyer = adminSessionBeanLocal.banBuyer(buyerId);
            return Response.status(200).entity(
                    buyer
            ).type(MediaType.APPLICATION_JSON).build();
        } catch (BuyerNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found: buyer id " + buyerId)
                    .build();

            return Response.status(404).entity(exception).build();
        }
    }
    
    // unban buyer of id = {id}
    @PUT
    @Path("/unban/buyers/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response unbanBuyer(@PathParam("id") Long buyerId) {
        try {
            Buyer buyer = adminSessionBeanLocal.unbanBuyer(buyerId);
            return Response.status(200).entity(
                    buyer
            ).type(MediaType.APPLICATION_JSON).build();
        } catch (BuyerNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found: buyer id " + buyerId)
                    .build();

            return Response.status(404).entity(exception).build();
        }
    }
    
    // ban seller of id = {id}
    @PUT
    @Path("/ban/sellers/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response banSeller(@PathParam("id") Long sellerId) {
        try {
            Seller seller = adminSessionBeanLocal.banSeller(sellerId);
            return Response.status(200).entity(
                    seller
            ).type(MediaType.APPLICATION_JSON).build();
        } catch (SellerNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found: seller id " + sellerId)
                    .build();

            return Response.status(404).entity(exception).build();
        }
    }
    
    // unban seller of id = {id}
    @PUT
    @Path("/unban/sellers/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response unbanSeller(@PathParam("id") Long sellerId) {
        try {
            Seller seller = adminSessionBeanLocal.unbanSeller(sellerId);
            return Response.status(200).entity(
                    seller
            ).type(MediaType.APPLICATION_JSON).build();
        } catch (SellerNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found: seller id " + sellerId)
                    .build();

            return Response.status(404).entity(exception).build();
        }
    }
    
}
