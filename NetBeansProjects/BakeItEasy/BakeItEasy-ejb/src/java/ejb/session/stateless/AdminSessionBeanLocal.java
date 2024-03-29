/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Admin;
import entity.Buyer;
import entity.Seller;
import error.exception.AdminEmailExistException;
import error.exception.AdminNotFoundException;
import error.exception.BuyerNotFoundException;
import error.exception.InputDataValidationException;
import error.exception.InvalidLoginCredentialException;
import error.exception.ReportNotFoundException;
import error.exception.SellerNotFoundException;
import error.exception.UnknownPersistenceException;
import java.util.List;
import javax.ejb.Local;
import javax.persistence.NoResultException;

/**
 *
 * @author elysia
 */
@Local
public interface AdminSessionBeanLocal {

    public Admin retrieveAdminById(Long adminId) throws AdminNotFoundException;

    public Long createNewAdmin(Admin admin) throws UnknownPersistenceException, InputDataValidationException;

    public Admin login(String email, String password) throws InvalidLoginCredentialException;

    public List<Admin> retrieveAllAdmins();

    public void removeAdmin(Long adminId) throws AdminNotFoundException;

    public void updateAdmin(Admin a) throws NoResultException, AdminNotFoundException, AdminEmailExistException;
    
    public Buyer banBuyer(Long buyerId) throws BuyerNotFoundException;

    public Seller banSeller(Long sellerId) throws SellerNotFoundException;

    public Buyer unbanBuyer(Long buyerId) throws BuyerNotFoundException;

    public Seller unbanSeller(Long sellerId) throws SellerNotFoundException;
    
    
    
}
