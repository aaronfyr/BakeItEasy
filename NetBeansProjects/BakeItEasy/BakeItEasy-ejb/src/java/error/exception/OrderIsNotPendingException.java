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
public class OrderIsNotPendingException extends Exception {

    /**
     * Creates a new instance of <code>OrderIsNotPendingException</code> without
     * detail message.
     */
    public OrderIsNotPendingException() {
    }

    /**
     * Constructs an instance of <code>OrderIsNotPendingException</code> with
     * the specified detail message.
     *
     * @param msg the detail message.
     */
    public OrderIsNotPendingException(String msg) {
        super(msg);
    }
}
