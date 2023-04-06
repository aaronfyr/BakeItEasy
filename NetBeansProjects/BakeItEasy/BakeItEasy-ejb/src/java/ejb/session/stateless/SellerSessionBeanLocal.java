/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Buyer;
import entity.Seller;
import error.exception.InputDataValidationException;
import error.exception.InvalidLoginCredentialException;
import error.exception.OrderIsNotAcceptedException;
import error.exception.OrderIsNotPendingException;
import error.exception.OrderNotFoundException;
import error.exception.SellerEmailExistException;
import error.exception.SellerHasOutstandingOrdersException;
import error.exception.SellerIsBannedException;
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

    public void updateSeller(Seller updatedSeller) throws SellerNotFoundException, SellerPhoneNumberExistException, SellerUsernameExistException, InputDataValidationException;
    
    public void deleteSeller(Long sellerId) throws SellerNotFoundException, SellerHasOutstandingOrdersException;
    
    public Seller sellerLogin(String email, String password) throws SellerIsBannedException, InvalidLoginCredentialException, SellerNotFoundException;

    public Seller retrieveSellerBySellerId(Long sellerId) throws SellerNotFoundException;

    public Seller retrieveSellerByUsername(String username) throws SellerNotFoundException;

    public Seller retrieveSellerByEmail(String email) throws SellerNotFoundException;

    public Seller retrieveSellerByPhoneNumber(String phoneNo) throws SellerNotFoundException;

    public List<Seller> retrieveAllSellers();

    public void acceptOrder(Long orderId) throws OrderNotFoundException, OrderIsNotPendingException;

    public void rejectOrder(Long orderId) throws OrderNotFoundException, OrderIsNotPendingException;

    public void completeOrder(Long orderId) throws OrderNotFoundException, OrderIsNotAcceptedException;

    public List<Buyer> retrieveListOfFollowers(Long sellerId) throws SellerNotFoundException;
    
}
