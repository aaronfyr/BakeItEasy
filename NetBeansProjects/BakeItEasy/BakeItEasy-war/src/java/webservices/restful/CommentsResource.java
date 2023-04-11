/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import ejb.session.stateless.CommentSessionBeanLocal;
import entity.Buyer;
import entity.Comment;
import entity.Post;
import entity.Seller;
import error.exception.CommentNotFoundException;
import error.exception.PostNotFoundException;
import javax.ejb.EJB;
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
@Path("comments")
public class CommentsResource {
    
    @EJB
    private CommentSessionBeanLocal commentSessionBeanLocal;
    
    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getComment(@PathParam("id") Long cId) {
        try {
            Comment comment = commentSessionBeanLocal.retrieveCommentById(cId);
            return Response.status(200).entity(comment).type(MediaType.APPLICATION_JSON).build();
        } catch (CommentNotFoundException e) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Not found").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    } //end getComment
    
    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response editComment(@PathParam("id") Long commentId, Comment comment) {
        comment.setCommentId(commentId);
        try {
            commentSessionBeanLocal.editComment(comment);
            return Response.status(200).entity(
                    comment
            ).type(MediaType.APPLICATION_JSON).build();
        } catch (NoResultException e) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found")
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        } catch (CommentNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found: comment id " + commentId)
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        }
    } //end editComment
    
    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteComment(@PathParam("id") Long commentId) {
        try {
            commentSessionBeanLocal.deleteComment(commentId);
            return Response.status(204).build();
        } catch (NoResultException e) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found")
                    .build();

            return Response.status(404).entity(exception).build();
        } catch (CommentNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found: comment id " + commentId)
                    .build();

            return Response.status(404).entity(exception).build();
        }
    } //end deleteComment
    
    // checked: NELSON
    @GET
    @Path("/{comment_id}/{user}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserFromComment(@PathParam("comment_id") Long commentId, @PathParam("user") String user) {
        try {
            if (user.equals("buyer")) {
                Buyer buyer = commentSessionBeanLocal.getBuyerFromComment(commentId);
                return Response.status(200).entity(buyer).type(MediaType.APPLICATION_JSON).build();
            } else if (user.equals("seller")) {
                Seller seller = commentSessionBeanLocal.getSellerFromComment(commentId);
                return Response.status(200).entity(seller).type(MediaType.APPLICATION_JSON).build();
            } else {
                JsonObject exception = Json.createObjectBuilder().add("error", "Incorrect user string").build();
                return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
            }
        } catch (CommentNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Post Not found").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    }
}
