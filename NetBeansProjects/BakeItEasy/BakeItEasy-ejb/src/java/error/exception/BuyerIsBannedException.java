/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package error.exception;

/**
 *
 * @author Nelson Choo
 */
public class BuyerIsBannedException extends Exception {

    /**
     * Creates a new instance of <code>BuyerIsBannedException</code> without
     * detail message.
     */
    public BuyerIsBannedException() {
    }

    /**
     * Constructs an instance of <code>BuyerIsBannedException</code> with the
     * specified detail message.
     *
     * @param msg the detail message.
     */
    public BuyerIsBannedException(String msg) {
        super(msg);
    }
}
