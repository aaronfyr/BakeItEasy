/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import enumeration.ListingCategory;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

/**
 *
 * @author Uni
 */
@Entity
public class Listing implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long listingId;

    @Column
    private String name;
    @Column
    private BigDecimal price;
    @Column
    private Integer quantityLeft;
    @Column
    private String description;
    @Column
    private List<String> imagePaths; // might need to change or swap to front end?
    /*@Column
    private String videoPath;    */

    @Column
    private ListingCategory listingCategory;

    @OneToOne(optional = true)
    private Seller seller;

    @OneToMany(mappedBy = "listing")
    private List<Order> orders;
    @OneToMany(mappedBy = "listing")
    private List<Review> reviews;

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

    public Seller getSeller() {
        return seller;
    }

    public void setSeller(Seller seller) {
        this.seller = seller;
    }

    public List<String> getImagePaths() {
        return imagePaths;
    }

    public void setImagePaths(List<String> imagePaths) {
        this.imagePaths = imagePaths;
    }

    public ListingCategory getListingCategory() {
        return listingCategory;
    }

    public void setListingCategory(ListingCategory listingCategory) {
        this.listingCategory = listingCategory;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getQuantityLeft() {
        return quantityLeft;
    }

    public void setQuantityLeft(Integer quantityLeft) {
        this.quantityLeft = quantityLeft;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getImages() {
        return imagePaths;
    }

    public void setImages(List<String> images) {
        this.imagePaths = images;
    }

    public Long getListingId() {
        return listingId;
    }

    public void setListingId(Long listingId) {
        this.listingId = listingId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (listingId != null ? listingId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the listingId fields are not set
        if (!(object instanceof Listing)) {
            return false;
        }
        Listing other = (Listing) object;
        if ((this.listingId == null && other.listingId != null) || (this.listingId != null && !this.listingId.equals(other.listingId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.Listing[ id=" + listingId + " ]";
    }

}
