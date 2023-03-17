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
public class AdminUsernameExistsException extends Exception {

    /**
     * Creates a new instance of <code>AdminUsernameExistsException</code>
     * without detail message.
     */
    public AdminUsernameExistsException() {
    }

    /**
     * Constructs an instance of <code>AdminUsernameExistsException</code> with
     * the specified detail message.
     *
     * @param msg the detail message.
     */
    public AdminUsernameExistsException(String msg) {
        super(msg);
    }
}
