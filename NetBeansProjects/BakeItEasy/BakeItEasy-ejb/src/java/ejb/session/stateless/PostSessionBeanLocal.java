/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Post;
import error.exception.InputDataValidationException;
import error.exception.PostNotFoundException;
import error.exception.UnknownPersistenceException;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author Nelson Choo
 */
@Local
public interface PostSessionBeanLocal {

    public Long createNewPost(Post post) throws UnknownPersistenceException, InputDataValidationException;

    public Post retrievePostById(Long postId) throws PostNotFoundException;

    public List<Post> searchPostsByTitle(String title);

    public void editPost(Post post) throws PostNotFoundException;

    public void deletePost(Long postId) throws PostNotFoundException;
    
}
