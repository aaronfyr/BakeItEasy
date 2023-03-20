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
public class SellerUsernameExistException extends Exception {

    /**
     * Creates a new instance of <code>SellerUsernameExistException</code>
     * without detail message.
     */
    public SellerUsernameExistException() {
    }

    /**
     * Constructs an instance of <code>SellerUsernameExistException</code> with
     * the specified detail message.
     *
     * @param msg the detail message.
     */
    public SellerUsernameExistException(String msg) {
        super(msg);
    }
}
