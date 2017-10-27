package com.trp.pub.cust.rest;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import org.apache.log4j.Logger;

import com.trp.pub.cust.util.Executor;

@Provider
public class ThrowableExceptionMapper implements ExceptionMapper<Throwable> {
    private static final Logger LOGGER = Logger.getLogger(Executor.class
            .getName());
    private static final String BR = "<br>";
    
    @Override
    public Response toResponse(Throwable t) {
        LOGGER.error(t);
        if (t instanceof WebApplicationException) {
            return ((WebApplicationException) t).getResponse();
        } else {
            return buildResponse(t);
        }
    }
   
    public static Response buildResponse(Throwable t) {
        StringBuilder sb = new StringBuilder();
        sb.append(t.toString());
        addStackTraceLines(sb, t);
        if(t.getCause() != null) {
            sb.append(BR);
            sb.append("Cause: ");
            addStackTraceLines(sb, t.getCause());
            if(t.getCause().getCause() != null) {
                sb.append(BR);
                sb.append("Cause: ");
                addStackTraceLines(sb, t.getCause().getCause());
            }
        }
       
       
        return Response
                .status(Status.INTERNAL_SERVER_ERROR)
                .entity(sb.toString())
                .type(MediaType.TEXT_PLAIN).build();
    }
    
    private static void addStackTraceLines(StringBuilder sb, Throwable t) {
        for(int i = 0; i < 5 && i<t.getStackTrace().length; i++ ){
            sb.append(BR);
            sb.append(t.getStackTrace()[i].toString());          
        }
        sb.append(BR);
        sb.append("...");
        sb.append(BR);
    }


}
