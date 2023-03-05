/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import ejb.session.stateless.BuyerSessionBeanLocal;
import entity.Buyer;
import java.util.List;
import javax.ejb.EJB;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

/**
 * REST Web Service
 *
 * @author Uni
 */
@Path("buyers")
public class BuyersResource {

    @EJB
    private BuyerSessionBeanLocal buyerSessionBeanLocal;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Buyer> getAllBuyers() {
        return buyerSessionBeanLocal.searchBuyers(null);
    }
}
