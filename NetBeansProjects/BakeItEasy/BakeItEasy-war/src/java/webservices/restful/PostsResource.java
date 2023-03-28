/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import ejb.session.stateless.PostSessionBeanLocal;
import entity.Post;
import java.util.Date;
import javax.ejb.EJB;
import javax.enterprise.context.RequestScoped;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

/**
 *
 * @author Nelson Choo
 */

@Path("posts")
@RequestScoped
public class PostsResource {
    @EJB
    PostSessionBeanLocal postSessionBeanLocal;
    
//    @POST
//    @Consumes(MediaType.APPLICATION_JSON)
//    @Produces(MediaType.APPLICATION_JSON)
//    public Post createPost(Post p) {
//        try {
//            p.setDateCreated(new Date(System.currentTimeMillis()));
//            postSessionBeanLocal.createNewBuyerPost(p);
//        } catch (Exception e) {
//        }
//        return p;
//    } //end createCustomer
}
