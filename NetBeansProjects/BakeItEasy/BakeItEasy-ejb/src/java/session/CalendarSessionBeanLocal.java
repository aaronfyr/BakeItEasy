/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Calendar;
import error.exception.CalendarNotFoundException;
import error.exception.InputDataValidationException;
import error.exception.SellerNotFoundException;
import error.exception.UnknownPersistenceException;
import javax.ejb.Local;

/**
 *
 * @author aaronf
 */
@Local
public interface CalendarSessionBeanLocal {

    public Long createNewCalendar(Calendar newCalendar, Long sellerId) throws UnknownPersistenceException, InputDataValidationException, SellerNotFoundException;

    public void updateCalendar(Calendar updatedCalendar) throws CalendarNotFoundException, InputDataValidationException;

    public void deleteCalendar(Long calendarId) throws CalendarNotFoundException;

    public Calendar retrieveCalendarByCalendarId(Long calendarId) throws CalendarNotFoundException;

    public Calendar retrieveCalendarBySellerId(Long sellerId) throws CalendarNotFoundException;
    
}
