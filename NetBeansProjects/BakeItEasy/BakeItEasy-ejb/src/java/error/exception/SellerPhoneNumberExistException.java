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
public class SellerPhoneNumberExistException extends Exception {

    /**
     * Creates a new instance of <code>SellerPhoneNumberExistException</code>
     * without detail message.
     */
    public SellerPhoneNumberExistException() {
    }

    /**
     * Constructs an instance of <code>SellerPhoneNumberExistException</code>
     * with the specified detail message.
     *
     * @param msg the detail message.
     */
    public SellerPhoneNumberExistException(String msg) {
        super(msg);
    }
}
