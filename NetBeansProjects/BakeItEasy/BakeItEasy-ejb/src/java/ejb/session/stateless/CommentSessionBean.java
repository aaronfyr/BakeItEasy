/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Buyer;
import entity.Comment;
import entity.Post;
import entity.Seller;
import error.exception.BuyerNotFoundException;
import error.exception.CommentNotFoundException;
import error.exception.InputDataValidationException;
import error.exception.PostNotFoundException;
import error.exception.SellerNotFoundException;
import error.exception.UnknownPersistenceException;
import java.util.List;
import java.util.Set;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceException;
import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

/**
 *
 * @author Nelson Choo
 */
@Stateless
public class CommentSessionBean implements CommentSessionBeanLocal {

    @EJB
    private PostSessionBeanLocal postSessionBeanLocal;
    
    @EJB
    private BuyerSessionBeanLocal buyerSessionBeanLocal;
    
    @EJB
    private SellerSessionBeanLocal sellerSessionBeanLocal;

    @PersistenceContext(unitName = "BakeItEasy-ejbPU")
    private EntityManager em;
    
    private final ValidatorFactory validatorFactory;
    private final Validator validator;

    public CommentSessionBean() {
        this.validatorFactory = Validation.buildDefaultValidatorFactory();
        this.validator = validatorFactory.getValidator();
    }
    
    @Override
    public Long createNewBuyerComment(Comment comment, Long postId, Long buyerId) throws UnknownPersistenceException, InputDataValidationException, BuyerNotFoundException, PostNotFoundException {
        Set<ConstraintViolation<Comment>> constraintViolations = validator.validate(comment);

        if (constraintViolations.isEmpty()) {
            try {
                Post post = postSessionBeanLocal.retrievePostById(postId);
                Buyer buyer = buyerSessionBeanLocal.retrieveBuyerById(buyerId);
                comment.setPost(post);
                post.getComments().add(comment);
                comment.setBuyer(buyer);
                comment.setIsBuyer(true);
                buyer.getComments().add(comment);
                em.persist(comment);
                em.flush();
                return comment.getCommentId();
            } catch (PersistenceException ex) {
                if (ex.getCause() != null && ex.getCause().getClass().getName().equals("org.eclipse.persistence.exceptions.DatabaseException")) {
                    if (ex.getCause().getCause() != null && ex.getCause().getCause().getClass().getName().equals("java.sql.SQLIntegrityConstraintViolationException")) {
                        throw new UnknownPersistenceException(ex.getMessage());
                    } else {
                        throw new UnknownPersistenceException(ex.getMessage());
                    }
                } else {
                    throw new UnknownPersistenceException(ex.getMessage());
                }
            } 
        } else {
            throw new InputDataValidationException(prepareInputDataValidationErrorsMessage(constraintViolations));
        }
    }
    
    @Override
    public Long createNewSellerComment(Comment comment, Long postId, Long sellerId) throws UnknownPersistenceException, InputDataValidationException, PostNotFoundException, SellerNotFoundException {
        Set<ConstraintViolation<Comment>> constraintViolations = validator.validate(comment);

        if (constraintViolations.isEmpty()) {
            try {
                Post post = postSessionBeanLocal.retrievePostById(postId);
                Seller seller = sellerSessionBeanLocal.retrieveSellerBySellerId(sellerId);
                comment.setPost(post);
                comment.setSeller(seller);
                comment.setIsBuyer(false);
                post.getComments().add(comment);
                seller.getComments().add(comment);
                em.persist(comment);
                em.flush();
                return comment.getCommentId();
            } catch (PersistenceException ex) {
                if (ex.getCause() != null && ex.getCause().getClass().getName().equals("org.eclipse.persistence.exceptions.DatabaseException")) {
                    if (ex.getCause().getCause() != null && ex.getCause().getCause().getClass().getName().equals("java.sql.SQLIntegrityConstraintViolationException")) {
                        throw new UnknownPersistenceException(ex.getMessage());
                    } else {
                        throw new UnknownPersistenceException(ex.getMessage());
                    }
                } else {
                    throw new UnknownPersistenceException(ex.getMessage());
                }
            }
        } else {
            throw new InputDataValidationException(prepareInputDataValidationErrorsMessage(constraintViolations));
        }
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
            Post post = postSessionBeanLocal.retrievePostById(postId);
            
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
            commentToEdit.setIsBuyer(comment.isIsBuyer());
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
    
    @Override
    public Buyer getBuyerFromComment(Long commentId) throws CommentNotFoundException {
        try {
            Comment comment = retrieveCommentById(commentId);
            
            return comment.getBuyer();
        } catch (CommentNotFoundException ex) {
            throw new CommentNotFoundException(ex.getMessage());
        }
    }
    
    @Override
    public Seller getSellerFromComment(Long commentId) throws CommentNotFoundException {
        try {
            Comment comment = retrieveCommentById(commentId);
            
            return comment.getSeller();
        } catch (CommentNotFoundException ex) {
            throw new CommentNotFoundException(ex.getMessage());
        }
    }

    private String prepareInputDataValidationErrorsMessage(Set<ConstraintViolation<Comment>> constraintViolations) {
        String msg = "Input data validation error!:";

        for (ConstraintViolation constraintViolation : constraintViolations) {
            msg += "\n\t" + constraintViolation.getPropertyPath() + " - " + constraintViolation.getInvalidValue() + "; " + constraintViolation.getMessage();
        }

        return msg;
    }
}
