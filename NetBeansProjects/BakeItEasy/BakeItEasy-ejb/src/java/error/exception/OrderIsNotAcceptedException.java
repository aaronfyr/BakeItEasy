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
public class OrderIsNotAcceptedException extends Exception {

    /**
     * Creates a new instance of <code>OrderIsNotAcceptedException</code>
     * without detail message.
     */
    public OrderIsNotAcceptedException() {
    }

    /**
     * Constructs an instance of <code>OrderIsNotAcceptedException</code> with
     * the specified detail message.
     *
     * @param msg the detail message.
     */
    public OrderIsNotAcceptedException(String msg) {
        super(msg);
    }
}
