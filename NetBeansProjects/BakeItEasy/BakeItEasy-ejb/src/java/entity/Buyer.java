/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.json.bind.annotation.JsonbTransient;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotNull;
import javax.xml.bind.annotation.XmlTransient;

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
    @Column(nullable = false, unique = true)
    @NotNull
    private String email;
    @Column(nullable = false, unique = true)
    @NotNull
    private String username;
    @Column
    private String password;
    @Column(nullable = false, unique = true)
    @NotNull
    private String phoneNo;
    @Column
    private boolean isBanned;
    @Column(nullable = true)
    private String address;

    @OneToMany(mappedBy = "buyer", fetch = FetchType.EAGER)
    @JsonbTransient
    private List<Order> orders;
    @OneToMany(mappedBy = "reporter", fetch = FetchType.EAGER)
    @JsonbTransient
    private List<Report> reports;
    @OneToMany(mappedBy = "buyer", fetch = FetchType.EAGER)
    @JsonbTransient
    private List<Post> posts;
    @ManyToMany(mappedBy = "likers", fetch = FetchType.EAGER)
    @JsonbTransient
    private List<Listing> likedListings;
    @ManyToMany(mappedBy = "followers", fetch = FetchType.EAGER)
    @JsonbTransient
    private List<Seller> followings;
    @OneToMany(mappedBy = "buyer", fetch = FetchType.EAGER)
    @JsonbTransient
    private List<Comment> comments;

    public Buyer() {
        this.isBanned = false;
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
    
    public Long getBuyerId() {
        return buyerId;
    }

    public void setBuyerId(Long buyerId) {
        this.buyerId = buyerId;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
    
    @XmlTransient
    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }
    
    @XmlTransient
    public List<Report> getReports() {
        return reports;
    }

    public void setReports(List<Report> reports) {
        this.reports = reports;
    }
    
    @XmlTransient
    public List<Post> getPosts() {
        return posts;
    }

    public void setPosts(List<Post> posts) {
        this.posts = posts;
    }
    
    @XmlTransient
    public List<Listing> getLikedListings() {
        return likedListings;
    }

    public void setLikedListings(List<Listing> likedListings) {
        this.likedListings = likedListings;
    }
    
    @XmlTransient
    public List<Seller> getFollowings() {
        return followings;
    }

    public void setFollowings(List<Seller> followings) {
        this.followings = followings;
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

    /**
     * @return the comments
     */
    public List<Comment> getComments() {
        return comments;
    }

    /**
     * @param comments the comments to set
     */
    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

}
