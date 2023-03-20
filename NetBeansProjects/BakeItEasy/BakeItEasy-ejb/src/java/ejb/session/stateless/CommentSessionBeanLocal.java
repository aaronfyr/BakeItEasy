/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Comment;
import error.exception.CommentNotFoundException;
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
public interface CommentSessionBeanLocal {

    public Comment retrieveCommentById(Long commentId) throws CommentNotFoundException;

    public List<Comment> getCommentsFromPost(Long postId) throws PostNotFoundException;

    public void editComment(Comment comment) throws CommentNotFoundException;

    public void deleteComment(Long commentId) throws CommentNotFoundException;

    public Long createNewComment(Comment comment, Long postId) throws UnknownPersistenceException, InputDataValidationException, PostNotFoundException;
    
}
