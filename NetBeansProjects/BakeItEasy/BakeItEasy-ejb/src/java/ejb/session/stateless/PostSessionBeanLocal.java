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
public interface PostSessionBeanLocal {

    public Long createNewBuyerPost(Post post, Long buyerId) throws UnknownPersistenceException, InputDataValidationException, BuyerNotFoundException;

    public Post retrievePostById(Long postId) throws PostNotFoundException;

    public List<Post> searchPostsByTitle(String title);

    public void editPost(Post post) throws PostNotFoundException;

    public void deletePost(Long postId) throws PostNotFoundException;

    public Long createNewSellerPost(Post post, Long sellerId) throws UnknownPersistenceException, InputDataValidationException, SellerNotFoundException;

    public List<Post> retrieveAllPosts();

    public List<Comment> getCommentsByPostId(Long postId) throws PostNotFoundException;

    public Buyer getBuyerFromPost(Long postId) throws PostNotFoundException;

    public Seller getSellerFromPost(Long postId) throws PostNotFoundException;

 
}
