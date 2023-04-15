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
                        List<String> newImagePath1 = new ArrayList<>();
                        newImagePath1.add("https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8NHx8fGVufDB8fHx8&w=1000&q=80");
                        newImagePath1.add("https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80");
                        newImagePath1.add("https://images.unsplash.com/photo-1622419015886-5e773bf6006e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c2ltcGxlJTIwY2FrZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1000&q=60");
                        Listing listing1 = new Listing("Customisable Cake", ListingCategory.CAKE, new BigDecimal(25.00), 5,
                                        "A delicious cake for any occasion!", newImagePath1, 3);
                        
                        List<String> newImagePath2 = new ArrayList<>();
                        newImagePath2.add("https://media.istockphoto.com/id/506156209/photo/tomato-tart.jpg?s=612x612&w=0&k=20&c=hqCikwHpZBUnoLbBQe5K5cM-7zCg0MP0lrXs8D8x43Q=");
                        newImagePath2.add("https://media.istockphoto.com/id/694022972/photo/tomato-quiche.jpg?s=612x612&w=0&k=20&c=SXBhmgk7otMcspG1kbDGyw7-KCcyy_6zzwzX432nVgk="); 
                        newImagePath2.add("https://media.istockphoto.com/id/1440486237/photo/pastry-pita-bread-puff-pastry-pie-with-tomatoes-and-thyme-savory-tarts-tomato-quiche-tomato.jpg?s=612x612&w=0&k=20&c=t_-XKCCUZgMGId4AOcjRfB9BamNTwXMXl4GqIoB0TxM=");
                        Listing listing2 = new Listing("Savory Tomato Tart", ListingCategory.SAVORY, new BigDecimal(2.50), 20,
                                        "Savory tarts with custard filling.", newImagePath2, 3);
                        
                        List<String> newImagePath3 = new ArrayList<>();
                        newImagePath3.add("https://media.istockphoto.com/id/474679296/photo/organic-homemade-whole-wheat-bread.jpg?s=612x612&w=0&k=20&c=b3TU_bz4r6gxeo2COsY2N4t9PxMoVmWdFO0kfnOJg4I=");
                        newImagePath3.add("https://media.istockphoto.com/id/157587362/photo/detailed-close-up-of-sliced-grain-bread-on-white-background.jpg?s=612x612&w=0&k=20&c=nr5f0Mb3Dx9RP_LmKKwlo6IlzDebfIdCbnERsnoSG94=");
                        newImagePath3.add("https://media.istockphoto.com/id/153905178/photo/homemade-organic-bread.jpg?s=612x612&w=0&k=20&c=E-BMjTx7BGFfdDn7X-XJv2qV0775MOTSOGdX69LOaOw=");
                        Listing listing3 = new Listing("Wholegrain bread loaf", ListingCategory.BREAD, new BigDecimal(3.00), 15,
                                        "Classic bread made with high quality ingredients.", newImagePath3, 3);
                        
                        List<String> newImagePath4 = new ArrayList<>();
                        newImagePath4.add("https://images.pexels.com/photos/3650438/pexels-photo-3650438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2");
                        newImagePath4.add("https://media.istockphoto.com/id/537698587/photo/homemade-dark-chocolate-muffins.jpg?s=612x612&w=0&k=20&c=Ey6ImB29shcrNb-a1G_WmlcJmDa9bVVxLId_q1pZAWs=");
                        newImagePath4.add("https://images.pexels.com/photos/3650436/pexels-photo-3650436.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2");
                        Listing listing4 = new Listing("Chocolate muffin", ListingCategory.MUFFINCUPCAKE, new BigDecimal(3.00), 30,
                                        "Yummy chocolate muffins.", newImagePath4, 3);
                        
                        List<String> newImagePath5 = new ArrayList<>();
                        newImagePath5.add("https://media.istockphoto.com/id/626622460/photo/chocolate-and-caramelized-almond-mille-feuille.jpg?s=612x612&w=0&k=20&c=PGt2C1ByG3GuQSW4LsTJAtsAnYRzNAtUQTLr4QmmTr0=");
                        newImagePath5.add("https://media.istockphoto.com/id/1294254706/photo/puff-pastry-pinwheels-stuffed-with-salmon-cheese-and-spinach-on-a-wooden-background.jpg?s=612x612&w=0&k=20&c=qefDclYfXwLukR9ZqdsIX0djul4TDYhjlbChz8Gjn-s=");
                        newImagePath5.add("https://media.istockphoto.com/id/946916608/photo/chicken-pot-pie-with-vegetables-and-aromatic-herbs.jpg?s=612x612&w=0&k=20&c=5kWW1qpl3v2SD3T9B4X94tsxzIAHWKuHDoGzW7sU7J8=");
                        Listing listing5 = new Listing("Puff pastry tart", ListingCategory.PASTRYTART, new BigDecimal(5.00), 5,
                                        "Delicious flaky, buttery homemade puff pastry with cream and fruits.", newImagePath5, 3);
                        
                        List<String> newImagePath6 = new ArrayList<>();
                        newImagePath6.add("https://media.istockphoto.com/id/450752471/photo/homemade-organic-apple-pie-dessert.jpg?s=612x612&w=0&k=20&c=6mwKTunGfRKFWyB_VUOGqXzcUMtBSCvg6JAQ3At2aWE=");
                        newImagePath6.add("https://media.istockphoto.com/id/512602151/photo/classic-american-apple-pie.jpg?s=612x612&w=0&k=20&c=krwnHH-iAq_upwg1_dedZhgPADY6IOg-y9tuYEQJiv0=");
                        newImagePath6.add("https://media.istockphoto.com/id/828145282/photo/homemade-apple-pie-on-a-wood-surface.jpg?s=612x612&w=0&k=20&c=KI4PkjalxwTu7JCQjPbiUrsrrPyIvw86zas52B_DJko=");
                        Listing listing6 = new Listing("Apple pie", ListingCategory.PIE, new BigDecimal(8.25), 6,
                                        "Best apple pie in Singapore.", newImagePath6, 3);
                        
                        List<String> newImagePath7 = new ArrayList<>();
                        newImagePath7.add("https://media.istockphoto.com/id/1272297413/photo/homemade-classic-vanilla-sponge-cake-or-biscuit-sprinkled-with-powdered-sugar-and-fresh.jpg?s=612x612&w=0&k=20&c=qndoYguwr56JL6UezF9-xVuSQJr07XQcQyE7WdBztGw=");
                        newImagePath7.add("https://media.istockphoto.com/id/1289214022/photo/clasic-sponge-cake-homemade-cake.jpg?s=612x612&w=0&k=20&c=ihbGK6gaxB8k6SNJX9l221A-ungfMmt8gDA6s0JoFdE=");
                        newImagePath7.add("https://media.istockphoto.com/id/469754503/photo/homemade-sponge-cake.jpg?s=612x612&w=0&k=20&c=WEY86ymyGlvrKYGkmEq9EK_icpMfZKNWz1B8Smh4RZE=");
                        Listing listing7 = new Listing("Sponge cake", ListingCategory.CAKE,
                                        new BigDecimal(5.60), 1,
                                        "The most cottony and bouncy sponge cake.", newImagePath7, 3);
                        
                        List<String> newImagePath8 = new ArrayList<>();
                        newImagePath8.add("https://media.istockphoto.com/id/891482772/photo/closeup-detail-of-pizza.jpg?s=612x612&w=0&k=20&c=yI-KkEAwjUhskwcbqt_kI-xM6P8qcDdLJzJCoREWkC4=");
                        newImagePath8.add("https://media.istockphoto.com/id/1287448535/photo/traditional-homemade-onion-pie-or-quiche.jpg?s=612x612&w=0&k=20&c=AgOJ7m5cVcMM6e0yN8mb6HOoK4qeQZ8bQDgRJDK6krA=");
                        newImagePath8.add("https://media.istockphoto.com/id/578111736/photo/piece-of-french-quiche-lorraine-macro-horizontal.jpg?s=612x612&w=0&k=20&c=MDXkEURFhknZwldEWyhWmsq2p3hDsweFQpiWDz2Cw34=");
                        Listing listing8 = new Listing("Cheese & piccalilli tart", ListingCategory.SAVORY, new BigDecimal(6.45), 6,
                                        "Crisp pastry, a delicious layer of piccalilli and a soft cheesy filling.", newImagePath8, 3);
                        
                        List<String> newImagePath9 = new ArrayList<>();
                        newImagePath9.add("https://media.istockphoto.com/id/1125389587/photo/delicious-homemade-sourdough-rye-bread-on-a-plate-and-milk-homemade-baking.jpg?s=612x612&w=0&k=20&c=ThZ83o27RP3MZX1Lrd2bNNsWBu-vahAfc0GCTCd9ydI=");
                        newImagePath9.add("https://media.istockphoto.com/id/1225036865/photo/woman-holding-fresh-baked-sourdough-bread.jpg?s=612x612&w=0&k=20&c=-rz8moP9gzfJIDV6lz6GBK6MYsY-44YtmXkN1Zl3Uqo=");
                        newImagePath9.add("https://media.istockphoto.com/id/1208007773/photo/freshly-baked-homemade-artisan-sourdough-bread-sliced-top-view-copy-space.jpg?s=612x612&w=0&k=20&c=dC4Ji66B4Kg3wZO5_PzEdPcIOWLwX9Uj0Rm90c-SN4U=");
                        Listing listing9 = new Listing("Sourdough bread", ListingCategory.BREAD, new BigDecimal(5.00), 3,
                                        "This chewy loaf has rich, deep, flavor with mild sourdough tang.", newImagePath9, 3);
                        
                        List<String> newImagePath10 = new ArrayList<>();
                        newImagePath10.add("https://media.istockphoto.com/id/668224990/photo/coconut-and-pineapple-muffins.jpg?s=612x612&w=0&k=20&c=Ja1gZCiXlsRhUsJTWlfLiOnKHfrQn-UxQDptUdtAyKo=");
                        newImagePath10.add("https://media.istockphoto.com/id/625782318/photo/blackberry-muffins-covered-with-sugar-powder.jpg?s=612x612&w=0&k=20&c=omdnmNcmKbHdtuIooYRJtKF0Orve16Z_74cOBy_F_V0=");
                        newImagePath10.add("https://media.istockphoto.com/id/908981926/photo/homemade-blueberry-muffins-on-white-table.jpg?s=612x612&w=0&k=20&c=V9QeAfE-VCaw5yZOG51hZEtRkhO1dTXDG3Y1Pw6pLbg=");
                        Listing listing10 = new Listing("Yoghurt muffin", ListingCategory.MUFFINCUPCAKE, new BigDecimal(2.50), 30,
                                        "A light, moist and super fluffy Greek yogurt blueberry muffin.", newImagePath10, 3);
                        
                        List<String> newImagePath11 = new ArrayList<>();
                        newImagePath11.add("https://media.istockphoto.com/id/578567628/photo/french-pastry-cherry-turnover.jpg?s=612x612&w=0&k=20&c=tiSKD_16b-3oBXg4qKY124bZ5QnfW1LerAOkhLv_G_8=");
                        newImagePath11.add("https://media.istockphoto.com/id/1394525453/photo/cherry-turnover-made-with-pie-filling-and-puff-pastry.jpg?s=612x612&w=0&k=20&c=SWeUDBHllrQe5RtzZskDNl58-JIvD--UxOaFtbLT7_Q=");
                        newImagePath11.add("https://media.istockphoto.com/id/980642338/photo/cherry-dutch-baby-puff-german-pancake-on-vintage-pans-and-dark-background-homemade-summer.jpg?s=612x612&w=0&k=20&c=yxYSkbB7GqMNA2ZK-qc5RSkvKsAxejpskN4KDHeOLyY=");
                        Listing listing11 = new Listing("Cherry puff pastry tart", ListingCategory.PASTRYTART, new BigDecimal(2.78), 50,
                                        "Rustic yet elegant, buttery, flaky pastries, filled with a creamy center and juicy sweet cherries", newImagePath11, 3);
                        
                        List<String> newImagePath12 = new ArrayList<>();
                        newImagePath12.add("https://media.istockphoto.com/id/1125739573/photo/banana-tart-fresh-sliced-banana-custard-tart.jpg?s=612x612&w=0&k=20&c=S6Yne6KeRvt765r6vT0cXRjxvYKxLSBT0EgeHD22qXs=");
                        newImagePath12.add("https://media.istockphoto.com/id/172886119/photo/banana-cream-pie.jpg?s=612x612&w=0&k=20&c=82XseAi-MsJPH12zA4vNm1aTQZbDqkNE-GqJ6IjPZaw=");
                        newImagePath12.add("https://media.istockphoto.com/id/1156699594/photo/cooking-fruit-cake-female-hands-spread-bananas-in-a-baking-dish-on-the-background-are.jpg?s=612x612&w=0&k=20&c=--2mB9JzQJT_vjzYZ8Je4vzbpn-xZRybqhBVfcaczrw=");
                        Listing listing12 = new Listing("Banana pie", ListingCategory.PIE, new BigDecimal(15.60), 15,
                                        "This yummy banana cream pie made with lots of bananas and a rich, creamy homemade pudding in a pre-baked pie crust", newImagePath12, 3);
                        
                        List<String> newImagePath13 = new ArrayList<>();
                        newImagePath13.add("https://media.istockphoto.com/id/1223237714/photo/happy-birthday-cake.jpg?s=612x612&w=0&k=20&c=zyshyKidYEYvLm-b3tUJUNqLPl31TeETDfGO29k4ifE=");
                        newImagePath13.add("https://media.istockphoto.com/id/1247903563/photo/passion-fruit-birthday-cake.jpg?s=612x612&w=0&k=20&c=Zswc7ncwNBGoE4UgxsaLNiddyi3CaWKBRU0r2OKlcB0=");
                        newImagePath13.add("https://media.istockphoto.com/id/942400598/photo/sprinkles-are-all-arround.jpg?s=612x612&w=0&k=20&c=eJZnpIFPfKqWGmsKMnhxR55M9FP1NIF0fQHNuNi0bdg=");
                        Listing listing13 = new Listing("Birthday cake", ListingCategory.CAKE, new BigDecimal(30.00), 10,
                                        "Customisable to your needs.", newImagePath13, 3);
                        
                        List<String> newImagePath14 = new ArrayList<>();
                        newImagePath14.add("https://media.istockphoto.com/id/1075425944/photo/homemade-mushroom-pie.jpg?s=612x612&w=0&k=20&c=IkcjIXOzjSZyytDV1gLL8gNDUCntXCzLVaSGHC-ACL8=");
                        newImagePath14.add("https://media.istockphoto.com/id/592683772/photo/chanterelle-mushroom-cheese-and-thyme-quiche.jpg?s=612x612&w=0&k=20&c=e4SIaRvZzkpdQIU0mRPgs7HY1EYO4yoO_ET8bOLSn-w=");
                        newImagePath14.add("https://media.istockphoto.com/id/1158487509/photo/homemade-omelet-with-asparagus-and-mushrooms.jpg?s=612x612&w=0&k=20&c=0MexkHBjo_4Ik799GPUYlRcxrFU9ZNPMZrsogtHSAW0=");
                        Listing listing14 = new Listing("Mushroom Tart", ListingCategory.SAVORY, new BigDecimal(2.78), 50,
                                        "An eye-catching mushroom tart for an easy but impressive vegetarian main course.", newImagePath14, 3);
                        
                        List<String> newImagePath15 = new ArrayList<>();
                        newImagePath15.add("https://media.istockphoto.com/id/851505358/photo/french-bread-stick-on-a-rustic-table.jpg?s=612x612&w=0&k=20&c=l1SuxI_6xoW5ukK8rNxdrE3ab-n8i2lOB86bm_kKilE=");
                        newImagePath15.add("https://media.istockphoto.com/id/504482233/photo/french-baguettes.jpg?s=612x612&w=0&k=20&c=GbD8q1TwiP4SopH6HwCxSvlad-QiSSi7sDjSI7Tzz0c=");
                        newImagePath15.add("https://media.istockphoto.com/id/931658626/photo/bread-baguettes-in-basket-at-baking-shop.jpg?s=612x612&w=0&k=20&c=rsyg0aaHMY2fPJG-E8SGJaWK_dS7YoiceDW2vVXLnSg=");
                        Listing listing15 = new Listing("French baguette", ListingCategory.BREAD, new BigDecimal(5.00), 5,
                                        "Has a crisp crust.", newImagePath15, 3);
                        
                        List<String> newImagePath16 = new ArrayList<>();
                        newImagePath16.add("https://media.istockphoto.com/id/585303220/photo/sprinkles.jpg?s=612x612&w=0&k=20&c=WOiT7UM38wLFUr6OV34O3uvN6e4_aoIAaypkgG_7ze0=");
                        newImagePath16.add("https://media.istockphoto.com/id/1029892370/photo/red-velvet-cupcake-on-white-wooden-table.jpg?s=612x612&w=0&k=20&c=B3lBNFtsVONriu0rZTPZ388yl1bTfnE1EZeSRT6h1dU=");
                        newImagePath16.add("https://media.istockphoto.com/id/1227176594/photo/lemon-and-poppy-seed-cupcakes-with-cheese-cream-frosting.jpg?s=612x612&w=0&k=20&c=IOSjvfKuUCFBmNov9nhdi6u9nGAKxkpft-CxAwcv-e4=");
                        Listing listing16 = new Listing("Classic cupcakes", ListingCategory.MUFFINCUPCAKE, new BigDecimal(3.00), 50,
                                        "Handmade with love everyday for kids and adults alike to enjoy.", newImagePath16, 3);
                        
                        List<String> newImagePath17 = new ArrayList<>();
                        newImagePath17.add("https://media.istockphoto.com/id/959253190/photo/cauliflower-pizza-crust-with-pesto-kale-mozzarella-cheese-and-greens.jpg?s=612x612&w=0&k=20&c=v_R57qbUbwLLSpWgOpJgsTEy12M0Edmp1wEeA7gdI9A=");
                        newImagePath17.add("https://media.istockphoto.com/id/1272005953/photo/homemade-green-pesto-pizza.jpg?s=612x612&w=0&k=20&c=w8vTYePJTDxVO0CkoDZ9gwUCEepBLE8wOUIqHTzWcRA=");
                        newImagePath17.add("https://media.istockphoto.com/id/827951804/photo/cauliflower-pizza-crust-with-pesto-yellow-tomatoes-zucchini-mozzarella-cheese-and-squash.jpg?s=612x612&w=0&k=20&c=fO1eW_rL1JM3HRjW7VzsF9uRBDND1sKjHMfbouBLLW4=");
                        Listing listing17 = new Listing("Pesto Tart", ListingCategory.PASTRYTART, new BigDecimal(13.30), 5,
                                        "High quality pesto.", newImagePath17, 3);
                        
                        List<String> newImagePath18 = new ArrayList<>();
                        newImagePath18.add("https://media.istockphoto.com/id/471687339/photo/lemon-meringue-pie.jpg?s=612x612&w=0&k=20&c=VRy9erwUzYYmcvS6xOaDSOvbucHPYEvj_hrpcRe-4C0=");
                        newImagePath18.add("https://media.istockphoto.com/id/529600973/photo/key-lime-pie.jpg?s=612x612&w=0&k=20&c=enYpA73wsWKiMAKPTaDNFOSadqSgYTsRK_m-yGTFwXs=");
                        newImagePath18.add("https://media.istockphoto.com/id/513641010/photo/lemon-meringue-pie-on-plate-on-grey-wooden-background.jpg?s=612x612&w=0&k=20&c=syWo0FvLksaGVSvonjhD9ejlquXOF_VaEIN8sIc-V00=");
                        Listing listing18 = new Listing("Lemon Meringue Pie", ListingCategory.PIE, new BigDecimal(19.90), 8,
                                        "A shortened pastry base filled with lemon curd and topped with meringue.", newImagePath18, 3);
                        
                        List<String> newImagePath19 = new ArrayList<>();
                        newImagePath19.add("https://media.istockphoto.com/id/1358804497/photo/coffee-with-cake.jpg?s=612x612&w=0&k=20&c=Kgf2jzshPIIv_WQgpAYTd2F1ZxTw80d8ZIz3GmQL6Ww=");
                        newImagePath19.add("https://media.istockphoto.com/id/172337099/photo/marble-cake-on-square-plate-textured-surface-isolated-background.jpg?s=612x612&w=0&k=20&c=G3SXB6P2H6DydLtAnZcxyh_ZENrbrOxxS5lO1RKDV3A=");
                        newImagePath19.add("https://media.istockphoto.com/id/1234458864/photo/homemade-cake-zebra-with-chocolate-on-rustic-table.jpg?s=612x612&w=0&k=20&c=rLNAMnZYTdLY0IkxWan_SPbxszvx5iuvcJcIE3G1cR0=");
                        Listing listing19 = new Listing("Marble Cake", ListingCategory.CAKE, new BigDecimal(7.50), 9,
                                        "This homemade marble cake is so moist and and buttery.", newImagePath19, 3);
                        
                        List<String> newImagePath20 = new ArrayList<>();
                        newImagePath20.add("https://media.istockphoto.com/id/601009710/photo/onion-quiche-with-camembert-leek-and-eggs.jpg?s=612x612&w=0&k=20&c=Hg0ILCvijJYfC76V6yiZecMCWsOLQiRG1s2vZv2DGpk=");
                        newImagePath20.add("https://media.istockphoto.com/id/1304861589/photo/onion-pie-or-quiche.jpg?s=612x612&w=0&k=20&c=eHlInFnqu1GIEXyJvPzD-CacZcOVAmDYS5JR4Rq3frg=");
                        newImagePath20.add("https://media.istockphoto.com/id/577946862/photo/homemade-cheesy-egg-quiche-for-brunch.jpg?s=612x612&w=0&k=20&c=DN3q4OBQcy994XJLapXYv97jsQ3Q3BjGhrnvcdLBNbs=");
                        Listing listing20 = new Listing("Onion Tart", ListingCategory.SAVORY, new BigDecimal(9.55), 10,
                                        "This simple quiche is a classic veggie favourite.", newImagePath20, 3);
                        
                        List<String> newImagePath21 = new ArrayList<>();
                        newImagePath21.add("https://media.istockphoto.com/id/183848024/photo/loaf-of-fresh-bread.jpg?s=612x612&w=0&k=20&c=w_Myw-z-S3bPYMTWEyOhnjk4y-e8mIu4N1Ox1whc_e4=");
                        newImagePath21.add("https://media.istockphoto.com/id/1181341262/photo/bread-and-jam.jpg?s=612x612&w=0&k=20&c=CCq1fqL8EtNsTOWbFa77KuF2jsPzahAfkq82YSALSgY=");
                        newImagePath21.add("https://media.istockphoto.com/id/1000245924/photo/baker-pulling-a-tray-with-hot-bread.jpg?s=612x612&w=0&k=20&c=XjhRZDBGnppw51R9go8rEVUasZArg-M4Ck10-qMmyFE=");
                        Listing listing21 = new Listing("Pan loaf bread", ListingCategory.BREAD, new BigDecimal(4.50), 10,
                                        "This delicious, fine-grained loaf is perfect for sandwiches and toast.", newImagePath21, 3);
                        
                        List<String> newImagePath22 = new ArrayList<>();
                        newImagePath22.add("https://media.istockphoto.com/id/1128938808/photo/egg-bacon-and-toast-cup-for-breakfast.jpg?s=612x612&w=0&k=20&c=Bm44utOKX_pw8NpX_k8BNT-kGTf-02y02xYMdQaXS3o=");
                        newImagePath22.add("https://media.istockphoto.com/id/1209306680/photo/savory-muffins-with-bacon-quail-egg-green-onion-and-cheese-on-a-grey-stone-background-protein.jpg?s=612x612&w=0&k=20&c=qeHCyF1hcY9jAiDQMKd1y60IXkeXcjrvO1Mo_SElRnI=");
                        newImagePath22.add("https://media.istockphoto.com/id/1061638412/photo/protein-breakfast-egg-muffins.jpg?s=612x612&w=0&k=20&c=7LyjRjV3zP3lKwNRIYvzzjm8MUHweyu0RBZAMLYDqQ4=");
                        Listing listing22 = new Listing("Egg muffin", ListingCategory.MUFFINCUPCAKE, new BigDecimal(3.22), 30,
                                        "It's easy, delicious, freezer friendly.", newImagePath22, 3);
                        
                        List<String> newImagePath23 = new ArrayList<>();
                        newImagePath23.add("https://media.istockphoto.com/id/806355108/photo/cooking-process-of-quiche-lorraine-with-red-leicester-cheese-tr.jpg?s=612x612&w=0&k=20&c=ZXZSBxuctDh3HLaVYayj47y7VUper9_rQxxUdDDP3fs=");
                        newImagePath23.add("https://media.istockphoto.com/id/1186892765/photo/making-homemade-shortcrust-pastry-for-pies-and-cookies.jpg?s=612x612&w=0&k=20&c=uGXnz3zp_t8ewX1GvoFNimryB1N9JFbqSxOxFPDtacc=");
                        newImagePath23.add("https://media.istockphoto.com/id/541852108/photo/slice-of-vanilla-custard-tart-with-pine-nuts-on-top.jpg?s=612x612&w=0&k=20&c=9PVd06NiWGBwzt33mQIZTgQ1IJRwX3_A90349r_FTjQ=");
                        Listing listing23 = new Listing("Shortcrust pastry tart", ListingCategory.PASTRYTART, new BigDecimal(5.00), 50,
                                        "Versatile shortcrust makes terrific tarts, pies and party nibbles.", newImagePath3, 3);
                        
                        List<String> newImagePath24 = new ArrayList<>();
                        newImagePath24.add("https://media.istockphoto.com/id/1256767087/photo/homemade-sweet-sugar-cream-pie.jpg?s=612x612&w=0&k=20&c=8wcn8vt4pq3nX3DBQsyHC1Cgpvu9TGGHuNG4VWTLeQY=");
                        newImagePath24.add("https://media.istockphoto.com/id/164010479/photo/custard-pie.jpg?s=612x612&w=0&k=20&c=qJpjo7DeBLPsEev-q3tn3Njc4EN52dHpFPHqVmdH51Q=");
                        newImagePath24.add("https://media.istockphoto.com/id/1256767099/photo/homemade-sweet-sugar-cream-pie.jpg?s=612x612&w=0&k=20&c=MJeBrqqAJdO7kciWnCwpBk8SQX3h6Q00Chv4zZW7AOI=");
                        Listing listing24 = new Listing("Custard Pie", ListingCategory.PIE, new BigDecimal(9.99), 5,
                                        "An absolute classic, this Custard Pie has a silky smooth egg custard filling made from eggs, milk, and cream.", newImagePath24, 3);
                        
                        List<String> newImagePath25 = new ArrayList<>();
                        newImagePath25.add("https://media.istockphoto.com/id/1263595777/photo/traditional-christmas-fruit-cake-on-a-wooden-board-in-festive-decoration-dark-background.jpg?s=612x612&w=0&k=20&c=pfWQJStDTMOwG_sljGPfKvIfUKxNw6z6hnDPxlD5Yqg=");
                        newImagePath25.add("https://media.istockphoto.com/id/525499661/photo/holiday-fruit-cake.jpg?s=612x612&w=0&k=20&c=S6KFTdYsQnzEv-MQnPnFtXhXGcHsElHKF9JMInfg8d0=");
                        newImagePath25.add("https://media.istockphoto.com/id/610542488/photo/easter-fruitcake-on-the-stone-background.jpg?s=612x612&w=0&k=20&c=qDvowcpZ18-DChVyp_fAxO6dkbpbF1BFXvs08LEt6DQ=");
                        Listing listing25 = new Listing("Fruitcake", ListingCategory.CAKE, new BigDecimal(5.60), 10,
                                        "An easy, rich and moist fruit cake that uses soaked unsweetened fruit and nut mix.", newImagePath25, 3);
                        
                        List<String> newImagePath26 = new ArrayList<>();
                        newImagePath26.add("https://media.istockphoto.com/id/1393769670/photo/asparagus-tart.jpg?s=612x612&w=0&k=20&c=xFgCD7L-AEMaxEK1GHDWZ8bS3jp_fLxQZXq_M1NIc7E=");
                        newImagePath26.add("https://media.istockphoto.com/id/482565088/photo/asparagus-quiche-with-pecorino-and-bacon.jpg?s=612x612&w=0&k=20&c=zqq0luctdjao1CfjAVSOEeD9gHOZu7elzyI2Cqe8hco=");
                        newImagePath26.add("https://media.istockphoto.com/id/1309322376/photo/baked-green-asparagus-wrapped-in-puff-pastry-served-on-wooden-board-with-selective-focus.jpg?s=612x612&w=0&k=20&c=CzBR0yhV10jPyYUMH41eb6tR8fpXpUoNYGqbpTAeKL4=");
                        Listing listing26 = new Listing("Asparagus & Chesse tart", ListingCategory.SAVORY, new BigDecimal(8.80), 10,
                                        "Classic British flavours in this springtime quiche.", newImagePath26, 3);
                        
                        List<String> newImagePath27 = new ArrayList<>();
                        newImagePath27.add("https://media.istockphoto.com/id/537404677/photo/coconut-snail-pastry-after-finish-on-tray.jpg?s=612x612&w=0&k=20&c=m0U3OMRM710lRcEE0ddBTSPqV8c3in1pRg2NwBsMrbo=");
                        newImagePath27.add("https://media.istockphoto.com/id/1432191804/photo/cinnamon-rolls-with-chrysanthemum-tea-on-white-background-clipping-path.jpg?s=612x612&w=0&k=20&c=hWR78a_SPQFrrSZm70fv1aS5AUkmkOTbyA6VoszF7lQ=");
                        newImagePath27.add("https://media.istockphoto.com/id/1371060940/photo/wheat-fresh-bun-with-filling-cut-into-pieces.jpg?s=612x612&w=0&k=20&c=zYrQSZQdZww1Mp_LcdTfeL2R1JoL3yNPG6RNYflxbM8=");
                        Listing listing27 = new Listing("Coconut sweet buns", ListingCategory.BREAD, new BigDecimal(4.40), 10,
                                        "Freshly baked sweet buns.", newImagePath27, 3);
                        
                        List<String> newImagePath28 = new ArrayList<>();
                        newImagePath28.add("https://media.istockphoto.com/id/516688047/photo/homemade-autumn-pumpkin-muffin.jpg?s=612x612&w=0&k=20&c=wbzrNN3oX-F4Q1rZJAeDLH9EKJfnHk9yyaJqIJbkV_U=");
                        newImagePath28.add("https://media.istockphoto.com/id/492576228/photo/torn-open-pumpkin-muffin.jpg?s=612x612&w=0&k=20&c=gTLZpYBnqTZ6DY2yU2VRASuTpC_M3G-PPqVV19SLUpQ=");
                        newImagePath28.add("https://media.istockphoto.com/id/847804498/photo/muffins-with-spinach-feta-cheese-pumpkin-seeds-and-sesame-seeds.jpg?s=612x612&w=0&k=20&c=okE4CD95MwqnblBPSOYQRgj8jRE4q6Yeqdk5eFUh2Ns=");
                        Listing listing28 = new Listing("Pumpkin spice muffins", ListingCategory.MUFFINCUPCAKE, new BigDecimal(4.60), 50,
                                        "Cinnamon spiced pumpkin muffins for a mid-morning snack.", newImagePath28, 3);
                        
                        List<String> newImagePath29 = new ArrayList<>();
                        newImagePath29.add("https://media.istockphoto.com/id/182290631/photo/slice-of-neapolitan-pastiera-tart.jpg?s=612x612&w=0&k=20&c=cmiQ3lTb97G10x66m4mi2ijsTNhzNnKH09r1gJr1c4c=");
                        newImagePath29.add("https://media.istockphoto.com/id/806355108/photo/cooking-process-of-quiche-lorraine-with-red-leicester-cheese-tr.jpg?s=612x612&w=0&k=20&c=ZXZSBxuctDh3HLaVYayj47y7VUper9_rQxxUdDDP3fs=");
                        newImagePath29.add("https://media.istockphoto.com/id/1187807331/photo/making-homemade-christmas-cookies-the-dough-and-shape-on-a-dark-background.jpg?s=612x612&w=0&k=20&c=SS6DT_n2UcWFLMoiRC1alTivGKEksPUZaaMhVZPDiyI=");
                        Listing listing29 = new Listing("Sweet Shortcrust Pastry Tart", ListingCategory.PASTRYTART, new BigDecimal(5.00), 5,
                                        "Delicious and good.", newImagePath29, 3);
                        
                        List<String> newImagePath30 = new ArrayList<>();
                        newImagePath30.add("https://media.istockphoto.com/id/181957045/photo/homemade-raspberry-pie-with-slice-cut-out.jpg?s=612x612&w=0&k=20&c=1OAQzSCF_CDZtiZHDgyW8xB7FKRW1CX-tilIvstN-3E=");
                        newImagePath30.add("https://media.istockphoto.com/id/1223139298/photo/high-angle-photograph-of-a-lattice-fruit-pie.jpg?s=612x612&w=0&k=20&c=lwaPyMjxqsfIC34Q9EQDWgoND15kDDbBGrkyzW5fojk=");
                        newImagePath30.add("https://media.istockphoto.com/id/1223003408/photo/blueberry-cake-top-view-woman-taking-a-slice-of-pie.jpg?s=612x612&w=0&k=20&c=jOL9hw7oaG0pLBfJalBMv8UrQ0Ki2FTTzQkvO2pWclc=");
                        Listing listing30 = new Listing("Double-crust fruit pie", ListingCategory.PIE, new BigDecimal(15.60), 20,
                                        "Flaky, buttery goodness, plus juicy fruit fillings you'll crave.", newImagePath30, 3);
                        
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

                        Admin admin1 = new Admin("Admin John", "admin@gmail.com", "password");
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
