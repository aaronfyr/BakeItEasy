/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.singleton;

import ejb.session.stateless.BuyerSessionBeanLocal;
import ejb.session.stateless.ListingSessionBeanLocal;
import ejb.session.stateless.SellerSessionBeanLocal;
import entity.Buyer;
import entity.Listing;
import entity.Seller;
import enumeration.ListingCategory;
import error.exception.InputDataValidationException;
import error.exception.SellerEmailExistException;
import error.exception.SellerNotFoundException;
import error.exception.SellerPhoneNumberExistException;
import error.exception.SellerUsernameExistException;
import error.exception.UnknownPersistenceException;
import java.awt.print.Book;
import java.lang.reflect.Member;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.annotation.PostConstruct;
import javax.ejb.EJB;
import javax.ejb.Singleton;
import javax.ejb.LocalBean;
import javax.ejb.Startup;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author aaronf
 */
@Singleton
@LocalBean
@Startup
public class DataInitSessionBean {

    @PersistenceContext(unitName = "BakeItEasy-ejbPU")
    private EntityManager em;

    @EJB(name = "SellerSessionBeanLocal")
    private SellerSessionBeanLocal sellerSessionBeanLocal;

    @EJB(name = "ListingSessionBeanLocal")
    private ListingSessionBeanLocal listingSessionBeanLocal;

    @EJB(name = "BuyerSessionBeanLocal")
    private BuyerSessionBeanLocal buyerSessionBeanLocal;

    // Add business logic below. (Right-click in editor and choose
    // "Insert Code > Add Business Method")
    @PostConstruct
    public void postConstruct() {
        if (em.find(Buyer.class, 1l) == null) {
            initialiseData();
        }
    }

