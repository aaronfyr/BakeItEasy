/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import java.io.Serializable;
import java.util.Date;
import javax.json.bind.annotation.JsonbTransient;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 *
 * @author Uni
 */
@Entity
public class Comment implements Serializable {   

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId;

    @Column(nullable = false, length = 128)
    @NotNull
    @Size(min = 1, max = 128)
    private String title;

    @Temporal(TemporalType.TIMESTAMP)
    @Column
    private Date dateCreated;
    
    @NotNull
    private boolean isBuyer;
    
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false)
    @JsonbTransient
    private Post post;
    
    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    @JoinColumn(nullable = true)
    @JsonbTransient
    private Buyer buyer;
    
    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    @JoinColumn(nullable = true)
    @JsonbTransient
    private Seller seller;

    public Comment() {
        this.dateCreated = new Date(System.currentTimeMillis());
    }
    
    public Comment(String title, boolean isBuyer) {
        this.title = title;
        this.isBuyer = isBuyer;
    }
    
        public Long getCommentId() {
        return commentId;
    }

    public void setCommentId(Long commentId) {
        this.commentId = commentId;
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

    public boolean isIsBuyer() {
        return isBuyer;
    }

    public void setIsBuyer(boolean isBuyer) {
        this.isBuyer = isBuyer;
    }

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
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
        hash += (commentId != null ? commentId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the commentId fields are not set
        if (!(object instanceof Comment)) {
            return false;
        }
        Comment other = (Comment) object;
        if ((this.commentId == null && other.commentId != null) || (this.commentId != null && !this.commentId.equals(other.commentId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.Comment[ id=" + commentId + " ]";
    }

}
