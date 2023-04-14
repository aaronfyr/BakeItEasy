/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import enumeration.ListingCategory;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.json.bind.annotation.JsonbTransient;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

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

    @Column(nullable = false, length = 64)
    @NotNull
    @Size(min = 1, max = 64)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull
    private ListingCategory listingCategory;

    @Column(nullable = false)
    @NotNull
    @DecimalMin("0.00")
    private BigDecimal price;

    @Min(0)
    @NotNull
    private Integer maxQuantity;

    @Column(nullable = false, length = 512)
    @NotNull
    @Size(min = 1, max = 512)
    private String description;

    @Column
    private List<String> imagePaths; // might need to change or swap to front end?
    /*@Column
    private String videoPath;    */

    @Temporal(TemporalType.TIMESTAMP)
    @Column
    private Date dateOfCreation;

    @Min(0)
    @NotNull
    private Integer minPrepDays;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false)
    @JsonbTransient
    private Seller seller;

    @OneToMany(mappedBy = "listing", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonbTransient
    private List<Order> orders;

    @ManyToMany
    @JsonbTransient
    private List<Buyer> likers;

    public Listing() {
        this.dateOfCreation = new Date(System.currentTimeMillis());
        this.orders = new ArrayList<>();
        this.likers = new ArrayList<>();
    }

    public Listing(String name, ListingCategory listingCategory, BigDecimal price, Integer quantityLeft, String description, List<String> imagePaths, Integer minPrepDays) {
        this();
        this.name = name;
        this.listingCategory = listingCategory;
        this.price = price;
        this.maxQuantity = quantityLeft;
        this.description = description;
        this.imagePaths = imagePaths;
        this.minPrepDays = minPrepDays;
    }

    public Long getListingId() {
        return listingId;
    }

    public void setListingId(Long listingId) {
        this.listingId = listingId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ListingCategory getListingCategory() {
        return listingCategory;
    }

    public void setListingCategory(ListingCategory listingCategory) {
        this.listingCategory = listingCategory;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getMaxQuantity() {
        return maxQuantity;
    }

    public void setMaxQuantity(Integer maxQuantity) {
        this.maxQuantity = maxQuantity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getImagePaths() {
        return imagePaths;
    }

    public void setImagePaths(List<String> imagePaths) {
        this.imagePaths = imagePaths;
    }

    public Date getDateOfCreation() {
        return dateOfCreation;
    }

    public void setDateOfCreation(Date dateOfCreation) {
        this.dateOfCreation = dateOfCreation;
    }

    public Integer getMinPrepDays() {
        return minPrepDays;
    }

    public void setMinPrepDays(Integer minPrepDays) {
        this.minPrepDays = minPrepDays;
    }

    public Seller getSeller() {
        return seller;
    }

    public void setSeller(Seller seller) {
        this.seller = seller;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }

    public List<Buyer> getLikers() {
        return likers;
    }

    public void setLikers(List<Buyer> likers) {
        this.likers = likers;
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
