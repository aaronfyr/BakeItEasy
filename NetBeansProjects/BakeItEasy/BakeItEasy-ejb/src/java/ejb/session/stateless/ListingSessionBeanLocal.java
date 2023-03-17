/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Listing;
import enumeration.ListingCategory;
import error.exception.InputDataValidationException;
import error.exception.ListingNotFoundException;
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

    public void deleteListing(Long listingId) throws ListingNotFoundException;

    public Listing retrieveListingByListingId(Long listingId) throws ListingNotFoundException;

    public List<Listing> retrieveListingByListingCategory(ListingCategory listingCategory);

    public List<Listing> retrieveListingByQuantity(Integer quantityLeft);

    public List<Listing> retrieveListingByQuantityGreater(Integer quantityGreaterThan);

    public List<Listing> retrieveListingByQuantityLesser(Integer quantityLesserThan);

    public List<Listing> retrieveListingByPrice(BigDecimal price);

    public List<Listing> retrieveListingByPriceRange(BigDecimal startPrice, BigDecimal endPrice);
    
}