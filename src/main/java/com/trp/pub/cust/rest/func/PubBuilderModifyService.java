package com.trp.pub.cust.rest.func;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.apache.log4j.Logger;

import com.trp.pub.cust.model.PubTemplate;
import com.trp.pub.cust.model.Symbol;
import com.trp.pub.cust.rest.QueryBuilderApplication;
import com.trp.pub.cust.util.Executor;
import com.trp.pub.cust.util.SSHManager;

@Path("/pubModify")
public class PubBuilderModifyService {
    
    private static String br = "<br>";

    private static final Logger LOGGER = Logger
            .getLogger(PubBuilderModifyService.class.getName());
    
    @POST
    @Path("/savePubTemplate")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_HTML)
    public void savePubTemplate(@Context HttpServletRequest request, PubTemplate pubTemplate){
        QueryBuilderApplication.checkOwnerOrGroupOrAdmin(pubTemplate.getPubOwner(), request);
        HttpSession session = request.getSession(false);
        SSHManager sSHManager = Executor._instance.getSSHManagerInstance();
        List<Symbol> symList =Executor._instance.getSymbols();
        List<Symbol> userDefSymList = Executor._instance.getUserDefinedSymbols(pubTemplate.getPubOwner());
        try{
            Executor._instance.savePubTemplate(pubTemplate,
                    QueryBuilderApplication.getSessionAttr(session, QueryBuilderApplication.LOGGED_IN_USER),
                    QueryBuilderApplication.getSessionAttr(session, QueryBuilderApplication.AUTH),
                    symList,
                    userDefSymList,
                    sSHManager
                    );
        } finally {
            sSHManager.close();
        }
    }
    
    @POST
    @Path("/insertPubTemplate")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_HTML)
    public void insertPubTemplate(@Context HttpServletRequest request, PubTemplate pubTemplate){
        QueryBuilderApplication.checkOwnerOrGroupOrAdmin(pubTemplate.getPubOwner(), request);
        HttpSession session = request.getSession(false);
        SSHManager sSHManager = Executor._instance.getSSHManagerInstance();
        List<Symbol> symList =Executor._instance.getSymbols();
        List<Symbol> userDefSymList = Executor._instance.getUserDefinedSymbols(pubTemplate.getPubOwner());
        try{
            Executor._instance.insertPubTemplate(pubTemplate,
                    QueryBuilderApplication.getSessionAttr(session, QueryBuilderApplication.LOGGED_IN_USER),
                    QueryBuilderApplication.getSessionAttr(session, QueryBuilderApplication.AUTH),
                    symList,
                    userDefSymList,
                    sSHManager
                    );
        } finally {
            sSHManager.close();
        }
    }
    
    @POST
    @Path("/deletePubTemplate")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_HTML)
    public void deletePubTemplate(@Context HttpServletRequest request, PubTemplate pubTemplate){
        QueryBuilderApplication.checkOwnerOrGroupOrAdmin(pubTemplate.getPubOwner(), request);
        HttpSession session = request.getSession(false);
        SSHManager sSHManager = Executor._instance.getSSHManagerInstance();
        try{
            Executor._instance.deletePubTemplate(pubTemplate,
                    QueryBuilderApplication.getSessionAttr(session, QueryBuilderApplication.AUTH),
                    sSHManager
                    );
        } finally {
            sSHManager.close();
        }
    }
    
    @POST
    @Path("/savePubTemplates")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<String> savePubTemplates(List<PubTemplate> pubTempList,
            @Context HttpServletRequest request) {
        HttpSession session = request.getSession(false);
       

        int failed = 0;
        int success = 0;
        StringBuilder failedNames = new StringBuilder();
        SSHManager sSHManager = Executor._instance.getSSHManagerInstance();
        List<Symbol> symList = Executor._instance.getSymbols();
        
        Map<String, List<Symbol>> userDefSymCache = new HashMap<String, List<Symbol>>();
        
        for (PubTemplate pTemp : pubTempList) {
            boolean inError = false;
            try {
                QueryBuilderApplication.checkOwnerOrGroupOrAdmin(pTemp.getPubOwner(), request);
                List<Symbol> userDefSymList = userDefSymCache.get(pTemp.getPubOwner());
                if(userDefSymList == null) {
                    userDefSymList = Executor._instance.getUserDefinedSymbols(pTemp.getPubOwner());
                    userDefSymCache.put(pTemp.getPubOwner(), userDefSymList);
                }
                Executor._instance.savePubTemplate(pTemp, 
                        QueryBuilderApplication.getSessionAttr(session, QueryBuilderApplication.LOGGED_IN_USER),
                        QueryBuilderApplication.getSessionAttr(session, QueryBuilderApplication.AUTH),
                        symList,
                        userDefSymList,
                        sSHManager
                        );
            } catch (WebApplicationException e) {
                LOGGER.error(e, e);
                failed++;
                inError = true;
                failedNames.append("(");
                failedNames.append(pTemp.getPubName());
                failedNames.append(",");
                failedNames.append(pTemp.getPubOwner());
                failedNames.append(")");
                failedNames.append(" : Error - ");
                failedNames.append((e.getResponse() != null) ? e.getResponse().getEntity().toString() : e.toString());
                failedNames.append(br);
            } catch (RuntimeException e) {
                LOGGER.error(e, e);
                failed++;
                inError = true;
                failedNames.append("(");
                failedNames.append(pTemp.getPubName());
                failedNames.append(",");
                failedNames.append(pTemp.getPubOwner());
                failedNames.append(")");
                failedNames.append(" : Error - ");
                failedNames.append(e.toString() + " "
                        + e.getStackTrace()[0].toString() + " "
                        + e.getStackTrace()[1].toString());
                failedNames.append(br);
            }
            if(!inError) {
                success++;
            } else {
                continue;
            }
        }
        sSHManager.close();

        return QueryBuilderModifyService.buildImportMessage(success, failed, failedNames);
    }
    
    
    
}
