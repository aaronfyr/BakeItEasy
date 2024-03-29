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
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlTransient;

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

    @Column(nullable = false, length = 64)
    @NotNull
    @Size(min = 1, max = 64)
    private String name;
    
    @Column(nullable = false, length = 128, unique = true)
    @NotNull
    @Size(min = 1, max = 128)
    private String email;
    
    @Column(nullable = false, length = 16, unique = true)
    @NotNull
    @Size(min = 1, max = 16)
    private String username;
    
    @Column(nullable = false, length = 64)
    @NotNull
    @Size(min = 1, max = 64)
    private String password;
    
    @Column(nullable = false, length = 128, unique = true)
    @NotNull
    @Size(min = 1, max = 128)
    private String phoneNo;
    
    @NotNull
    private boolean isBanned;
    
    @Column(nullable = true)
    private String imagePath;

    @OneToMany(mappedBy = "seller", fetch = FetchType.EAGER)
    @JsonbTransient
    private List<Listing> listings;
    
    @OneToMany(mappedBy = "reportee", fetch = FetchType.EAGER)
    @JsonbTransient
    private List<Report> reports;
    
    @OneToMany(mappedBy = "seller", fetch = FetchType.EAGER)
    @JsonbTransient
    private List<Post> posts;
    
    @ManyToMany
    @JsonbTransient
    private List<Buyer> followers;
    
    @OneToMany(mappedBy = "seller", fetch = FetchType.EAGER)
    @JsonbTransient
    private List<Comment> comments;
    
    public Seller() {
        this.isBanned = false;
        this.listings = new ArrayList<>();
        this.reports = new ArrayList<>();
        this.posts = new ArrayList<>();
        this.followers = new ArrayList<>();
        this.comments = new ArrayList<>();
    }

    public Seller(String name, String email, String username, String password, String phoneNo, String imagePath) {
        this();
        
        this.name = name;
        this.email = email;
        this.username = username;
        this.password = password;
        this.phoneNo = phoneNo;
        this.imagePath = imagePath;
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

    public boolean getIsBanned() {
        return isBanned;
    }

    public void setIsBanned(boolean isBanned) {
        this.isBanned = isBanned;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
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

    public List<Buyer> getFollowers() {
        return followers;
    }

    public void setFollowers(List<Buyer> followers) {
        this.followers = followers;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
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
