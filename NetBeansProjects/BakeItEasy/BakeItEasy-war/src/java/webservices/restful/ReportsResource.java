/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import ejb.session.stateless.ReportSessionBeanLocal;
import entity.Report;
import error.exception.AdminNotFoundException;
import error.exception.BuyerNotFoundException;
import error.exception.InputDataValidationException;
import error.exception.ReportNotFoundException;
import error.exception.SellerNotFoundException;
import error.exception.UnknownPersistenceException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ejb.EJB;
import javax.json.Json;
import javax.json.JsonObject;
import javax.persistence.NoResultException;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
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
@Path("reports")
public class ReportsResource {
    
    @EJB
    private ReportSessionBeanLocal reportSessionBeanLocal;
    
    // get all reports
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Report> getAllReports() {
        return reportSessionBeanLocal.retrieveAllReports();
    } //end getAllReports

    // get report with id = {id}
    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getReport(@PathParam("id") Long reportId) {
        try {
            Report report = reportSessionBeanLocal.retrieveReportById(reportId);
            return Response.status(200).entity(
                    report
            ).type(MediaType.APPLICATION_JSON).build();
        } catch (NoResultException e) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found")
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        } catch (ReportNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found: report id " + reportId)
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        }
    } //end getReport

    // TODO: TEST THIS
    // assign admin during creation of report or after?
    
    // create a new report
    // request body:
    /*
    {
    "title": "report title",
    "reason": "report reason"
    }
     */
    @POST
    @Path("/{buyer_id}/{seller_id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Report createReport(Report r, @PathParam("buyer_id") Long buyerId, @PathParam("seller_id") Long sellerId) {
        try {
            reportSessionBeanLocal.createNewReport(r, buyerId, sellerId);
        } catch (InputDataValidationException ex) {
            Logger.getLogger(AdminsResource.class.getName()).log(Level.SEVERE, null, ex); // not too sure how to catch this exception
        } catch (BuyerNotFoundException | SellerNotFoundException | UnknownPersistenceException ex) {
            Logger.getLogger(ReviewsResource.class.getName()).log(Level.SEVERE, null, ex);
        } 
        return r;
    } //end createReport
    
    // TODO: test
    // assign admin to report
    @PUT
    @Path("/{admin_id}/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response assignAdmin(@PathParam("admin_id") Long adminId, @PathParam("id") Long reportId) {
        try {
            Report report = reportSessionBeanLocal.retrieveReportById(reportId);
            reportSessionBeanLocal.assignAdmin(report, adminId);
            return Response.status(204).build();
        } catch (ReportNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found: report id " + reportId)
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
    }

    // edit report
    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response editReport(@PathParam("id") Long reportId, Report report) {
        report.setReportId(reportId);
        try {
            reportSessionBeanLocal.updateReport(report);
            return Response.status(204).build();
        } catch (NoResultException e) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found")
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        } catch (ReportNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found: report id " + reportId)
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        }
    } //end editReport

    // delete report of id = {id}
    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteReport(@PathParam("id") Long reportId) {
        try {
            reportSessionBeanLocal.removeReport(reportId);
            return Response.status(204).build();
        } catch (NoResultException e) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found")
                    .build();

            return Response.status(404).entity(exception).build();
        } catch (ReportNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found: report id " + reportId)
                    .build();

            return Response.status(404).entity(exception).build();
        }
    } //end deleteReport
}
