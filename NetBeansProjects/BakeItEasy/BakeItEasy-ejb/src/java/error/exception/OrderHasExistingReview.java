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
public class OrderHasExistingReview extends Exception {

    /**
     * Creates a new instance of <code>OrderHasExistingReview</code> without
     * detail message.
     */
    public OrderHasExistingReview() {
    }

    /**
     * Constructs an instance of <code>OrderHasExistingReview</code> with the
     * specified detail message.
     *
     * @param msg the detail message.
     */
    public OrderHasExistingReview(String msg) {
        super(msg);
    }
}
