/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Seller;
import error.exception.InputDataValidationException;
import error.exception.InvalidLoginCredentialException;
import error.exception.SellerEmailExistException;
import error.exception.SellerNotFoundException;
import error.exception.SellerPhoneNumberExistException;
import error.exception.SellerUsernameExistException;
import error.exception.UnknownPersistenceException;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author aaronf
 */
@Local
public interface SellerSessionBeanLocal {

    public Long createNewSeller(Seller newSeller) throws UnknownPersistenceException, InputDataValidationException, SellerUsernameExistException, SellerEmailExistException, SellerPhoneNumberExistException;

    public Seller sellerLogin(String username, String password) throws InvalidLoginCredentialException, SellerNotFoundException;

    public Seller retrieveSellerBySellerId(Long sellerId) throws SellerNotFoundException;

    public Seller retrieveSellerByUsername(String username) throws SellerNotFoundException;

    public Seller retrieveSellerByEmail(String email) throws SellerNotFoundException;

    public Seller retrieveSellerByPhoneNumber(String phoneNo) throws SellerNotFoundException;

    public List<Seller> retrieveAllSellers();

    public void updateSeller(Seller updatedSeller) throws InputDataValidationException, SellerNotFoundException;
    
}
