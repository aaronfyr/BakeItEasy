/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Admin;
import entity.Buyer;
import entity.Listing;
import entity.Post;
import entity.Report;
import entity.Seller;
import error.exception.AdminNotFoundException;
import error.exception.BuyerNotFoundException;
import error.exception.InputDataValidationException;
import error.exception.ReportNotFoundException;
import error.exception.SellerNotFoundException;
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
public class ReportSessionBean implements ReportSessionBeanLocal {

    @PersistenceContext(unitName = "BakeItEasy-ejbPU")
    private EntityManager em;
    
    @EJB
    private BuyerSessionBeanLocal buyerSessionBeanLocal;
    
    @EJB
    private SellerSessionBeanLocal sellerSessionBeanLocal;
    
    @EJB
    private AdminSessionBeanLocal adminSessionBeanLocal;
    
    @EJB
    private ReportSessionBeanLocal reportSessionBeanLocal;
    
    private final ValidatorFactory validatorFactory;
    private final Validator validator;

    public ReportSessionBean() {
        this.validatorFactory = Validation.buildDefaultValidatorFactory();
        this.validator = validatorFactory.getValidator();
    }
    
    @Override
    public Report retrieveReportById(Long reportId) throws ReportNotFoundException {
        Report report = em.find(Report.class, reportId);

        if (report != null) {
            return report;
        } else {
            throw new ReportNotFoundException("Report does not exist: " + reportId);
        }
    }
    
    @Override
    public Long createNewReport(Report report, Long reporterId, Long reporteeId) throws BuyerNotFoundException, SellerNotFoundException, UnknownPersistenceException, InputDataValidationException {   
        Set<ConstraintViolation<Report>> constraintViolations = validator.validate(report);

        if (constraintViolations.isEmpty()) {
            try {
                em.persist(report);
                Buyer reporter = buyerSessionBeanLocal.retrieveBuyerById(reporterId);
                Seller reportee = sellerSessionBeanLocal.retrieveSellerBySellerId(reporteeId);
                report.setReporter(reporter);
                report.setReportee(reportee);
                reporter.getReports().add(report);
                reportee.getReports().add(report);
                em.flush();
                return report.getReportId();
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
    public Long assignAdmin(Report report, Long adminId) throws AdminNotFoundException {
        Admin admin = adminSessionBeanLocal.retrieveAdminById(adminId);
        report.setAdmin(admin);
        admin.getReports().add(report);
        em.merge(report);
        return report.getReportId();
    }
    
    @Override
    public List<Report> retrieveAllReports() {
        Query query = em.createQuery("SELECT r FROM Report r");
        return query.getResultList();
    }
    
    @Override
    public void updateReport(Report r) throws NoResultException, ReportNotFoundException {
        Report oldR = retrieveReportById(r.getReportId());
        
        System.out.println(r.getReporter());

        oldR.setTitle(r.getTitle());
        oldR.setReason(r.getReason());
        oldR.setReporter(r.getReporter());
        oldR.setReportee(r.getReportee());
        oldR.setAdmin(r.getAdmin());
    } //end updateReport
    
    // remove report from db
    @Override
    public void removeReport(Long reportId) throws ReportNotFoundException {
        Report report = reportSessionBeanLocal.retrieveReportById(reportId);
        Buyer reporter = report.getReporter();
        Seller reportee = report.getReportee();
        Admin admin = report.getAdmin();
//        report.setReporter(null);
//        report.setReportee(null);
//        report.setAdmin(null);
        reporter.getReports().remove(report);
        reportee.getReports().remove(report);
        admin.getReports().remove(report);
        em.remove(report);
    }
    
    private String prepareInputDataValidationErrorsMessage(Set<ConstraintViolation<Report>> constraintViolations) {
        String msg = "Input data validation error!:";

        for (ConstraintViolation constraintViolation : constraintViolations) {
            msg += "\n\t" + constraintViolation.getPropertyPath() + " - " + constraintViolation.getInvalidValue() + "; " + constraintViolation.getMessage();
        }

        return msg;
    }
    
}
