/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import java.util.Set;
import javax.ws.rs.core.Application;

/**
 *
 * @author Uni
 */
@javax.ws.rs.ApplicationPath("webresources")
public class ApplicationConfig extends Application {

    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> resources = new java.util.HashSet<>();
        addRestResourceClasses(resources);
        return resources;
    }

    /**
     * Do not modify addRestResourceClasses() method.
     * It is automatically populated with
     * all resources defined in the project.
     * If required, comment out calling this method in getClasses().
     */
    private void addRestResourceClasses(Set<Class<?>> resources) {
        resources.add(webservices.restful.AdminsResource.class);
        resources.add(webservices.restful.BuyersResource.class);
        resources.add(webservices.restful.CORSFilter.class);
        resources.add(webservices.restful.ListingsResource.class);
        resources.add(webservices.restful.OrdersResource.class);
        resources.add(webservices.restful.PostsResource.class);
        resources.add(webservices.restful.ReportsResource.class);
        resources.add(webservices.restful.ReviewsResource.class);
        resources.add(webservices.restful.SellersResource.class);
    }
    
}
