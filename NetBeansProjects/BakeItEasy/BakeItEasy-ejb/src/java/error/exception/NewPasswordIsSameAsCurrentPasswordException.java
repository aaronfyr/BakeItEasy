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
public class NewPasswordIsSameAsCurrentPasswordException extends Exception {

    /**
     * Creates a new instance of
     * <code>NewPasswordIsSameAsCurrentPasswordException</code> without detail
     * message.
     */
    public NewPasswordIsSameAsCurrentPasswordException() {
    }

    /**
     * Constructs an instance of
     * <code>NewPasswordIsSameAsCurrentPasswordException</code> with the
     * specified detail message.
     *
     * @param msg the detail message.
     */
    public NewPasswordIsSameAsCurrentPasswordException(String msg) {
        super(msg);
    }
}
