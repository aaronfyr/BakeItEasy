/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package error.exception;

/**
 *
 * @author aaronf
 */
public class ListingLikedAlreadyException extends Exception {

    /**
     * Creates a new instance of <code>ListingLikedAlreadyException</code>
     * without detail message.
     */
    public ListingLikedAlreadyException() {
    }

    /**
     * Constructs an instance of <code>ListingLikedAlreadyException</code> with
     * the specified detail message.
     *
     * @param msg the detail message.
     */
    public ListingLikedAlreadyException(String msg) {
        super(msg);
    }
}
