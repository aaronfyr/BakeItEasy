/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Buyer;
import error.exception.BuyerNotFoundException;
import error.exception.InputDataValidationException;
import error.exception.InvalidLoginCredentialException;
import error.exception.UnknownPersistenceException;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author Nelson Choo
 */
@Local
public interface BuyerSessionBeanLocal {

    public Long createNewBuyer(Buyer buyer) throws UnknownPersistenceException, InputDataValidationException;

    public Buyer retrieveBuyerById(Long buyerId) throws BuyerNotFoundException;

    public List<Buyer> searchBuyersByName(String name);

    public void editBuyer(Buyer buyer) throws BuyerNotFoundException;

    public void deleteBuyer(Long buyerId) throws BuyerNotFoundException;

    public Buyer buyerLogin(String username, String password) throws InvalidLoginCredentialException, BuyerNotFoundException;
    
}
