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
public class ListingNotFoundException extends Exception {

    /**
     * Creates a new instance of <code>ListingNotFoundException</code> without
     * detail message.
     */
    public ListingNotFoundException() {
    }

    /**
     * Constructs an instance of <code>ListingNotFoundException</code> with the
     * specified detail message.
     *
     * @param msg the detail message.
     */
    public ListingNotFoundException(String msg) {
        super(msg);
    }
}
