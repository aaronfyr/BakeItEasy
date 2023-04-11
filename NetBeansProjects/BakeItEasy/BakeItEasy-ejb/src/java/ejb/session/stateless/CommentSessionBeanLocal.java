/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Buyer;
import entity.Comment;
import entity.Seller;
import error.exception.BuyerNotFoundException;
import error.exception.CommentNotFoundException;
import error.exception.InputDataValidationException;
import error.exception.PostNotFoundException;
import error.exception.SellerNotFoundException;
import error.exception.UnknownPersistenceException;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author Nelson Choo
 */
@Local
public interface CommentSessionBeanLocal {

    public Comment retrieveCommentById(Long commentId) throws CommentNotFoundException;

    public List<Comment> getCommentsFromPost(Long postId) throws PostNotFoundException;

    public void editComment(Comment comment) throws CommentNotFoundException;

    public void deleteComment(Long commentId) throws CommentNotFoundException;

    public Long createNewBuyerComment(Comment comment, Long postId, Long buyerId) throws UnknownPersistenceException, InputDataValidationException, BuyerNotFoundException, PostNotFoundException;

    public Long createNewSellerComment(Comment comment, Long postId, Long sellerId) throws UnknownPersistenceException, InputDataValidationException, PostNotFoundException, SellerNotFoundException;

    public Buyer getBuyerFromComment(Long commentId) throws CommentNotFoundException;

    public Seller getSellerFromComment(Long commentId) throws CommentNotFoundException;
    
}
