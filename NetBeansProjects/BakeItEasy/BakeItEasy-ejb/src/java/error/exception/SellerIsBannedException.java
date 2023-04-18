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
public class SellerIsBannedException extends Exception {

    /**
     * Creates a new instance of <code>SellerIsBannedException</code> without
     * detail message.
     */
    public SellerIsBannedException() {
    }

    /**
     * Constructs an instance of <code>SellerIsBannedException</code> with the
     * specified detail message.
     *
     * @param msg the detail message.
     */
    public SellerIsBannedException(String msg) {
        super(msg);
    }
}
