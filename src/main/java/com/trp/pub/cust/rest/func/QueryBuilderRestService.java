package com.trp.pub.cust.rest.func;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.trp.pub.cust.model.EntityAttr;
import com.trp.pub.cust.model.QueryTemplate;
import com.trp.pub.cust.model.xml1.TemplateKeys.TemplateKey;
import com.trp.pub.cust.rest.QueryBuilderApplication;
import com.trp.pub.cust.util.Executor;

@Path("/builder")
public class QueryBuilderRestService {

    @GET
    @Path("/getEnvs")
    @Produces(MediaType.APPLICATION_JSON)
    public List<String> getEnvs() {
        return Executor._instance.getEnvs();
    }

    @GET
    @Path("/getPubEntities")
    @Produces(MediaType.APPLICATION_JSON)
    public List<String> getPubEntities(@Context HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        return Executor._instance.getPubEntities(QueryBuilderApplication
                .getSessionAttr(session, QueryBuilderApplication.AUTH));
    }

    @GET
    @Path("/getEntityAttrs")
    @Produces(MediaType.APPLICATION_JSON)
    public List<EntityAttr> getEntityAttrs(@QueryParam("entity") String entity,
            @Context HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        return Executor._instance.getEntityAtts(entity, QueryBuilderApplication
                .getSessionAttr(session, QueryBuilderApplication.AUTH));
    }

    @GET
    @Path("/getOwnerOptions")
    @Produces(MediaType.APPLICATION_JSON)
    public List<String> getOwnerOptions(@Context HttpServletRequest request) {
        List<String> ownerOptions = new ArrayList<String>();
        HttpSession session = request.getSession(false);
        List<String> groupOptions = QueryBuilderApplication
                .getGroupOptions(request);
        ownerOptions.addAll(groupOptions);

        ownerOptions.add(QueryBuilderApplication.getSessionAttr(session,
                QueryBuilderApplication.LOGGED_IN_USER));
        return ownerOptions;
    }

    @GET
    @Path("/getLoggedInUser")
    @Produces(MediaType.TEXT_PLAIN)
    public String getLoggedInUser(@Context HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        return QueryBuilderApplication.getSessionAttr(session,
                QueryBuilderApplication.LOGGED_IN_USER);
    }

    @GET
    @Path("/getQueryTemplateKeys/{owner}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<TemplateKey> getQueryTemplateKeys(
            @PathParam("owner") String owner,
            @Context HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        return Executor._instance.getQueryTemplateKeys(owner,
                QueryBuilderApplication.getSessionAttr(session,
                        QueryBuilderApplication.AUTH));
    }

    @GET
    @Path("/getQueryTemplateFromKey/{owner}/{name}")
    @Produces(MediaType.APPLICATION_JSON)
    public QueryTemplate getQueryTemplateFromKey(
            @PathParam("owner") String owner, @PathParam("name") String name,
            @Context HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        return Executor._instance.getQueryTemplateFromKey(owner, name,
                QueryBuilderApplication.getSessionAttr(session,
                        QueryBuilderApplication.AUTH));
    }

    @GET
    @Path("/getGroupOptions")
    @Produces(MediaType.APPLICATION_JSON)
    public List<String> getGroupOptions(@Context HttpServletRequest request) {
        return QueryBuilderApplication.getGroupOptions(request);
    }

    @POST
    @Path("/getQueryTemplatesFromKeys")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<QueryTemplate> getQueryTemplatesFromKeys(
            List<TemplateKey> templateKeys, @Context HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        List<QueryTemplate> qTemplList = new ArrayList<QueryTemplate>();
        for (TemplateKey tk : templateKeys) {
            QueryTemplate qt = Executor._instance.getQueryTemplateFromKey(tk
                    .getOwner(), tk.getName(), QueryBuilderApplication
                    .getSessionAttr(session, QueryBuilderApplication.AUTH));
            qTemplList.add(qt);
        }
        return qTemplList;
    }

}