    private void initialiseData() {
        try {
            Buyer buyer1 = new Buyer("test", "test", "test", "test", "test", "test");
            buyerSessionBeanLocal.createNewBuyer(buyer1);
            
            Seller seller1 = new Seller("test", "test", "test", "test", "test");
            Seller seller2 = new Seller("test2", "test2", "test2", "test2", "test2");
            Seller seller3 = new Seller("test3", "test3", "test3", "test3", "test3");
            Seller seller4 = new Seller("test4", "test4", "test4", "test4", "test4");
            sellerSessionBeanLocal.createNewSeller(seller1);
            sellerSessionBeanLocal.createNewSeller(seller2);
            sellerSessionBeanLocal.createNewSeller(seller3);
            sellerSessionBeanLocal.createNewSeller(seller4);
            
            List<String> newImagePath = new ArrayList<>();
            Listing listing1 = new Listing("Most Delicious Cake", ListingCategory.CAKE, new BigDecimal(99.99), 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            Listing listing2 = new Listing("Savory Tart", ListingCategory.SAVORY, new BigDecimal(99.99), 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            Listing listing3 = new Listing("Bread", ListingCategory.BREAD, new BigDecimal(99.99), 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            Listing listing4 = new Listing("Muffin", ListingCategory.MUFFINCUPCAKE, new BigDecimal(99.99), 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            Listing listing5 = new Listing("Pastry", ListingCategory.PASTRYTART, new BigDecimal(99.99), 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            Listing listing6 = new Listing("Savory Tart", ListingCategory.PIE, new BigDecimal(99.99), 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            Listing listing7 = new Listing("Most Delicious Cake", ListingCategory.CAKE, new BigDecimal(99.99), 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            Listing listing8 = new Listing("Savory Tart", ListingCategory.SAVORY, new BigDecimal(99.99), 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            Listing listing9 = new Listing("Savory Tart", ListingCategory.BREAD, new BigDecimal(99.99), 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            Listing listing10 =  new Listing("Savory Tart", ListingCategory.MUFFINCUPCAKE, new BigDecimal(99.99), 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            Listing listing11 = new Listing("Savory Tart", ListingCategory.PASTRYTART, new BigDecimal(99.99), 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            Listing listing12 = new Listing("Savory Tart", ListingCategory.PIE, new BigDecimal(99.99), 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            Listing listing13 = new Listing("Most Delicious Cake", ListingCategory.CAKE, new BigDecimal(99.99), 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            Listing listing14 = new Listing("Savory Tart", ListingCategory.SAVORY, new BigDecimal(99.99), 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            Listing listing15 = new Listing("Savory Tart", ListingCategory.BREAD, new BigDecimal(99.99), 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            Listing listing16 = new Listing("Savory Tart", ListingCategory.MUFFINCUPCAKE, new BigDecimal(99.99), 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            Listing listing17 = new Listing("Savory Tart", ListingCategory.PASTRYTART, new BigDecimal(99.99), 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            Listing listing18 = new Listing("Savory Tart", ListingCategory.PIE, new BigDecimal(99.99), 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            Listing listing19 = new Listing("Most Delicious Cake", ListingCategory.CAKE, new BigDecimal(99.99), 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            Listing listing20 = new Listing("Savory Tart", ListingCategory.SAVORY, new BigDecimal(99.99), 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            Listing listing21 = new Listing("Savory Tart", ListingCategory.BREAD, new BigDecimal(99.99), 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            Listing listing22 = new Listing("Savory Tart", ListingCategory.MUFFINCUPCAKE, new BigDecimal(99.99), 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            Listing listing23 = new Listing("Savory Tart", ListingCategory.PASTRYTART, new BigDecimal(99.99), 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            Listing listing24 = new Listing("Savory Tart", ListingCategory.PIE, new BigDecimal(99.99), 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            Listing listing25 = new Listing("Most Delicious Cake", ListingCategory.CAKE, new BigDecimal(99.99), 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            Listing listing26 = new Listing("Savory Tart", ListingCategory.SAVORY, new BigDecimal(99.99), 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            Listing listing27 = new Listing("Savory Tart", ListingCategory.BREAD, new BigDecimal(99.99), 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            Listing listing28 = new Listing("Savory Tart", ListingCategory.MUFFINCUPCAKE, new BigDecimal(99.99), 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            Listing listing29 = new Listing("Savory Tart", ListingCategory.PASTRYTART, new BigDecimal(99.99), 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            Listing listing30 = new Listing("Savory Tart", ListingCategory.PIE, new BigDecimal(99.99), 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            listingSessionBeanLocal.createNewListing(listing1, seller1.getSellerId());
            listingSessionBeanLocal.createNewListing(listing2, seller2.getSellerId());
            listingSessionBeanLocal.createNewListing(listing3, seller3.getSellerId());
            listingSessionBeanLocal.createNewListing(listing4, seller4.getSellerId());
            listingSessionBeanLocal.createNewListing(listing5, seller1.getSellerId());
            listingSessionBeanLocal.createNewListing(listing6, seller2.getSellerId());
            listingSessionBeanLocal.createNewListing(listing7, seller3.getSellerId());
            listingSessionBeanLocal.createNewListing(listing8, seller4.getSellerId());
            listingSessionBeanLocal.createNewListing(listing9, seller1.getSellerId());
            listingSessionBeanLocal.createNewListing(listing10, seller2.getSellerId());
            listingSessionBeanLocal.createNewListing(listing11, seller3.getSellerId());
            listingSessionBeanLocal.createNewListing(listing12, seller4.getSellerId());
            listingSessionBeanLocal.createNewListing(listing13, seller1.getSellerId());
            listingSessionBeanLocal.createNewListing(listing14, seller2.getSellerId());
            listingSessionBeanLocal.createNewListing(listing15, seller3.getSellerId());
            listingSessionBeanLocal.createNewListing(listing16, seller4.getSellerId());
            listingSessionBeanLocal.createNewListing(listing17, seller1.getSellerId());
            listingSessionBeanLocal.createNewListing(listing18, seller2.getSellerId());
            listingSessionBeanLocal.createNewListing(listing19, seller3.getSellerId());
            listingSessionBeanLocal.createNewListing(listing20, seller4.getSellerId());
            listingSessionBeanLocal.createNewListing(listing21, seller1.getSellerId());
            listingSessionBeanLocal.createNewListing(listing22, seller2.getSellerId());
            listingSessionBeanLocal.createNewListing(listing23, seller3.getSellerId());
            listingSessionBeanLocal.createNewListing(listing24, seller4.getSellerId());
            listingSessionBeanLocal.createNewListing(listing25, seller1.getSellerId());
            listingSessionBeanLocal.createNewListing(listing26, seller2.getSellerId());
            listingSessionBeanLocal.createNewListing(listing27, seller3.getSellerId());
            listingSessionBeanLocal.createNewListing(listing28, seller4.getSellerId());
            listingSessionBeanLocal.createNewListing(listing29, seller1.getSellerId());
            listingSessionBeanLocal.createNewListing(listing30, seller2.getSellerId());
            
        } catch (UnknownPersistenceException | InputDataValidationException | SellerUsernameExistException | SellerEmailExistException | SellerPhoneNumberExistException | SellerNotFoundException ex) {
            System.out.println(ex.getMessage());
        }
    }
}
