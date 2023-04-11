/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Buyer;
import entity.Comment;
import entity.Listing;
import entity.Order;
import entity.Post;
import entity.Seller;
import error.exception.BuyerNotFoundException;
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
import javax.persistence.Query;
import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

/**
 *
 * @author Nelson Choo
 */
@Stateless
public class PostSessionBean implements PostSessionBeanLocal {
    
    @EJB
    private BuyerSessionBeanLocal buyerSessionBeanLocal;
    
    @EJB
    private SellerSessionBeanLocal sellerSessionBeanLocal;
    
    @PersistenceContext(unitName = "BakeItEasy-ejbPU")
    private EntityManager em;
    
    private final ValidatorFactory validatorFactory;
    private final Validator validator;

    public PostSessionBean() {
        this.validatorFactory = Validation.buildDefaultValidatorFactory();
        this.validator = validatorFactory.getValidator();
    }
    
    @Override
    public Long createNewBuyerPost(Post post, Long buyerId) throws UnknownPersistenceException, InputDataValidationException, BuyerNotFoundException {       
        Set<ConstraintViolation<Post>> constraintViolations = validator.validate(post);

        if (constraintViolations.isEmpty()) {
            try {
                Buyer buyer = buyerSessionBeanLocal.retrieveBuyerById(buyerId);
                post.setBuyer(buyer);
                post.setIsBuyer(true);
                buyer.getPosts().add(post);
                em.persist(post);
                em.flush();
                return post.getPostId();
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
            } catch (BuyerNotFoundException ex) {
                throw new BuyerNotFoundException(ex.getMessage());
            }
        } else {
            throw new InputDataValidationException(prepareInputDataValidationErrorsMessage(constraintViolations));
        }
    }
    
    @Override
    public Long createNewSellerPost(Post post, Long sellerId) throws UnknownPersistenceException, InputDataValidationException, SellerNotFoundException {       
        Set<ConstraintViolation<Post>> constraintViolations = validator.validate(post);

        if (constraintViolations.isEmpty()) {
            try {
                Seller seller = sellerSessionBeanLocal.retrieveSellerBySellerId(sellerId);
                post.setSeller(seller);
                post.setIsBuyer(false);
                seller.getPosts().add(post);
                em.persist(post);
                em.flush();
                return post.getPostId();
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
            } catch (SellerNotFoundException ex) {
                throw new SellerNotFoundException(ex.getMessage());
            }
        } else {
            throw new InputDataValidationException(prepareInputDataValidationErrorsMessage(constraintViolations));
        }
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
            postToUpdate.setIsBuyer(post.isIsBuyer());
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
    
    @Override
    public List<Post> retrieveAllPosts() {
        Query query = em.createQuery("SELECT p FROM Post p");

        return query.getResultList();
    }
    
    @Override
    public List<Comment> getCommentsByPostId(Long postId) throws PostNotFoundException {
        try {
            Post post = retrievePostById(postId);
            Query query = em.createQuery("SELECT c FROM Comment c WHERE c.post.postId = :inPostId ORDER BY c.dateCreated ASC");
            query.setParameter("inPostId", postId);
            return query.getResultList();
        } catch (PostNotFoundException ex) {
            throw new PostNotFoundException(ex.getMessage());
        }
    }
    
    @Override
    public Buyer getBuyerFromPost(Long postId) throws PostNotFoundException {
        try {
            Post post = retrievePostById(postId);
            
            return post.getBuyer();
        } catch (PostNotFoundException ex) {
            throw new PostNotFoundException(ex.getMessage());
        }
    }
    
    @Override
    public Seller getSellerFromPost(Long postId) throws PostNotFoundException {
        try {
            Post post = retrievePostById(postId);
            
            return post.getSeller();
        } catch (PostNotFoundException ex) {
            throw new PostNotFoundException(ex.getMessage());
        }
    }
    
    private String prepareInputDataValidationErrorsMessage(Set<ConstraintViolation<Post>> constraintViolations) {
        String msg = "Input data validation error!:";

        for (ConstraintViolation constraintViolation : constraintViolations) {
            msg += "\n\t" + constraintViolation.getPropertyPath() + " - " + constraintViolation.getInvalidValue() + "; " + constraintViolation.getMessage();
        }

        return msg;
    }
}
