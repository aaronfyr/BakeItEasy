/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import ejb.session.stateless.AppointmentSessionBeanLocal;
import entity.Appointment;
import error.exception.AppointmentNotFoundException;
import java.util.List;
import javax.ejb.EJB;
import javax.ws.rs.Produces;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.enterprise.context.RequestScoped;
import javax.json.Json;
import javax.json.JsonObject;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * REST Web Service
 *
 * @author aaronf
 */
@Path("appointments")
@RequestScoped
public class AppointmentsResource {
    @EJB
    private AppointmentSessionBeanLocal appointmentSessionBeanLocal;
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Appointment> getAllAppointments() {
        return appointmentSessionBeanLocal.retrieveAllAppointments();
    } // end get all appointments
    
    @GET
    @Path("/{appointment_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getSpecificAppointment(@PathParam("appointment_id") Long appointmentId) {
        try {
            Appointment appointment = appointmentSessionBeanLocal.retrieveAppointmentByAppointmentId(appointmentId);
            return Response.status(200).entity(appointment).type(MediaType.APPLICATION_JSON).build();
        } catch (AppointmentNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "Not found")
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        }
    } // end get specific appointment

}
