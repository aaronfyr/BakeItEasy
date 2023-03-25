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
 * @author aaronf
 */
@Entity
public class Buyer implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long buyerId;

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
    @Column(nullable = true)
    private String address;

    @OneToMany(mappedBy = "buyer")
    private List<Review> reviews; // can access from orders
    @OneToMany(mappedBy = "buyer")
    private List<Order> orders;
    @OneToMany(mappedBy = "reporter")
    private List<Report> reports;
    @OneToMany(mappedBy = "buyer")
    private List<Post> posts;
    @OneToMany(mappedBy = "buyer")
    private List<Comment> comments; // if we want to let them find which comments they made?

    public Buyer() {
        this.isBanned = false;
        this.reviews = new ArrayList<>();
        this.orders = new ArrayList<>();
        this.reports = new ArrayList<>();
        this.posts = new ArrayList<>();
        this.comments = new ArrayList<>();
    }
    
    

    public Buyer(String name, String email, String username, String password, String phoneNo, String address) {
        this();
        
        this.name = name;
        this.email = email;
        this.username = username;
        this.password = password;
        this.phoneNo = phoneNo;
        this.address = address;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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

    public List<Report> getReports() {
        return reports;
    }

    public void setReports(List<Report> reports) {
        this.reports = reports;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public Long getBuyerId() {
        return buyerId;
    }

    public void setBuyerId(Long buyerId) {
        this.buyerId = buyerId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (buyerId != null ? buyerId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the buyerId fields are not set
        if (!(object instanceof Buyer)) {
            return false;
        }
        Buyer other = (Buyer) object;
        if ((this.buyerId == null && other.buyerId != null) || (this.buyerId != null && !this.buyerId.equals(other.buyerId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.Placeholder[ id=" + buyerId + " ]";
    }

}
