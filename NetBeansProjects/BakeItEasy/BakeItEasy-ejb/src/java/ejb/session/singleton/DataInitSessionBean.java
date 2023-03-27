/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.singleton;

import ejb.session.stateless.AdminSessionBeanLocal;
import ejb.session.stateless.BuyerSessionBeanLocal;
import ejb.session.stateless.ListingSessionBeanLocal;
import ejb.session.stateless.SellerSessionBeanLocal;
import entity.Admin;
import entity.Buyer;
import entity.Listing;
import entity.Seller;
import enumeration.ListingCategory;
import error.exception.AdminUsernameExistsException;
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
    
    @EJB(name = "AdminSessionBeanLocal")
    private AdminSessionBeanLocal adminSessionBeanLocal;

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
            sellerSessionBeanLocal.createNewSeller(seller1);
            List<String> newImagePath = new ArrayList<>();
            Listing listing1 = new Listing("Most Delicious Cake", ListingCategory.CAKE, BigDecimal.TEN, 99, "This is the most delicious cake ever. Please buy it.", newImagePath);
            listingSessionBeanLocal.createNewListing(listing1, seller1.getSellerId());
            Admin admin1 = new Admin("admin1", "admin", "admin@mail.com", "password");
            adminSessionBeanLocal.createNewAdmin(admin1);
        } catch (UnknownPersistenceException | InputDataValidationException | SellerUsernameExistException | SellerEmailExistException | SellerPhoneNumberExistException | SellerNotFoundException | AdminUsernameExistsException ex) {
            System.out.println(ex.getMessage());
        }
    }
}
