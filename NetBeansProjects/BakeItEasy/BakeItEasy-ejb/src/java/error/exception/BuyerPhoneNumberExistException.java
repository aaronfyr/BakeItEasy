/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package error.exception;

/**
 *
 * @author Nelson Choo
 */
public class BuyerPhoneNumberExistException extends Exception {

    /**
     * Creates a new instance of <code>BuyerPhoneNumberExistException</code>
     * without detail message.
     */
    public BuyerPhoneNumberExistException() {
    }

    /**
     * Constructs an instance of <code>BuyerPhoneNumberExistException</code>
     * with the specified detail message.
     *
     * @param msg the detail message.
     */
    public BuyerPhoneNumberExistException(String msg) {
        super(msg);
    }
}
