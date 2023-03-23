/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Appointment;
import error.exception.AppointmentNotFoundException;
import error.exception.BuyerNotFoundException;
import error.exception.CalendarNotFoundException;
import error.exception.InputDataValidationException;
import error.exception.OrderNotFoundException;
import error.exception.SellerNotFoundException;
import error.exception.UnknownPersistenceException;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author aaronf
 */
@Local
public interface AppointmentSessionBeanLocal {

    public Long createNewAppointment(Appointment newAppointment, Long sellerId, Long buyerId, Long orderId) throws UnknownPersistenceException, InputDataValidationException, SellerNotFoundException, BuyerNotFoundException, OrderNotFoundException;

    public void updateAppointment(Appointment updatedAppointment) throws AppointmentNotFoundException, InputDataValidationException;

    public List<Appointment> retrieveAllAppointments();
    
    public Appointment retrieveAppointmentByAppointmentId(Long appointmentId) throws AppointmentNotFoundException;

    public Appointment retrieveAppointmentBySellerIdAndAppointmentId(Long sellerId, Long appointmentId);
    
    public List<Appointment> retrieveSellerAppointments(Long sellerId);
    
}
