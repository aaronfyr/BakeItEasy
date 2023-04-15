/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import enumeration.OrderStatus;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
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
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Digits;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 *
 * @author Uni
 */
@Entity
@javax.persistence.Table(name = "\"Order\"")
public class Order implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @Column(nullable = false)
    @NotNull
    @DecimalMin("0.00")
    private BigDecimal price;

    @Min(0)
    @NotNull
    private Integer quantity;

    @Column(nullable = false, length = 512)
    @NotNull
    @Size(min = 1, max = 512)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull
    private OrderStatus orderStatus;

    @Column(nullable = false, length = 256)
    @NotNull
    @Size(max = 256)
    private String address;

    @Temporal(TemporalType.TIMESTAMP)
    @Column
    private Date dateOfCreation;

    @Temporal(TemporalType.TIMESTAMP)
    @Column
    private Date dateOfCollection;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false)
    @JsonbTransient
    private Listing listing;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false)
    @JsonbTransient
    private Buyer buyer;

    @OneToOne(mappedBy = "order", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonbTransient
    private Review review;

    public Order() {
        this.orderStatus = OrderStatus.PENDING;
    }
    
    public Order(BigDecimal price, Integer quantity, String description, String address, Date dateOfCreation, Date dateOfCollection) {
        this();
        this.price = price;
        this.quantity = quantity;
        this.description = description;
        this.address = address;
        this.dateOfCreation = dateOfCreation;
        this.dateOfCollection = dateOfCollection;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public OrderStatus getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(OrderStatus orderStatus) {
        this.orderStatus = orderStatus;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Date getDateOfCreation() {
        return dateOfCreation;
    }

    public void setDateOfCreation(Date dateOfCreation) {
        this.dateOfCreation = dateOfCreation;
    }

    public Date getDateOfCollection() {
        return dateOfCollection;
    }

    public void setDateOfCollection(Date dateOfCollection) {
        this.dateOfCollection = dateOfCollection;
    }

    public Listing getListing() {
        return listing;
    }

    public void setListing(Listing listing) {
        this.listing = listing;
    }

    public Buyer getBuyer() {
        return buyer;
    }

    public void setBuyer(Buyer buyer) {
        this.buyer = buyer;
    }

    public Review getReview() {
        return review;
    }

    public void setReview(Review review) {
        this.review = review;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (orderId != null ? orderId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the orderId fields are not set
        if (!(object instanceof Order)) {
            return false;
        }
        Order other = (Order) object;
        if ((this.orderId == null && other.orderId != null) || (this.orderId != null && !this.orderId.equals(other.orderId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.Order[ id=" + orderId + " ]";
    }

}
