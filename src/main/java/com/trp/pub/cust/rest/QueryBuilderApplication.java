package com.trp.pub.cust.rest;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.ApplicationPath;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.log4j.Logger;
import org.codehaus.jackson.jaxrs.JacksonJsonProvider;

import com.trp.pub.cust.rest.func.AdminService;
import com.trp.pub.cust.rest.func.PubBuilderModifyService;
import com.trp.pub.cust.rest.func.PubBuilderRestService;
import com.trp.pub.cust.rest.func.QueryBuilderExecuteService;
import com.trp.pub.cust.rest.func.QueryBuilderModifyService;
import com.trp.pub.cust.rest.func.QueryBuilderRestService;
import com.trp.pub.cust.util.Executor;

@ApplicationPath("qb")
public class QueryBuilderApplication extends Application {
    public static final String AUTH = "Authorization";
    public static final String LOGGED_IN_USER = "loggedInUser";
    public static final String GROUP_OPTIONS = "groupOptions";
    private static final Logger LOGGER = Logger.getLogger(QueryBuilderApplication.class
            .getName());

    
    private Set<Object> singletons = new HashSet<Object>();

    public QueryBuilderApplication() {
        singletons.add(new QueryBuilderRestService());
        singletons.add(new QueryBuilderModifyService());
        singletons.add(new QueryBuilderExecuteService());
        singletons.add(new AdminService());
        singletons.add(new JacksonJsonProvider());
        singletons.add(new ThrowableExceptionMapper());
        singletons.add(new PubBuilderRestService());
        singletons.add(new PubBuilderModifyService());
    }

    @Override
    public Set<Object> getSingletons() {
        return singletons;
    }
    
    public static String getSessionAttr (HttpSession session, String attrName) {
        String attrValue =  (String) session.getAttribute(attrName);
        if (attrValue != null) {
            return attrValue;
        }
        LOGGER.debug("getSessionAttr found null Value for" + attrName );
        throw new WebApplicationException(Response
                .status(Status.UNAUTHORIZED)
                .entity("Session is no longer active. Please start a new session from the home page ")
                .type(MediaType.TEXT_PLAIN).build());
    }
    
    public static List<String> getGroupOptions (HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        @SuppressWarnings("unchecked")
        ArrayList<String> groupOptions = (ArrayList<String>) session.getAttribute(GROUP_OPTIONS);
        if (groupOptions == null ) {
            groupOptions = (ArrayList<String>) Executor._instance.getGroupOptions(QueryBuilderApplication.getSessionAttr(session, QueryBuilderApplication.LOGGED_IN_USER));
            session.setAttribute(GROUP_OPTIONS, groupOptions);
        }
        return groupOptions;
    }
    
    public static void checkOwnerOrGroupOrAdmin(String objectOwner, HttpServletRequest request) {        
        //check if user is Admin
        if (request.isUserInRole("QueryBuilderAdmin")) {
            return;
        }
        //check if user is the owner
        HttpSession session = request.getSession(false);
        String user = QueryBuilderApplication.getSessionAttr(session, QueryBuilderApplication.LOGGED_IN_USER);
        if (user.equals(objectOwner)) {
            return;
        }
        //check if user is in the group
        List<String> groupOptions = QueryBuilderApplication.getGroupOptions(request);
        for(String group : groupOptions) {
            if(group.equals(objectOwner)) {
                return;
            }
        }
        //no criteria met. Throw 403 - forbidden exception
        throw new WebApplicationException(Response
                .status(Status.UNAUTHORIZED)
                .entity("User: " + user + " should be an Admin, or owner, or a member the owning group of the Template")
                .type(MediaType.TEXT_PLAIN).build());
    }
}
