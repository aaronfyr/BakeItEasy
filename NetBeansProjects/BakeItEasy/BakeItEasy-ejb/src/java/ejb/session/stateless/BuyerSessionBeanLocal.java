/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Buyer;
import entity.Listing;
import entity.Seller;
import error.exception.BuyerEmailExistException;
import error.exception.BuyerIsBannedException;
import error.exception.BuyerIsFollowingSellerAlreadyException;
import error.exception.BuyerIsNotFollowingSellerException;
import error.exception.BuyerNotFoundException;
import error.exception.BuyerPhoneNumberExistException;
import error.exception.BuyerUsernameExistException;
import error.exception.CurrentPasswordDoesNotMatchException;
import error.exception.InputDataValidationException;
import error.exception.InvalidLoginCredentialException;
import error.exception.ListingNotFoundException;
import error.exception.NewAndConfirmPasswordsDoNotMatchException;
import error.exception.OrderIsNotPendingException;
import error.exception.OrderNotFoundException;
import error.exception.SellerNotFoundException;
import error.exception.UnknownPersistenceException;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author Nelson Choo
 */
@Local
public interface BuyerSessionBeanLocal {

    public Long createNewBuyer(Buyer buyer) throws UnknownPersistenceException, InputDataValidationException, BuyerPhoneNumberExistException, BuyerEmailExistException, BuyerUsernameExistException;

    public Buyer retrieveBuyerById(Long buyerId) throws BuyerNotFoundException;

    public List<Buyer> searchBuyersByName(String name);

    public void deleteBuyer(Long buyerId) throws BuyerNotFoundException;

    public Buyer buyerLogin(String email, String password) throws InvalidLoginCredentialException, BuyerNotFoundException, BuyerIsBannedException;

    public void cancelOrder(Long orderId) throws OrderNotFoundException, OrderIsNotPendingException;

    public void updateBuyer(Buyer updatedBuyer) throws BuyerNotFoundException, BuyerPhoneNumberExistException, BuyerUsernameExistException, InputDataValidationException;
    
    public List<Seller> retrieveListOfFollowing(Long buyerId) throws BuyerNotFoundException;
    
    public void followSeller(Long buyerId, Long listingId) throws ListingNotFoundException, BuyerNotFoundException, BuyerIsFollowingSellerAlreadyException;

    public void unfollowSeller(Long buyerId, Long listingId) throws ListingNotFoundException, BuyerNotFoundException, BuyerIsNotFollowingSellerException;

    public List<Listing> getLikedListings(Long buyerId) throws BuyerNotFoundException;
    
    public void followSellerThroughProfile(Long buyerId, Long sellerId) throws SellerNotFoundException, BuyerNotFoundException, BuyerIsFollowingSellerAlreadyException;

    public void unfollowSellerThroughProfile(Long buyerId, Long sellerId) throws SellerNotFoundException, BuyerNotFoundException, BuyerIsNotFollowingSellerException;

    public void updateBuyerPassword(Long buyerId, String currentPassword, String newPassword, String confirmPassword) throws BuyerNotFoundException, NewAndConfirmPasswordsDoNotMatchException, CurrentPasswordDoesNotMatchException, InputDataValidationException;

}
