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
public class CalendarNotFoundException extends Exception {

    /**
     * Creates a new instance of <code>CalendarNotFoundException</code> without
     * detail message.
     */
    public CalendarNotFoundException() {
    }

    /**
     * Constructs an instance of <code>CalendarNotFoundException</code> with the
     * specified detail message.
     *
     * @param msg the detail message.
     */
    public CalendarNotFoundException(String msg) {
        super(msg);
    }
}
