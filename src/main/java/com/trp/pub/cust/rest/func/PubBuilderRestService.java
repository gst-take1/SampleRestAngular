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
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.trp.pub.cust.model.PubTemplate;
import com.trp.pub.cust.model.Symbol;
import com.trp.pub.cust.model.xml1.TemplateKeys.TemplateKey;
import com.trp.pub.cust.rest.QueryBuilderApplication;
import com.trp.pub.cust.util.Executor;

@Path("/pubBuilder")
public class PubBuilderRestService {
    @GET
    @Path("/getSymbols")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Symbol> getSymbols() {
        return Executor._instance.getSymbols();
    }

    @GET
    @Path("/getPubTemplateKeys/{owner}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<TemplateKey> getPubTemplateKeys(
            @PathParam("owner") String owner) {
        return Executor._instance.getPubTemplateKeys(owner);
    }

    @GET
    @Path("/getPubTemplateFromKey/{owner}/{name}")
    @Produces(MediaType.APPLICATION_JSON)
    public PubTemplate getPubTemplateFromKey(
            @Context HttpServletRequest request,
            @PathParam("owner") String owner, @PathParam("name") String name) {
        HttpSession session = request.getSession(false);
        return Executor._instance.getPubTemplateFromKey(owner, name,
                QueryBuilderApplication.getSessionAttr(session, QueryBuilderApplication.AUTH));
    }

    @GET
    @Path("/getUserDefinedSymbols/{owner}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Symbol> getUserDefinedSymbols(
            @PathParam("owner") String owner) {
        return Executor._instance.getUserDefinedSymbols(owner);
    }
    
    @GET
    @Path("/getDAFieldValues/{field}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<String> getDAFieldValues( @PathParam("field") String field) {
        return Executor._instance.getDAFieldValues(field);
    }
    
    @POST
    @Path("/getPubTemplatesFromKeys")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<PubTemplate> getQueryTemplatesFromKeys(
            List<TemplateKey> templateKeys, @Context HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        List<PubTemplate> pTemplList = new ArrayList<PubTemplate>();
        for (TemplateKey tk : templateKeys) {
            PubTemplate pt = Executor._instance.getPubTemplateFromKey(
                    tk.getOwner(), tk.getName(), 
                    QueryBuilderApplication.getSessionAttr(session, QueryBuilderApplication.AUTH)
                    );
            pTemplList.add(pt);
        }
        return pTemplList;
    }
}
