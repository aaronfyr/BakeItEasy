/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Post;
import error.PostNotFoundException;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author Nelson Choo
 */
@Local
public interface PostSessionBeanLocal {

    public Long createNewPost(Post post);

    public Post retrievePostById(Long postId) throws PostNotFoundException;

    public List<Post> searchPostsByTitle(String title);

    public void editPost(Post post) throws PostNotFoundException;

    public void deletePost(Long postId) throws PostNotFoundException;
    
}
