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
public class AdminEmailExistException extends Exception {

    /**
     * Creates a new instance of <code>AdminEmailExistException</code> without
     * detail message.
     */
    public AdminEmailExistException() {
    }

    /**
     * Constructs an instance of <code>AdminEmailExistException</code> with the
     * specified detail message.
     *
     * @param msg the detail message.
     */
    public AdminEmailExistException(String msg) {
        super(msg);
    }
}
