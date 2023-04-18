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
public class SellerHasOutstandingOrdersException extends Exception {

    /**
     * Creates a new instance of
     * <code>SellerHasOutstandingOrdersException</code> without detail message.
     */
    public SellerHasOutstandingOrdersException() {
    }

    /**
     * Constructs an instance of
     * <code>SellerHasOutstandingOrdersException</code> with the specified
     * detail message.
     *
     * @param msg the detail message.
     */
    public SellerHasOutstandingOrdersException(String msg) {
        super(msg);
    }
}
