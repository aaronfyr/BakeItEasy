/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package error.exception;

/**
 *
 * @author elysia
 */
public class OrderIsNotCompletedException extends Exception {

    /**
     * Creates a new instance of <code>OrderIsNotCompletedException</code>
     * without detail message.
     */
    public OrderIsNotCompletedException() {
    }

    /**
     * Constructs an instance of <code>OrderIsNotCompletedException</code> with
     * the specified detail message.
     *
     * @param msg the detail message.
     */
    public OrderIsNotCompletedException(String msg) {
        super(msg);
    }
}
