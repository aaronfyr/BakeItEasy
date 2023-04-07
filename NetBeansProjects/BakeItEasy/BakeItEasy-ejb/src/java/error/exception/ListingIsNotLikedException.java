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
public class ListingIsNotLikedException extends Exception {

    /**
     * Creates a new instance of <code>ListingIsNotLikedException</code> without
     * detail message.
     */
    public ListingIsNotLikedException() {
    }

    /**
     * Constructs an instance of <code>ListingIsNotLikedException</code> with
     * the specified detail message.
     *
     * @param msg the detail message.
     */
    public ListingIsNotLikedException(String msg) {
        super(msg);
    }
}
