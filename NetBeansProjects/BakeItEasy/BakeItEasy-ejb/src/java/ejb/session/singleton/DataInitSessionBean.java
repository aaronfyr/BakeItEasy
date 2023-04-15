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
import enumeration.PostCategory;
import error.exception.AdminUsernameExistsException;
import error.exception.BuyerEmailExistException;
import error.exception.BuyerNotFoundException;
import error.exception.BuyerPhoneNumberExistException;
import error.exception.BuyerUsernameExistException;
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
                if (em.find(Buyer.class, 1l) == null && em.find(Order.class, 1l) == null && em.find(Admin.class, 1l) == null && em.find(Comment.class, 1l) == null && em.find(Listing.class, 1l) == null && em.find(Post.class, 1l) == null && em.find(Report.class, 1l) == null && em.find(Review.class, 1l) == null && em.find(Seller.class, 1l) == null) {
                    initialiseData();
                }
        }

        private void initialiseData() {
                try {
                        String image = "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
                    
                        Buyer buyer1 = new Buyer("Andy", "andy@gmail.com", "andy", "password", "99999991", "123 building", image);
                        buyerSessionBeanLocal.createNewBuyer(buyer1);
                        Buyer buyer2 = new Buyer("Bob", "bob@gmail.com", "bob", "password", "99999992", "345 building", image);
                        buyerSessionBeanLocal.createNewBuyer(buyer2);
                        Buyer buyer3 = new Buyer("Charlie", "charlie@gmail.com", "charlie", "password", "99999993", "45 building", image);
                        buyerSessionBeanLocal.createNewBuyer(buyer3);

                        Seller seller1 = new Seller("Sam", "sam@gmail.com", "sam", "password", "88888881", image);
                        Seller seller2 = new Seller("Tom", "tom@gmail.com", "tom", "password", "88888882", image);
                        Seller seller3 = new Seller("Rachel", "rachel@gmail.com", "rachel", "password", "88888883", image);
                        Seller seller4 = new Seller("Oliver", "oliver@gmail.com", "oliver", "password", "88888884", image);
                        sellerSessionBeanLocal.createNewSeller(seller1);
                        sellerSessionBeanLocal.createNewSeller(seller2);
                        sellerSessionBeanLocal.createNewSeller(seller3);
                        sellerSessionBeanLocal.createNewSeller(seller4);

                        // test with 3 pictures in array
                        List<String> newImagePath = new ArrayList<>();
                        newImagePath.add(
                                        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8NHx8fGVufDB8fHx8&w=1000&q=80");
                        newImagePath.add(image);
                        newImagePath.add(image);
                        
                        Listing listing1 = new Listing("Customisable Cake", ListingCategory.CAKE, new BigDecimal(25.00), 5,
                                        "A delicious cake for any occasion!", newImagePath, 3);
                        Listing listing2 = new Listing("Savory Tomato Tart", ListingCategory.SAVORY, new BigDecimal(2.50), 20,
                                        "Savory tarts with custard filling.", newImagePath, 3);
                        Listing listing3 = new Listing("Wholegrain bread loaf", ListingCategory.BREAD, new BigDecimal(3.00), 15,
                                        "Classic bread made with high quality ingredients.", newImagePath, 3);
                        Listing listing4 = new Listing("Chocolate muffin", ListingCategory.MUFFINCUPCAKE, new BigDecimal(3.00), 30,
                                        "Yummy chocolate muffins.", newImagePath, 3);
                        Listing listing5 = new Listing("Puff pastry tart", ListingCategory.PASTRYTART, new BigDecimal(5.00), 5,
                                        "Delicious flaky, buttery homemade puff pastry with cream and fruits.", newImagePath, 3);
                        Listing listing6 = new Listing("Apple pie", ListingCategory.PIE, new BigDecimal(8.25), 6,
                                        "Best apple pie in Singapore.", newImagePath, 3);
                        Listing listing7 = new Listing("Sponge cake", ListingCategory.CAKE,
                                        new BigDecimal(5.60), 1,
                                        "The most cottony and bouncy sponge cake.", newImagePath, 3);
                        Listing listing8 = new Listing("Cheese & piccalilli tart", ListingCategory.SAVORY, new BigDecimal(6.45), 6,
                                        "Crisp pastry, a delicious layer of piccalilli and a soft cheesy filling.", newImagePath, 3);
                        Listing listing9 = new Listing("Sourdough bread", ListingCategory.BREAD, new BigDecimal(5.00), 3,
                                        "This chewy loaf has rich, deep, flavor with mild sourdough tang.", newImagePath, 3);
                        Listing listing10 = new Listing("Yoghurt muffin", ListingCategory.MUFFINCUPCAKE, new BigDecimal(2.50), 30,
                                        "A light, moist and super fluffy Greek yogurt blueberry muffin.", newImagePath, 3);
                        Listing listing11 = new Listing("Cherry puff pastry tart", ListingCategory.PASTRYTART, new BigDecimal(2.78), 50,
                                        "Rustic yet elegant, buttery, flaky pastries, filled with a creamy center and juicy sweet cherries", newImagePath, 3);
                        Listing listing12 = new Listing("Banana pie", ListingCategory.PIE, new BigDecimal(15.60), 15,
                                        "This yummy banana cream pie made with lots of bananas and a rich, creamy homemade pudding in a pre-baked pie crust", newImagePath, 3);
                        Listing listing13 = new Listing("Birthday cake", ListingCategory.CAKE, new BigDecimal(30.00), 10,
                                        "Customisable to your needs.", newImagePath, 3);
                        Listing listing14 = new Listing("Mushroom Tart", ListingCategory.SAVORY, new BigDecimal(2.78), 50,
                                        "An eye-catching mushroom tart for an easy but impressive vegetarian main course.", newImagePath, 3);
                        Listing listing15 = new Listing("French baguette", ListingCategory.BREAD, new BigDecimal(5.00), 5,
                                        "Has a crisp crust.", newImagePath, 3);
                        Listing listing16 = new Listing("Classic cupcakes", ListingCategory.MUFFINCUPCAKE, new BigDecimal(3.00), 50,
                                        "Handmade with love everyday for kids and adults alike to enjoy.", newImagePath, 3);
                        Listing listing17 = new Listing("Pesto Tart", ListingCategory.PASTRYTART, new BigDecimal(13.30), 5,
                                        "High quality pesto.", newImagePath, 3);
                        Listing listing18 = new Listing("Lemon Meringue Pie", ListingCategory.PIE, new BigDecimal(19.90), 8,
                                        "A shortened pastry base filled with lemon curd and topped with meringue.", newImagePath, 3);
                        Listing listing19 = new Listing("Marble Cake", ListingCategory.CAKE, new BigDecimal(7.50), 9,
                                        "This homemade marble cake is so moist and and buttery.", newImagePath, 3);
                        Listing listing20 = new Listing("Onion Tart", ListingCategory.SAVORY, new BigDecimal(9.55),
                                        10,
                                        "This simple quiche is a classic veggie favourite.", newImagePath, 3);
                        Listing listing21 = new Listing("Pan loaf bread", ListingCategory.BREAD, new BigDecimal(4.50), 10,
                                        "This delicious, fine-grained loaf is perfect for sandwiches and toast.", newImagePath, 3);
                        Listing listing22 = new Listing("Egg muffin", ListingCategory.MUFFINCUPCAKE, new BigDecimal(3.22), 30,
                                        "It's easy, delicious, freezer friendly.", newImagePath, 3);
                        Listing listing23 = new Listing("Shortcrust pastry tart", ListingCategory.PASTRYTART, new BigDecimal(5.00), 50,
                                        "Versatile shortcrust makes terrific tarts, pies and party nibbles.", newImagePath, 3);
                        Listing listing24 = new Listing("Custard Pie", ListingCategory.PIE, new BigDecimal(9.99), 5,
                                        "An absolute classic, this Custard Pie has a silky smooth egg custard filling made from eggs, milk, and cream.", newImagePath, 3);
                        Listing listing25 = new Listing("Fruitcake", ListingCategory.CAKE, new BigDecimal(5.60), 10,
                                        "An easy, rich and moist fruit cake that uses soaked unsweetened fruit and nut mix.", newImagePath, 3);
                        Listing listing26 = new Listing("Asparagus & Chesse tart", ListingCategory.SAVORY, new BigDecimal(8.80), 10,
                                        "Classic British flavours in this springtime quiche.", newImagePath, 3);
                        Listing listing27 = new Listing("Coconut sweet buns", ListingCategory.BREAD, new BigDecimal(4.40), 10,
                                        "Freshly baked sweet buns.", newImagePath, 3);
                        Listing listing28 = new Listing("Pumpkin spice muffins", ListingCategory.MUFFINCUPCAKE, new BigDecimal(4.60), 50,
                                        "Cinnamon spiced pumpkin muffins for a mid-morning snack.", newImagePath, 3);
                        Listing listing29 = new Listing("Sweet Shortcrust Pastry Tart", ListingCategory.PASTRYTART, new BigDecimal(5.00), 5,
                                        "Delicious and good.", newImagePath, 3);
                        Listing listing30 = new Listing("Double-crust fruit pie", ListingCategory.PIE, new BigDecimal(15.60), 20,
                                        "Flaky, buttery goodness, plus juicy fruit fillings you'll crave.", newImagePath, 3);
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

                        /* date format might affect frontend
                        Date date1 = new GregorianCalendar(2023, Calendar.APRIL, 18).getTime();
                        date1 = new SimpleDateFormat("yyyy-MM-dd").parse(date1);
                        */
                        
                        Date dateOfCreation = new Date(System.currentTimeMillis());
                        Date dateOfCollection = new Date(System.currentTimeMillis() + (7 * 24 * 60 * 60 * 1000));
                        
                        Order order1 = new Order(new BigDecimal(25.00), 1, "Birthday cake", "123 house", dateOfCreation, dateOfCollection);
                        orderSessionBeanLocal.createNewOrder(order1, buyer1.getBuyerId(), listing1.getListingId());
                        Order order2 = new Order(new BigDecimal(25.00), 1, "Graduation cake", "456 house", dateOfCreation, dateOfCollection);
                        orderSessionBeanLocal.createNewOrder(order2, buyer2.getBuyerId(), listing1.getListingId());
                        sellerSessionBeanLocal.acceptOrder(order2.getOrderId());
                        sellerSessionBeanLocal.completeOrder(order2.getOrderId());
                        Order order3 = new Order(new BigDecimal(5.00), 3, "Puff pastry tart", "456 house", dateOfCreation, dateOfCollection);
                        orderSessionBeanLocal.createNewOrder(order3, buyer1.getBuyerId(), listing5.getListingId());
                        sellerSessionBeanLocal.acceptOrder(order3.getOrderId());
                        sellerSessionBeanLocal.completeOrder(order3.getOrderId());

                        Admin admin1 = new Admin("Admin John", "admin", "admin@gmail.com", "password");
                        adminSessionBeanLocal.createNewAdmin(admin1);
                        
                        Review review1 = new Review("Good taste", "Wonderful taste from the cake. Soft and delicious.", 5,
                                        new ArrayList<>(), new Date());
                        reviewSessionBeanLocal.createNewReview(review1, order2.getOrderId());
                        Review review2 = new Review("Worth buying", "Nicely packed and delicious!", 5,
                                        new ArrayList<>(), new Date());
                        reviewSessionBeanLocal.createNewReview(review2, order3.getOrderId());

                        Post buyerPost1 = new Post("Looking for cake recommendations", PostCategory.LOOKINGFOR, true);
                        postSessionBeanLocal.createNewBuyerPost(buyerPost1, buyer1.getBuyerId());

                        Post sellerPost1 = new Post("Sharing brownies ingredients", PostCategory.SHARINGINGREDIENTS, false);
                        postSessionBeanLocal.createNewSellerPost(sellerPost1, seller1.getSellerId());
                        
                        Post sellerPost2 = new Post("My grandmother's apple pie recipe", PostCategory.RECIPES, false);
                        postSessionBeanLocal.createNewSellerPost(sellerPost2, seller2.getSellerId());

                        Comment buyerComment1 = new Comment("I think Emicakes is good!", true);
                        commentSessionBeanLocal.createNewBuyerComment(buyerComment1, buyerPost1.getPostId(), buyer1.getBuyerId());
                        
                        Comment sellerComment1 = new Comment("Can try my cake!", false);
                        commentSessionBeanLocal.createNewSellerComment(sellerComment1, buyerPost1.getPostId(), buyer1.getBuyerId());

                        Comment sellerComment2 = new Comment("I'm interested! Do you have flour?", false);
                        commentSessionBeanLocal.createNewSellerComment(sellerComment2, sellerPost1.getPostId(), 2L);

                        Report report = new Report("Unfair seller", "Did not grant my request for extra cream");
                        reportSessionBeanLocal.createNewReport(report, buyer1.getBuyerId(), seller1.getSellerId());
                        
                        /*
                        
                        Buyer buyer1 = new Buyer("test", "test@gmail.com", "test", "test", "test", "test");
                        buyerSessionBeanLocal.createNewBuyer(buyer1);
                        Buyer buyer2 = new Buyer("test2", "test2@gmail.com", "test2", "test2", "test2", "test2");
                        buyerSessionBeanLocal.createNewBuyer(buyer2);

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
                        orderSessionBeanLocal.createNewOrder(order2, buyer2.getBuyerId(), listing1.getListingId());
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

                        */

                } catch (UnknownPersistenceException | InputDataValidationException | SellerUsernameExistException
                                | SellerEmailExistException | SellerPhoneNumberExistException | PostNotFoundException
                                | OrderNotFoundException | AdminUsernameExistsException | SellerNotFoundException
                                | BuyerNotFoundException | ListingNotFoundException | OrderIsNotPendingException
                                | OrderIsNotAcceptedException | BuyerPhoneNumberExistException | BuyerEmailExistException | BuyerUsernameExistException | OrderIsNotCompletedException ex ) {
                        System.out.println("Error initialising data: " + ex.getMessage());
                }
        }
}
