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
public class BuyerHasReportedSellerException extends Exception {

    /**
     * Creates a new instance of <code>BuyerHasReportedSellerException</code>
     * without detail message.
     */
    public BuyerHasReportedSellerException() {
    }

    /**
     * Constructs an instance of <code>BuyerHasReportedSellerException</code>
     * with the specified detail message.
     *
     * @param msg the detail message.
     */
    public BuyerHasReportedSellerException(String msg) {
        super(msg);
    }
}
