/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import ejb.session.stateless.PostSessionBeanLocal;
import entity.Post;
import entity.Report;
import error.exception.PostNotFoundException;
import error.exception.ReportNotFoundException;
import javax.ejb.EJB;
import javax.enterprise.context.RequestScoped;
import javax.json.Json;
import javax.json.JsonObject;
import javax.persistence.NoResultException;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 *
 * @author Nelson Choo
 */

@Path("posts")
@RequestScoped
public class PostsResource {
    @EJB
    PostSessionBeanLocal postSessionBeanLocal;

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPost(@PathParam("id") Long pId) {
        try {
            Post post = postSessionBeanLocal.retrievePostById(pId);
            return Response.status(200).entity(post).type(MediaType.APPLICATION_JSON).build();
        } catch (PostNotFoundException e) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Not found").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    } //end getCustomer
    
    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response editPost(@PathParam("id") Long postId, Post post) {
        post.setPostId(postId);
        try {
            postSessionBeanLocal.editPost(post);
            return Response.status(200).entity(
                    post
            ).type(MediaType.APPLICATION_JSON).build();
        } catch (NoResultException e) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found")
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        } catch (PostNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found: post id " + postId)
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        }
    } //end editReport
    
    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deletePost(@PathParam("id") Long postId) {
        try {
            postSessionBeanLocal.deletePost(postId);
            return Response.status(204).build();
        } catch (NoResultException e) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found")
                    .build();

            return Response.status(404).entity(exception).build();
        } catch (PostNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found: post id " + postId)
                    .build();

            return Response.status(404).entity(exception).build();
        }
    } //end deleteReport
}
