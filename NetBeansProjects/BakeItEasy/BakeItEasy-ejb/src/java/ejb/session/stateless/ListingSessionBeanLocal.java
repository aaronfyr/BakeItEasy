/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Listing;
import entity.Order;
import entity.Seller;
import enumeration.ListingCategory;
import error.exception.BuyerNotFoundException;
import error.exception.InputDataValidationException;
import error.exception.ListingHasOngoingOrdersException;
import error.exception.ListingIsNotLikedException;
import error.exception.ListingLikedAlreadyException;
import error.exception.ListingNotFoundException;
import error.exception.OrderNotFoundException;
import error.exception.SellerNotFoundException;
import error.exception.UnknownPersistenceException;
import java.math.BigDecimal;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author aaronf
 */
@Local
public interface ListingSessionBeanLocal {

    public Long createNewListing(Listing newListing, Long sellerId) throws SellerNotFoundException, InputDataValidationException, UnknownPersistenceException;

    public void updateListing(Listing updatedListing) throws InputDataValidationException, ListingNotFoundException;

    public void deleteListing(Long listingId) throws ListingNotFoundException, ListingHasOngoingOrdersException, OrderNotFoundException;
    
    public List<Order> retrieveOrdersByListingId(Long listingId);

    public Listing retrieveListingByListingId(Long listingId) throws ListingNotFoundException;
    
    public Listing retrieveListingBySellerIdAndListingId(Long sellerId, Long listingId);
    
    public List<Listing> retrieveAllListings();
    
    public List<Listing> retrieveSellerListings(Long sellerId);
    
    public List<Listing> retrieveListingByListingCategory(ListingCategory listingCategory);
    
    public List<Listing> retrieveListingByListingCategoryAndSellerId(ListingCategory listingCategory, Long sellerId);

    public List<Listing> retrieveListingByQuantityGreater(Integer quantityGreaterThan);

    public List<Listing> retrieveListingByQuantityLesser(Integer quantityLesserThan);

    public List<Listing> retrieveListingByPrice(BigDecimal price);

    public List<Listing> retrieveListingByPriceRange(BigDecimal startPrice, BigDecimal endPrice);

    public Boolean doesListingHaveOutstandingOrders(Listing listing);

    public List<Order> getListingOrders(Long listingId) throws ListingNotFoundException;

    public void likeListing(Long buyerId, Long listingId) throws ListingNotFoundException, BuyerNotFoundException, ListingLikedAlreadyException;

    public void unlikeListing(Long buyerId, Long listingId) throws ListingNotFoundException, BuyerNotFoundException, ListingIsNotLikedException;

    public Seller getListingsSeller(Long listingId) throws ListingNotFoundException;

    public Seller retrieveSellerByListingId(Long listingId) throws ListingNotFoundException;

    public List<Listing> getFollowedSellerListings(Long buyerId) throws BuyerNotFoundException;
    
}
