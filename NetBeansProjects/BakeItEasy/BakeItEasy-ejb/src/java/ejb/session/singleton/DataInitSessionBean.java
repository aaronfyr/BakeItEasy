/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.singleton;

import ejb.session.stateless.AdminSessionBeanLocal;
import ejb.session.stateless.BuyerSessionBeanLocal;
import ejb.session.stateless.CommentSessionBeanLocal;
import ejb.session.stateless.ListingSessionBeanLocal;
import ejb.session.stateless.OrderSessionBeanLocal;
import ejb.session.stateless.PostSessionBeanLocal;
import ejb.session.stateless.ReportSessionBeanLocal;
import ejb.session.stateless.ReviewSessionBeanLocal;
import ejb.session.stateless.SellerSessionBeanLocal;
import entity.Admin;
import entity.Buyer;
import entity.Comment;
import entity.Listing;
import entity.Order;
import entity.Post;
import entity.Report;
import entity.Review;
import entity.Seller;
import enumeration.ListingCategory;
import enumeration.OrderStatus;
import enumeration.PostCategory;
import error.exception.AdminUsernameExistsException;
import error.exception.BuyerNotFoundException;
import error.exception.InputDataValidationException;
import error.exception.ListingNotFoundException;
import error.exception.OrderNotFoundException;
import error.exception.PostNotFoundException;
import error.exception.SellerEmailExistException;
import error.exception.SellerNotFoundException;
import error.exception.SellerPhoneNumberExistException;
import error.exception.SellerUsernameExistException;
import error.exception.UnknownPersistenceException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
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

    @EJB
    private ReviewSessionBeanLocal reviewSessionBeanLocal;

    @EJB
    private ReportSessionBeanLocal reportSessionBeanLocal;

    @EJB
    private CommentSessionBeanLocal commentSessionBeanLocal;

    @EJB
    private PostSessionBeanLocal postSessionBeanLocal;

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
    
    @EJB(name = "OrderSessionBeanLocal")
    private OrderSessionBeanLocal orderSessionBeanLocal;

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
            
            Order order1 = new Order(BigDecimal.TEN, 2, "birthday cake", "123 house", new Date(), new Date());
            order1.setOrderStatus(OrderStatus.REJECTED);
            orderSessionBeanLocal.createNewOrder(order1, buyer1.getBuyerId(), listing1.getListingId());
            
            Admin admin1 = new Admin("admin1", "admin", "admin@mail.com", "password");
            adminSessionBeanLocal.createNewAdmin(admin1);
            
            Review review = new Review("Good taste", "Wonderful taste from the cake. Soft and delicious.", 5, new ArrayList<String>(), new Date());
            reviewSessionBeanLocal.createNewReview(review, order1.getOrderId());
            
            Post buyerPost = new Post("Looking for cake recommendations", new Date(), PostCategory.LOOKINGFOR);
            postSessionBeanLocal.createNewBuyerPost(buyerPost, buyer1.getBuyerId());
            
            Post sellerPost = new Post("Sharing brownies ingredients", new Date(), PostCategory.SHARINGINGREDIENTS);
            postSessionBeanLocal.createNewSellerPost(sellerPost, seller1.getSellerId());
            
            Comment buyerComment = new Comment("I think Emicakes is good!", new Date());
            commentSessionBeanLocal.createNewComment(buyerComment, buyerPost.getPostId());
            
            Comment sellerComment = new Comment("I'm interested! Do you have flour?", new Date());
            commentSessionBeanLocal.createNewComment(sellerComment, sellerPost.getPostId());
            
            Report report = new Report("Unfair seller", "Did not grant my request for extra cream");
            reportSessionBeanLocal.createNewReport(report, buyer1.getBuyerId(), seller1.getSellerId());
            
        } catch (UnknownPersistenceException | InputDataValidationException | SellerUsernameExistException | SellerEmailExistException | SellerPhoneNumberExistException | SellerNotFoundException | AdminUsernameExistsException | PostNotFoundException | OrderNotFoundException ex) {
            System.out.println(ex.getMessage());
        } catch (BuyerNotFoundException | ListingNotFoundException ex) {
            Logger.getLogger(DataInitSessionBean.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}
