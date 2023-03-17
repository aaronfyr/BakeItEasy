/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Comment;
import entity.Post;
import error.PostNotFoundException;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

/**
 *
 * @author Nelson Choo
 */
@Stateless
public class PostSessionBean implements PostSessionBeanLocal {

    @PersistenceContext(unitName = "BakeItEasy-ejbPU")
    private EntityManager em;

    // Add business logic below. (Right-click in editor and choose
    // "Insert Code > Add Business Method")
    
    @Override
    public Long createNewPost(Post post) {
        em.persist(post);
        em.flush();
        
        return post.getPostId();
    }
    
    @Override
    public Post retrievePostById(Long postId) throws PostNotFoundException {
        Post post = em.find(Post.class, postId);
        
        if (post != null) {
            post.getComments().size();
            return post;
        } else {
            throw new PostNotFoundException("Post " + postId + " not found.");
        }
    }
    
    @Override
    public List<Post> searchPostsByTitle(String title) {
        Query q;
        if (title != null) {
            q = em.createQuery("SELECT p FROM Post p WHERE LOWER(p.title) LIKE :inTitle");
            q.setParameter("inTitle", "%" + title.toLowerCase() + "%");
        } else {
            q = em.createQuery("SELECT p FROM Post p");
        }
        
        return q.getResultList();
    }
    
    @Override
    public void editPost(Post post) throws PostNotFoundException {
        try {
            Post postToUpdate = retrievePostById(post.getPostId());
            
            postToUpdate.setTitle(post.getTitle());
            postToUpdate.setPostCategory(post.getPostCategory());
        } catch (PostNotFoundException ex) {
            throw new PostNotFoundException(ex.getMessage());
        }
    }
    
    @Override
    public void deletePost(Long postId) throws PostNotFoundException {
        try {
            Post post = retrievePostById(postId);
            
            List<Comment> comments = post.getComments();
            
            for (Comment comment: comments) {
                em.remove(comment);
            }
            em.remove(post);
        } catch (PostNotFoundException ex) {
            throw new PostNotFoundException(ex.getMessage());
        }
    }
}
