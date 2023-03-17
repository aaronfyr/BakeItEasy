/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Report;
import error.ReportNotFoundException;
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
    
}
