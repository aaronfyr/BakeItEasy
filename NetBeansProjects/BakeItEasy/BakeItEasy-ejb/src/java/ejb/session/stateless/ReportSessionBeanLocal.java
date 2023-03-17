/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Report;
import error.exception.AdminNotFoundException;
import error.exception.BuyerNotFoundException;
import error.exception.InputDataValidationException;
import error.exception.ReportNotFoundException;
import error.exception.SellerNotFoundException;
import error.exception.UnknownPersistenceException;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author elysia
 */
@Local
public interface ReportSessionBeanLocal {

    public Report retrieveReportById(Long reportId) throws ReportNotFoundException;

    public void removeReport(Long reportId) throws ReportNotFoundException;

    public List<Report> retrieveAllReports();

    public Long createNewReport(Report report, Long reporterId, Long reporteeId, Long adminId) throws BuyerNotFoundException, SellerNotFoundException, AdminNotFoundException, UnknownPersistenceException, InputDataValidationException;
}
