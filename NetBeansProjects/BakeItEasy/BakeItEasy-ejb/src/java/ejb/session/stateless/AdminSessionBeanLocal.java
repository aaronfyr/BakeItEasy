/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Admin;
import error.AdminNotFoundException;
import error.AdminUsernameExistsException;
import error.InvalidLoginCredentialException;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author elysia
 */
@Local
public interface AdminSessionBeanLocal {

    public Admin retrieveAdminById(Long adminId) throws AdminNotFoundException;

    public Long createNewAdmin(Admin admin) throws AdminUsernameExistsException;

    public Admin login(String userName, String password) throws InvalidLoginCredentialException;

    public List<Admin> retrieveAllAdmins();

    public void removeAdminFromReport(Long reportId) throws AdminNotFoundException;

    public void removeAdmin(Long adminId) throws AdminNotFoundException;
    
}
