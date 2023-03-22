/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import ejb.session.stateless.ReviewSessionBeanLocal;
import ejb.session.stateless.SellerSessionBeanLocal;
import entity.Report;
import entity.Review;
import entity.Seller;
import error.exception.SellerNotFoundException;
import java.util.List;
import javax.ejb.EJB;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

/**
 *
 * @author elysia
 */
@Path("sellers")
public class SellersResource {
    
    @EJB
    private SellerSessionBeanLocal sellerSessionBeanLocal;
    
    @EJB    
    private ReviewSessionBeanLocal reviewSessionBeanLocal;
    
    // TODO: test
    // get all reviews for seller with id = {id}
    @GET
    @Path("/{id}/reviews")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Review> getAllSellerReviews(@PathParam("id") Long sellerId) throws SellerNotFoundException {
        Seller seller = sellerSessionBeanLocal.retrieveSellerBySellerId(sellerId);
        return seller.getReviews();
    } //end getAllSellerReviews
    
    // TODO: test
    // get all reports for seller with id = {id}
    @GET
    @Path("/{id}/reports")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Report> getAllSellerReports(@PathParam("id") Long sellerId) throws SellerNotFoundException {
        Seller seller = sellerSessionBeanLocal.retrieveSellerBySellerId(sellerId);
        return seller.getReports();
    } //end getAllSellerReports

}
