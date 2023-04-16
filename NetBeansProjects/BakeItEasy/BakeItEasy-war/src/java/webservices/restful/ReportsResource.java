/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import ejb.session.stateless.ReportSessionBeanLocal;
import entity.Buyer;
import entity.Report;
import entity.Seller;
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
    
    
    // edit report
    /*
      {
    "title": "report title2222",
    "reason": "report reason"
    }
    */
    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response editReport(@PathParam("id") Long reportId, Report report) {
        report.setReportId(reportId);
        try {
            Report oldReport = reportSessionBeanLocal.retrieveReportById(reportId);
            report.setReporter(oldReport.getReporter());
            report.setReportee(oldReport.getReportee());
            report.setAdminReviewer(oldReport.getAdminReviewer());
            reportSessionBeanLocal.updateReport(report);
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
    
    // get Reporter for report with id = {id}
    @GET
    @Path("/{id}/reporter")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getReporter(@PathParam("id") Long reportId) {
        try {
            Report report = reportSessionBeanLocal.retrieveReportById(reportId);
            Buyer reporter = report.getReporter();
            return Response.status(200).entity(
                    reporter
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
    } //end getReporter
    
    // get Reportee for report with id = {id}
    @GET
    @Path("/{id}/reportee")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getReportee(@PathParam("id") Long reportId) {
        try {
            Report report = reportSessionBeanLocal.retrieveReportById(reportId);
            Seller reportee = report.getReportee();
            return Response.status(200).entity(
                    reportee
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
    } //end getReportee
}
