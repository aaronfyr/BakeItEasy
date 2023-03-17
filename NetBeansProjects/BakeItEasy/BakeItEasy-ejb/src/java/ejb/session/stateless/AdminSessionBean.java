/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Admin;
import entity.Report;
import error.AdminNotFoundException;
import error.AdminUsernameExistsException;
import error.InvalidLoginCredentialException;
import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceException;
import javax.persistence.Query;

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
    public Long createNewAdmin(Admin admin) throws AdminUsernameExistsException {
        try {
            em.persist(admin);
            em.flush();
            return admin.getAdminId();
        } catch (PersistenceException ex) {
            throw new AdminUsernameExistsException(ex.getMessage());
        }
      
    }
    
    @Override
    public Admin login(String userName, String password) throws InvalidLoginCredentialException {
        try {
            Query query = em.createQuery("SELECT a FROM Admin a WHERE a.userName = :inUserName");
            query.setParameter("inUserName", userName);
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
    
    // remove admin from report
    @Override
    public void removeAdminFromReport(Long reportId) throws AdminNotFoundException {
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
    
    
    
}
