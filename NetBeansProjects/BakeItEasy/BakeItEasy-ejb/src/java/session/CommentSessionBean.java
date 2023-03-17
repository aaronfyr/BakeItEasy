/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Comment;
import entity.Post;
import error.CommentNotFoundException;
import error.PostNotFoundException;
import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author Nelson Choo
 */
@Stateless
public class CommentSessionBean implements CommentSessionBeanLocal {

    @EJB
    private PostSessionBeanLocal postSessionBean;

    @PersistenceContext(unitName = "BakeItEasy-ejbPU")
    private EntityManager em;

    @Override
    public Long createNewComment(Comment comment) {
        em.persist(comment);
        em.flush();
        return comment.getCommentId();
    }
    
    @Override
    public Comment retrieveCommentById(Long commentId) throws CommentNotFoundException {
        Comment comment = em.find(Comment.class, commentId);
        
        if (comment != null) {
            return comment;
        } else {
            throw new CommentNotFoundException("Comment " + commentId + " does not exist.");
        }
    }
    
    @Override
    public List<Comment> getCommentsFromPost(Long postId) throws PostNotFoundException {
        try {
            Post post = postSessionBean.retrievePostById(postId);
            
            return post.getComments();
        } catch (PostNotFoundException ex) {
            throw new PostNotFoundException(ex.getMessage());
        }
    }
    
    @Override
    public void editComment(Comment comment) throws CommentNotFoundException {
        try {
            Comment commentToEdit = retrieveCommentById(comment.getCommentId());
            
            commentToEdit.setTitle(comment.getTitle());
        } catch (CommentNotFoundException ex) {
            throw new CommentNotFoundException(ex.getMessage());
        }
    }
    
    @Override
    public void deleteComment(Long commentId) throws CommentNotFoundException {
        try {
            Comment comment = retrieveCommentById(commentId);
            
            comment.getPost().getComments().remove(comment);
            em.remove(comment);
        } catch (CommentNotFoundException ex) {
            throw new CommentNotFoundException(ex.getMessage());
        }
    }

    // Add business logic below. (Right-click in editor and choose
    // "Insert Code > Add Business Method")
}
