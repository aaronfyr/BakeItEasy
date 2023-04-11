/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import ejb.session.stateless.BuyerSessionBeanLocal;
import ejb.session.stateless.CommentSessionBeanLocal;
import ejb.session.stateless.PostSessionBeanLocal;
import ejb.session.stateless.SellerSessionBeanLocal;
import entity.Buyer;
import entity.Comment;
import entity.Post;
import entity.Seller;
import error.exception.BuyerNotFoundException;
import error.exception.PostNotFoundException;
import error.exception.SellerNotFoundException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ejb.EJB;
import javax.enterprise.context.RequestScoped;
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
 * @author Nelson Choo
 */
@Path("posts")
@RequestScoped
public class PostsResource {

    @EJB
    private PostSessionBeanLocal postSessionBeanLocal;

    @EJB
    private CommentSessionBeanLocal commentSessionBeanLocal;

    @EJB
    private SellerSessionBeanLocal sellerSessionBeanLocal;

    @EJB
    private BuyerSessionBeanLocal buyerSessionBeanLocal;

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
    } //end getPost

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
    } //end editPost

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
    } //end deletePost

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Post> getAllPosts() {
        return postSessionBeanLocal.retrieveAllPosts();
    } // end get all listings

    // checked: ELY
    @GET
    @Path("/{id}/comments")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCommentsForPost(@PathParam("id") Long pId) {
        try {
            List<Comment> comments = postSessionBeanLocal.getCommentsByPostId(pId);
            return Response.status(200).entity(comments).type(MediaType.APPLICATION_JSON).build();
        } catch (PostNotFoundException e) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Not found").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    } //end getCommentsForPost

    // checked: ELY
    @GET
    @Path("/seller/{seller_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPostsForSeller(@PathParam("seller_id") Long sellerId) {
        try {
            Seller seller = sellerSessionBeanLocal.retrieveSellerBySellerId(sellerId);
            List<Post> posts = seller.getPosts();
            return Response.status(200).entity(posts).type(MediaType.APPLICATION_JSON).build();
        } catch (SellerNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Seller Not found").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    } //end getPostsForSeller

    // checked: ELY
    @GET
    @Path("/buyer/{buyer_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPostsForBuyer(@PathParam("buyer_id") Long buyerId) {
        try {
            Buyer seller = buyerSessionBeanLocal.retrieveBuyerById(buyerId);
            List<Post> posts = seller.getPosts();
            return Response.status(200).entity(posts).type(MediaType.APPLICATION_JSON).build();
        } catch (BuyerNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Buyer Not found").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    }

    // checked: NELSON
    @GET
    @Path("/{post_id}/{user}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserFromPost(@PathParam("post_id") Long postId, @PathParam("user") String user) {
        try {
            if (user.equals("buyer")) {
                Buyer buyer = postSessionBeanLocal.getBuyerFromPost(postId);
                return Response.status(200).entity(buyer).type(MediaType.APPLICATION_JSON).build();
            } else if (user.equals("seller")) {
                Seller seller = postSessionBeanLocal.getSellerFromPost(postId);
                return Response.status(200).entity(seller).type(MediaType.APPLICATION_JSON).build();
            } else {
                JsonObject exception = Json.createObjectBuilder().add("error", "Incorrect user string").build();
                return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
            }
        } catch (PostNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder().add("error", "Post Not found").build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    }
}
