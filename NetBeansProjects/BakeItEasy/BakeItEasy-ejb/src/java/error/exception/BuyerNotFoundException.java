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
public class BuyerNotFoundException extends Exception {

    /**
     * Creates a new instance of <code>BuyerNotFoundException</code> without
     * detail message.
     */
    public BuyerNotFoundException() {
    }

    /**
     * Constructs an instance of <code>BuyerNotFoundException</code> with the
     * specified detail message.
     *
     * @param msg the detail message.
     */
    public BuyerNotFoundException(String msg) {
        super(msg);
    }
}
