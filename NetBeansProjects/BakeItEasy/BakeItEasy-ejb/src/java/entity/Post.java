/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import enumeration.PostCategory;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.json.bind.annotation.JsonbTransient;
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
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlTransient;

/**
 *
 * @author Uni
 */
@Entity
public class Post implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postId;
    
    @Column(nullable = false, length = 256)
    @NotNull
    @Size(min = 1, max = 256)
    private String title;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column
    private Date dateCreated;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull
    private PostCategory postCategory;
    
    @NotNull
    private boolean isBuyer;
    
    @OneToMany(mappedBy = "post", fetch = FetchType.EAGER)
    @JsonbTransient
    private List<Comment> comments;
    
    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    @JoinColumn(nullable = true)
    @JsonbTransient
    private Buyer buyer;
    
    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    @JoinColumn(nullable = true)
    @JsonbTransient
    private Seller seller;

    public Post() {
        this.dateCreated = new Date(System.currentTimeMillis());
        this.comments = new ArrayList<>();
    }
    
    public Post(String title, PostCategory postCategory, boolean isBuyer) {
        this();
        this.title = title;
        this.postCategory = postCategory;
        this.isBuyer = isBuyer;
    }

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public PostCategory getPostCategory() {
        return postCategory;
    }

    public void setPostCategory(PostCategory postCategory) {
        this.postCategory = postCategory;
    }

    public boolean isIsBuyer() {
        return isBuyer;
    }

    public void setIsBuyer(boolean isBuyer) {
        this.isBuyer = isBuyer;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public Buyer getBuyer() {
        return buyer;
    }

    public void setBuyer(Buyer buyer) {
        this.buyer = buyer;
    }

    public Seller getSeller() {
        return seller;
    }

    public void setSeller(Seller seller) {
        this.seller = seller;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (postId != null ? postId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the postId fields are not set
        if (!(object instanceof Post)) {
            return false;
        }
        Post other = (Post) object;
        if ((this.postId == null && other.postId != null) || (this.postId != null && !this.postId.equals(other.postId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.pOST[ id=" + postId + " ]";
    }
    
}
