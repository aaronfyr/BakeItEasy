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
public class SellerEmailExistException extends Exception {

    /**
     * Creates a new instance of <code>SellerEmailExistException</code> without
     * detail message.
     */
    public SellerEmailExistException() {
    }

    /**
     * Constructs an instance of <code>SellerEmailExistException</code> with the
     * specified detail message.
     *
     * @param msg the detail message.
     */
    public SellerEmailExistException(String msg) {
        super(msg);
    }
}
