/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Admin;
import entity.Buyer;
import entity.Report;
import entity.Seller;
import error.AdminNotFoundException;
import error.ReportNotFoundException;
import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

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
    public Long createNewReport(Report report, Long reporterId, Long reporteeId, Long adminId) throws BuyerNotFoundException, SellerNotFoundException, AdminNotFoundException {
        try {
            em.persist(report);
            Buyer reporter = buyerSessionBeanLocal.retrieveBuyerById(reporterId);
            Seller reportee = sellerSessionBeanLocal.retrieveSellerById(reporteeId);
            Admin admin = adminSessionBeanLocal.retrieveAdminById(adminId);
            reporter.getReports().add(report);
            reportee.getReports().add(report);
            admin.getReports().add(report);
            em.flush();
            return report.getReportId();
        } catch (BuyerNotFoundException ex) {
            throw new BuyerNotFoundException(ex.getMessage());
        } catch (SellerNotFoundException ex) {
            throw new SellerNotFoundException(ex.getMessage());
        } catch (AdminNotFoundException ex) {
            throw new AdminNotFoundException(ex.getMessage());
        }
    }
    
    @Override
    public List<Report> retrieveAllReports() {
        Query query = em.createQuery("SELECT r FROM Report r");
        return query.getResultList();
    }
    
    // remove report from db
    @Override
    public void removeReport(Long reportId) throws ReportNotFoundException {
        Report report = reportSessionBeanLocal.retrieveReportById(reportId);
        Buyer reporter = report.getReporter();
        Seller reportee = report.getReportee();
        Admin admin = report.getAdmin();
        report.setReporter(null);
        report.setReportee(null);
        report.setAdmin(null);
        reporter.getReports().remove(report);
        reportee.getReports().remove(report);
        admin.getReports().remove(report);
        em.remove(report);
    }
    
}
