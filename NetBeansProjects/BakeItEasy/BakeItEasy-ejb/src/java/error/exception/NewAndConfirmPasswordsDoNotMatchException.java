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
public class NewAndConfirmPasswordsDoNotMatchException extends Exception {

    /**
     * Creates a new instance of
     * <code>NewAndConfirmPasswordsDoNotMatchException</code> without detail
     * message.
     */
    public NewAndConfirmPasswordsDoNotMatchException() {
    }

    /**
     * Constructs an instance of
     * <code>NewAndConfirmPasswordsDoNotMatchException</code> with the specified
     * detail message.
     *
     * @param msg the detail message.
     */
    public NewAndConfirmPasswordsDoNotMatchException(String msg) {
        super(msg);
    }
}
