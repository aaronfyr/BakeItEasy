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
public class BuyerIsNotFollowingSellerException extends Exception {

    /**
     * Creates a new instance of <code>BuyerIsNotFollowingSellerException</code>
     * without detail message.
     */
    public BuyerIsNotFollowingSellerException() {
    }

    /**
     * Constructs an instance of <code>BuyerIsNotFollowingSellerException</code>
     * with the specified detail message.
     *
     * @param msg the detail message.
     */
    public BuyerIsNotFollowingSellerException(String msg) {
        super(msg);
    }
}
