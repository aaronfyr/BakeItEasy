/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Calendar;
import entity.Seller;
import error.exception.CalendarNotFoundException;
import error.exception.InputDataValidationException;
import error.exception.SellerNotFoundException;
import error.exception.UnknownPersistenceException;
import java.util.Set;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceException;
import javax.persistence.Query;
import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

/**
 *
 * @author aaronf
 */
@Stateless
public class CalendarSessionBean implements CalendarSessionBeanLocal {

    @EJB(name = "SellerSessionBeanLocal")
    private SellerSessionBeanLocal sellerSessionBeanLocal;

    @PersistenceContext(unitName = "BakeItEasy-ejbPU")
    private EntityManager em;

    private final ValidatorFactory validatorFactory;
    private final Validator validator;

    public CalendarSessionBean() {
        this.validatorFactory = Validation.buildDefaultValidatorFactory();
        this.validator = validatorFactory.getValidator();
    }

    @Override
    public Long createNewCalendar(Calendar newCalendar, Long sellerId) throws UnknownPersistenceException, InputDataValidationException, SellerNotFoundException {
        Set<ConstraintViolation<Calendar>> constraintViolations = validator.validate(newCalendar);

        if (constraintViolations.isEmpty()) {
            try {
                Seller seller = sellerSessionBeanLocal.retrieveSellerBySellerId(sellerId);
                newCalendar.setSeller(seller);
                em.persist(newCalendar);
                em.flush();
                return newCalendar.getCalendarId();
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

    // No need to delete calendar as it is tied to a seller's account, either empty
    // or it does not exist (along with seller account)
    @Override
    public void updateCalendar(Calendar updatedCalendar) throws CalendarNotFoundException, InputDataValidationException {
        Set<ConstraintViolation<Calendar>> constraintViolations = validator.validate(updatedCalendar);

        if (constraintViolations.isEmpty()) {
            Calendar calendarToUpdate = retrieveCalendarByCalendarId(updatedCalendar.getCalendarId());
            calendarToUpdate.setName(updatedCalendar.getName());
            calendarToUpdate.setStartDate(updatedCalendar.getStartDate());
            calendarToUpdate.setEndDate(updatedCalendar.getEndDate());
        } else {
            throw new InputDataValidationException(prepareInputDataValidationErrorsMessage(constraintViolations));
        }
    }

    @Override
    public void deleteCalendar(Long calendarId) throws CalendarNotFoundException {
        Calendar calendarToDelete = retrieveCalendarByCalendarId(calendarId);
        em.remove(calendarToDelete);
    }

    @Override
    public Calendar retrieveCalendarByCalendarId(Long calendarId) throws CalendarNotFoundException {
        Calendar calendar = em.find(Calendar.class, calendarId);

        if (calendar != null) {
            return calendar;
        } else {
            throw new CalendarNotFoundException("Calendar does not exist!");
        }
    }

    @Override
    public Calendar retrieveCalendarBySellerId(Long sellerId) throws CalendarNotFoundException {
        Query query = em.createQuery("SELECT c FROM Calendar c WHERE c.seller.sellerId = :inSellerId");
        query.setParameter("inSellerId", sellerId);

        Calendar calendar = (Calendar) query.getSingleResult();
        
        if (calendar != null) {
            return calendar;
        } else {
            throw new CalendarNotFoundException("Calendar does not exist! (Seller Id)");
        }
    }

    private String prepareInputDataValidationErrorsMessage(Set<ConstraintViolation<Calendar>> constraintViolations) {
        String msg = "Input data validation error!:";

        for (ConstraintViolation constraintViolation : constraintViolations) {
            msg += "\n\t" + constraintViolation.getPropertyPath() + " - " + constraintViolation.getInvalidValue() + "; " + constraintViolation.getMessage();
        }

        return msg;
    }

}
