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
import error.exception.OrderIsNotAcceptedException;
import error.exception.OrderIsNotCompletedException;
import error.exception.OrderIsNotPendingException;
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
                        Buyer buyer1 = new Buyer("test", "test@gmail.com", "test", "test", "test", "test");
                        buyerSessionBeanLocal.createNewBuyer(buyer1);

                        Seller seller1 = new Seller("test", "test@mail.com", "test", "test", "test");
                        Seller seller2 = new Seller("test2", "test2@mail.com", "test2", "test2", "test2");
                        Seller seller3 = new Seller("test3", "test3@mail.com", "test3", "test3", "test3");
                        Seller seller4 = new Seller("test4", "test4@mail.com", "test4", "test4", "test4");
                        sellerSessionBeanLocal.createNewSeller(seller1);
                        sellerSessionBeanLocal.createNewSeller(seller2);
                        sellerSessionBeanLocal.createNewSeller(seller3);
                        sellerSessionBeanLocal.createNewSeller(seller4);

                        List<String> newImagePath = new ArrayList<>();
                        newImagePath.add(
                                        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8NHx8fGVufDB8fHx8&w=1000&q=80");
                        Listing listing1 = new Listing("Most Delicious Cake", ListingCategory.CAKE,
                                        new BigDecimal(99.99), 99,
                                        "This is the most delicious cake ever. Please buy it.", newImagePath);
                        newImagePath.clear();
                        Listing listing2 = new Listing("Savory Tart", ListingCategory.SAVORY, new BigDecimal(99.99), 99,
                                        "This is the most delicious cake ever. Please buy it.", newImagePath);
                        Listing listing3 = new Listing("Bread", ListingCategory.BREAD, new BigDecimal(99.99), 99,
                                        "This is the most delicious cake ever. Please buy it.", newImagePath);
                        Listing listing4 = new Listing("Muffin", ListingCategory.MUFFINCUPCAKE, new BigDecimal(99.99),
                                        99,
                                        "This is the most delicious cake ever. Please buy it.", newImagePath);
                        Listing listing5 = new Listing("Pastry", ListingCategory.PASTRYTART, new BigDecimal(99.99), 99,
                                        "This is the most delicious cake ever. Please buy it.", newImagePath);
                        Listing listing6 = new Listing("Savory Tart", ListingCategory.PIE, new BigDecimal(99.99), 99,
                                        "This is the most delicious cake ever. Please buy it.", newImagePath);
                        Listing listing7 = new Listing("Most Delicious Cake", ListingCategory.CAKE,
                                        new BigDecimal(99.99), 99,
                                        "This is the most delicious cake ever. Please buy it.", newImagePath);
                        Listing listing8 = new Listing("Savory Tart", ListingCategory.SAVORY, new BigDecimal(99.99), 99,
                                        "This is the most delicious cake ever. Please buy it.", newImagePath);
                        Listing listing9 = new Listing("Savory Tart", ListingCategory.BREAD, new BigDecimal(99.99), 99,
                                        "This is the most delicious cake ever. Please buy it.", newImagePath);
                        Listing listing10 = new Listing("Savory Tart", ListingCategory.MUFFINCUPCAKE,
                                        new BigDecimal(99.99), 99,
                                        "This is the most delicious cake ever. Please buy it.", newImagePath);
                        Listing listing11 = new Listing("Savory Tart", ListingCategory.PASTRYTART,
                                        new BigDecimal(99.99), 99,
                                        "This is the most delicious cake ever. Please buy it.", newImagePath);
                        Listing listing12 = new Listing("Savory Tart", ListingCategory.PIE, new BigDecimal(99.99), 99,
                                        "This is the most delicious cake ever. Please buy it.", newImagePath);
                        Listing listing13 = new Listing("Most Delicious Cake", ListingCategory.CAKE,
                                        new BigDecimal(99.99), 99,
                                        "This is the most delicious cake ever. Please buy it.", newImagePath);
                        Listing listing14 = new Listing("Savory Tart", ListingCategory.SAVORY, new BigDecimal(99.99),
                                        99,
                                        "This is the most delicious cake ever. Please buy it.", newImagePath);
                        Listing listing15 = new Listing("Savory Tart", ListingCategory.BREAD, new BigDecimal(99.99), 99,
                                        "This is the most delicious cake ever. Please buy it.", newImagePath);
                        Listing listing16 = new Listing("Savory Tart", ListingCategory.MUFFINCUPCAKE,
                                        new BigDecimal(99.99), 99,
                                        "This is the most delicious cake ever. Please buy it.", newImagePath);
                        Listing listing17 = new Listing("Savory Tart", ListingCategory.PASTRYTART,
                                        new BigDecimal(99.99), 99,
                                        "This is the most delicious cake ever. Please buy it.", newImagePath);
                        Listing listing18 = new Listing("Savory Tart", ListingCategory.PIE, new BigDecimal(99.99), 99,
                                        "This is the most delicious cake ever. Please buy it.", newImagePath);
                        Listing listing19 = new Listing("Most Delicious Cake", ListingCategory.CAKE,
                                        new BigDecimal(99.99), 99,
                                        "This is the most delicious cake ever. Please buy it.", newImagePath);
                        Listing listing20 = new Listing("Savory Tart", ListingCategory.SAVORY, new BigDecimal(99.99),
                                        99,
                                        "This is the most delicious cake ever. Please buy it.", newImagePath);
                        Listing listing21 = new Listing("Savory Tart", ListingCategory.BREAD, new BigDecimal(99.99), 99,
                                        "This is the most delicious cake ever. Please buy it.", newImagePath);
                        Listing listing22 = new Listing("Savory Tart", ListingCategory.MUFFINCUPCAKE,
                                        new BigDecimal(99.99), 99,
                                        "This is the most delicious cake ever. Please buy it.", newImagePath);
                        Listing listing23 = new Listing("Savory Tart", ListingCategory.PASTRYTART,
                                        new BigDecimal(99.99), 99,
                                        "This is the most delicious cake ever. Please buy it.", newImagePath);
                        Listing listing24 = new Listing("Savory Tart", ListingCategory.PIE, new BigDecimal(99.99), 99,
                                        "This is the most delicious cake ever. Please buy it.", newImagePath);
                        Listing listing25 = new Listing("Most Delicious Cake", ListingCategory.CAKE,
                                        new BigDecimal(99.99), 99,
                                        "This is the most delicious cake ever. Please buy it.", newImagePath);
                        Listing listing26 = new Listing("Savory Tart", ListingCategory.SAVORY, new BigDecimal(99.99),
                                        99,
                                        "This is the most delicious cake ever. Please buy it.", newImagePath);
                        Listing listing27 = new Listing("Savory Tart", ListingCategory.BREAD, new BigDecimal(99.99), 99,
                                        "This is the most delicious cake ever. Please buy it.", newImagePath);
                        Listing listing28 = new Listing("Savory Tart", ListingCategory.MUFFINCUPCAKE,
                                        new BigDecimal(99.99), 99,
                                        "This is the most delicious cake ever. Please buy it.", newImagePath);
                        Listing listing29 = new Listing("Savory Tart", ListingCategory.PASTRYTART,
                                        new BigDecimal(99.99), 99,
                                        "This is the most delicious cake ever. Please buy it.", newImagePath);
                        Listing listing30 = new Listing("Savory Tart", ListingCategory.PIE, new BigDecimal(99.99), 99,
                                        "This is the most delicious cake ever. Please buy it.", newImagePath);
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

                        Order order1 = new Order(BigDecimal.TEN, 2, "birthday cake", "123 house", new Date(),
                                        new Date());
                        orderSessionBeanLocal.createNewOrder(order1, buyer1.getBuyerId(), listing1.getListingId());

                        Order order2 = new Order(BigDecimal.TEN, 2, "birthday cake", "123 house", new Date(),
                                        new Date());
                        orderSessionBeanLocal.createNewOrder(order2, buyer1.getBuyerId(), listing1.getListingId());
                        sellerSessionBeanLocal.acceptOrder(order2.getOrderId());
                        sellerSessionBeanLocal.completeOrder(order2.getOrderId());

                        Admin admin1 = new Admin("admin1", "admin", "admin@mail.com", "password");
                        adminSessionBeanLocal.createNewAdmin(admin1);

                        Review review = new Review("Good taste", "Wonderful taste from the cake. Soft and delicious.",
                                        5,
                                        new ArrayList<>(), new Date());
                        reviewSessionBeanLocal.createNewReview(review, order2.getOrderId());

                        Post buyerPost = new Post("Looking for cake recommendations", new Date(),
                                        PostCategory.LOOKINGFOR);
                        postSessionBeanLocal.createNewBuyerPost(buyerPost, buyer1.getBuyerId());

                        Post sellerPost = new Post("Sharing brownies ingredients", new Date(),
                                        PostCategory.SHARINGINGREDIENTS);
                        postSessionBeanLocal.createNewSellerPost(sellerPost, seller1.getSellerId());

                        Comment buyerComment = new Comment("I think Emicakes is good!", new Date());
                        commentSessionBeanLocal.createNewComment(buyerComment, buyerPost.getPostId());

                        Comment sellerComment = new Comment("I'm interested! Do you have flour?", new Date());
                        commentSessionBeanLocal.createNewComment(sellerComment, sellerPost.getPostId());

                        Report report = new Report("Unfair seller", "Did not grant my request for extra cream");
                        reportSessionBeanLocal.createNewReport(report, buyer1.getBuyerId(), seller1.getSellerId());

                } catch (UnknownPersistenceException | InputDataValidationException | SellerUsernameExistException
                                | SellerEmailExistException | SellerPhoneNumberExistException | PostNotFoundException
                                | OrderNotFoundException | AdminUsernameExistsException | SellerNotFoundException
                                | BuyerNotFoundException | ListingNotFoundException | OrderIsNotPendingException
                                | OrderIsNotAcceptedException | OrderIsNotCompletedException ex) {
                        System.out.println("Error initialising data: " + ex.getMessage());
                }
        }
}
