/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

/**
 *
 * @author Uni
 */
@Entity
public class Seller implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sellerId;

    @Column
    private String name;
    @Column
    private String email;
    @Column
    private String username;
    @Column
    private String password;
    @Column
    private String phoneNo;
    @Column
    private boolean isBanned;

    @OneToMany(mappedBy = "seller")
    private List<Review> reviews; // can access from listings
    @OneToMany(mappedBy = "seller")
    private List<Order> orders; // can access from listings
    @OneToMany(mappedBy = "seller")
    private List<Listing> listings;
    @OneToMany(mappedBy = "reportee")
    private List<Report> reports;
    @OneToMany(mappedBy = "seller")
    private List<Post> posts;
    @OneToMany(mappedBy = "seller")
    private List<Comment> comments; // if we want to let them find which comments they made?
    @OneToMany(mappedBy = "seller")
    private List<Appointment> appointments;

    public Seller() {
        this.isBanned = false;
        this.reviews = new ArrayList<>();
        this.orders = new ArrayList<>();
        this.listings = new ArrayList<>();
        this.reports = new ArrayList<>();
        this.posts = new ArrayList<>();
        this.comments = new ArrayList<>();
        this.appointments = new ArrayList<>();
    }

    public Seller(String name, String email, String username, String password, String phoneNo) {
        this();
        
        this.name = name;
        this.email = email;
        this.username = username;
        this.password = password;
        this.phoneNo = phoneNo;
    }
    
    


    public Long getSellerId() {
        return sellerId;
    }

    public void setSellerId(Long sellerId) {
        this.sellerId = sellerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhoneNo() {
        return phoneNo;
    }

    public void setPhoneNo(String phoneNo) {
        this.phoneNo = phoneNo;
    }

    public boolean isIsBanned() {
        return isBanned;
    }

    public void setIsBanned(boolean isBanned) {
        this.isBanned = isBanned;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }

    public List<Listing> getListings() {
        return listings;
    }

    public void setListings(List<Listing> listings) {
        this.listings = listings;
    }

    public List<Report> getReports() {
        return reports;
    }

    public void setReports(List<Report> reports) {
        this.reports = reports;
    }

    public List<Post> getPosts() {
        return posts;
    }

    public void setPosts(List<Post> posts) {
        this.posts = posts;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }
    
    public List<Appointment> getAppointments() {
        return appointments;
    }

    public void setAppointments(List<Appointment> appointments) {
        this.appointments = appointments;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (sellerId != null ? sellerId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the sellerId fields are not set
        if (!(object instanceof Seller)) {
            return false;
        }
        Seller other = (Seller) object;
        if ((this.sellerId == null && other.sellerId != null) || (this.sellerId != null && !this.sellerId.equals(other.sellerId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.Seller[ id=" + sellerId + " ]";
    }

}
