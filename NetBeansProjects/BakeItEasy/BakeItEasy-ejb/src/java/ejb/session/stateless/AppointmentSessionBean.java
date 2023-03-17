/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Appointment;
import entity.Calendar;
import error.exception.AppointmentNotFoundException;
import error.exception.CalendarNotFoundException;
import error.exception.InputDataValidationException;
import error.exception.UnknownPersistenceException;
import java.util.Set;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceException;
import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

/**
 *
 * @author aaronf
 */
@Stateless
public class AppointmentSessionBean implements AppointmentSessionBeanLocal {

    @EJB(name = "CalendarSessionBeanLocal")
    private CalendarSessionBeanLocal calendarSessionBeanLocal;
    
    // INJECT BUYER AND ORDER EJB
    
    @PersistenceContext(unitName = "BakeItEasy-ejbPU")
    private EntityManager em;

    // Add business logic below. (Right-click in editor and choose
    // "Insert Code > Add Business Method")
    
    private final ValidatorFactory validatorFactory;
    private final Validator validator;

    public AppointmentSessionBean() {
        this.validatorFactory = Validation.buildDefaultValidatorFactory();
        this.validator = validatorFactory.getValidator();
    }
    
    @Override
    public Long createNewAppointment(Appointment newAppointment, Long sellerId, Long buyerId, Long orderId) throws UnknownPersistenceException, InputDataValidationException, CalendarNotFoundException {
        Set<ConstraintViolation<Appointment>> constraintViolations = validator.validate(newAppointment);
        
        if (constraintViolations.isEmpty()) {
            try {
                Calendar calendar = calendarSessionBeanLocal.retrieveCalendarBySellerId(sellerId);
                // Buyer buyer = buyerSessionBeanLocal.retrieveBuyerByBuyerId(buyerId);
                // Order order = orderSessionBeanLocal.retrieveOrderByOrderId(orderId);
                newAppointment.setCalendar(calendar);
                calendar.getAppointments().add(newAppointment);
                calendarSessionBeanLocal.updateCalendar(calendar);
//                newAppointment.setBuyer(buyer);
//                newAppointment.setOrder(order);
                em.persist(newAppointment);
                em.flush();
                return newAppointment.getAppointmentId();
            } catch (PersistenceException ex) {
                if (ex.getCause() != null && ex.getCause().getClass().getName().equals("org.eclipse.persistence.exceptions.DatabaseException")) {
                    if (ex.getCause().getCause() != null && ex.getCause().getCause().getClass().getName().equals("java.sql.SQLIntegrityConstraintViolationException")) {
                        throw new UnknownPersistenceException(ex.getMessage());
                    } else {
                        throw new UnknownPersistenceException(ex.getMessage());
                    }
                } else {
                    throw new UnknownPersistenceException(ex.getMessage());
                }
            }
        } else {
            throw new InputDataValidationException(prepareInputDataValidationErrorsMessage(constraintViolations));
        }
    }
    
    @Override
    public void updateAppointment(Appointment updatedAppointment) throws AppointmentNotFoundException, InputDataValidationException {
        Set<ConstraintViolation<Appointment>> constraintViolations = validator.validate(updatedAppointment);

        if (constraintViolations.isEmpty()) {
            Appointment appointmentToUpdate = retrieveAppointmentByAppointmentId(updatedAppointment.getAppointmentId());
            appointmentToUpdate.setTitle(updatedAppointment.getTitle());
            appointmentToUpdate.setDescription(updatedAppointment.getDescription());
            appointmentToUpdate.setDate(updatedAppointment.getDate());
        } else {
            throw new InputDataValidationException(prepareInputDataValidationErrorsMessage(constraintViolations));
        }
    }
    
    @Override
    public Appointment retrieveAppointmentByAppointmentId(Long appointmentId) throws AppointmentNotFoundException {
        Appointment appointment = em.find(Appointment.class, appointmentId);

        if (appointment != null) {
            return appointment;
        } else {
            throw new AppointmentNotFoundException("Appointment ID: " + appointmentId + " does not exist!");
        }
    }
    
    // Should be no need for delete appointment, since deleting order is the more important one
    
    private String prepareInputDataValidationErrorsMessage(Set<ConstraintViolation<Appointment>> constraintViolations) {
        String msg = "Input data validation error!:";

        for (ConstraintViolation constraintViolation : constraintViolations) {
            msg += "\n\t" + constraintViolation.getPropertyPath() + " - " + constraintViolation.getInvalidValue() + "; " + constraintViolation.getMessage();
        }

        return msg;
    }

}
