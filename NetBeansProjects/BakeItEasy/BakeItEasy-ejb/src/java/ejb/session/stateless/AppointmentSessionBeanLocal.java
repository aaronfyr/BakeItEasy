/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Appointment;
import error.exception.AppointmentNotFoundException;
import error.exception.CalendarNotFoundException;
import error.exception.InputDataValidationException;
import error.exception.UnknownPersistenceException;
import javax.ejb.Local;

/**
 *
 * @author aaronf
 */
@Local
public interface AppointmentSessionBeanLocal {

    public Long createNewAppointment(Appointment newAppointment, Long sellerId, Long buyerId, Long orderId) throws UnknownPersistenceException, InputDataValidationException, CalendarNotFoundException;

    public void updateAppointment(Appointment updatedAppointment) throws AppointmentNotFoundException, InputDataValidationException;

    public Appointment retrieveAppointmentByAppointmentId(Long appointmentId) throws AppointmentNotFoundException;
    
}
