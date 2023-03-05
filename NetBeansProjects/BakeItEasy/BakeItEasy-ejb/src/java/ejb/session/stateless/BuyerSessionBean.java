/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.Buyer;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

/**
 *
 * @author Uni
 */
@Stateless
public class BuyerSessionBean implements BuyerSessionBeanLocal {

    @PersistenceContext(unitName = "BakeItEasy-ejbPU")
    private EntityManager em;

   @Override
    public List<Buyer> searchBuyers(String name) {
        Query q;
        if (name != null) {
            q = em.createQuery("SELECT b FROM Buyer b WHERE "
                    + "LOWER(b.name) LIKE :name");
            q.setParameter("name", "%" + name.toLowerCase() + "%");
        } else {
            q = em.createQuery("SELECT b FROM Buyer b");
        }

        return q.getResultList();
    }
}
