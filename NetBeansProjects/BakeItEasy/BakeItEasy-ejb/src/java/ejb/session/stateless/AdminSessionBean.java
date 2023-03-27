/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Admin;
import entity.Report;
import error.exception.AdminNotFoundException;
import error.exception.AdminUsernameExistsException;
import error.exception.InputDataValidationException;
import error.exception.InvalidLoginCredentialException;
import error.exception.ReportNotFoundException;
import error.exception.UnknownPersistenceException;
import java.util.List;
import java.util.Set;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceException;
import javax.persistence.Query;
import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

/**
 *
 * @author elysia
 */
@Stateless
public class AdminSessionBean implements AdminSessionBeanLocal {

    @PersistenceContext(unitName = "BakeItEasy-ejbPU")
    private EntityManager em;
    
    @EJB
    private ReportSessionBeanLocal reportSessionBeanLocal;

    @EJB
    private AdminSessionBeanLocal adminSessionBeanLocal;
    
    private final ValidatorFactory validatorFactory;
    private final Validator validator;

    public AdminSessionBean() {
        this.validatorFactory = Validation.buildDefaultValidatorFactory();
        this.validator = validatorFactory.getValidator();
    }
    
    @Override
    public Admin retrieveAdminById(Long adminId) throws AdminNotFoundException {
        Admin admin = em.find(Admin.class, adminId);

        if (admin != null) {
            return admin;
        } else {
            throw new AdminNotFoundException("Admin does not exist: " + adminId);
        }
    }
    
    @Override
    public Long createNewAdmin(Admin admin) throws AdminUsernameExistsException, UnknownPersistenceException, InputDataValidationException {
        Set<ConstraintViolation<Admin>> constraintViolations = validator.validate(admin);

        if (constraintViolations.isEmpty()) {
            try {
                em.persist(admin);
                em.flush();
                return admin.getAdminId();
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
    public Admin login(String email, String password) throws InvalidLoginCredentialException {
        try {
            Query query = em.createQuery("SELECT a FROM Admin a WHERE a.email = :inEmail");
            query.setParameter("inEmail", email);
            Admin admin = (Admin) query.getSingleResult();

            if (admin.getPassword().equals(password)) {
                return admin;
            } else {
                throw new InvalidLoginCredentialException("Invalid login credential");
            }
        } catch (NoResultException ex) {
            throw new InvalidLoginCredentialException("Invalid login credential");
        }
    }
    
    @Override
    public List<Admin> retrieveAllAdmins() {
        Query query = em.createQuery("SELECT a FROM Admin a");
        return query.getResultList();
    }
    
    @Override
    public void updateAdmin(Admin a) throws NoResultException, AdminNotFoundException {
        Admin oldA = retrieveAdminById(a.getAdminId());

        oldA.setName(a.getName());
        oldA.setUsername(a.getUsername());
        oldA.setEmail(a.getEmail());
        oldA.setPassword(a.getPassword());
        oldA.setReports(a.getReports());
    }
    
    // remove admin from report
    @Override
    public void removeAdminFromReport(Long reportId) throws ReportNotFoundException {
        Report report = reportSessionBeanLocal.retrieveReportById(reportId);
        Admin admin = report.getAdmin();
        report.setAdmin(null);
        admin.getReports().remove(report);
    }
    
    // delete admin (remove from db)
    @Override
    public void removeAdmin(Long adminId) throws AdminNotFoundException {
        Admin admin = adminSessionBeanLocal.retrieveAdminById(adminId);
        for (Report report : admin.getReports()) {
            report.setAdmin(null);
        }
        admin.getReports().clear();
        em.remove(admin);
    }
    
    private String prepareInputDataValidationErrorsMessage(Set<ConstraintViolation<Admin>> constraintViolations) {
        String msg = "Input data validation error!:";

        for (ConstraintViolation constraintViolation : constraintViolations) {
            msg += "\n\t" + constraintViolation.getPropertyPath() + " - " + constraintViolation.getInvalidValue() + "; " + constraintViolation.getMessage();
        }

        return msg;
    }

    
}
