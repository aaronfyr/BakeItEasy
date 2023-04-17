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
public class CurrentPasswordDoesNotMatchException extends Exception {

    /**
     * Creates a new instance of
     * <code>CurrentPasswordDoesNotMatchException</code> without detail message.
     */
    public CurrentPasswordDoesNotMatchException() {
    }

    /**
     * Constructs an instance of
     * <code>CurrentPasswordDoesNotMatchException</code> with the specified
     * detail message.
     *
     * @param msg the detail message.
     */
    public CurrentPasswordDoesNotMatchException(String msg) {
        super(msg);
    }
}
