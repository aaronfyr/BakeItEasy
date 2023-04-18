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
public class BuyerIsFollowingSellerAlreadyException extends Exception {

    /**
     * Creates a new instance of
     * <code>BuyerIsFollowingSellerAlreadyException</code> without detail
     * message.
     */
    public BuyerIsFollowingSellerAlreadyException() {
    }

    /**
     * Constructs an instance of
     * <code>BuyerIsFollowingSellerAlreadyException</code> with the specified
     * detail message.
     *
     * @param msg the detail message.
     */
    public BuyerIsFollowingSellerAlreadyException(String msg) {
        super(msg);
    }
}
