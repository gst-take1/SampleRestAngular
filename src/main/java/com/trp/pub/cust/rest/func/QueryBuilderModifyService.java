package com.trp.pub.cust.rest.func;

import java.util.ArrayList;
import java.util.List;

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

import com.trp.pub.cust.model.QueryTemplate;
import com.trp.pub.cust.rest.QueryBuilderApplication;
import com.trp.pub.cust.util.Executor;

@Path("/modify")
public class QueryBuilderModifyService {

    private static String strong = "<strong>";
    private static String strongEnd = "</strong>";
    private static String br = "<br>";

    private static final Logger LOGGER = Logger
            .getLogger(QueryBuilderModifyService.class.getName());

    @POST
    @Path("/saveQuery")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_HTML)
    public String saveQuery(QueryTemplate queryTemplate,
            @Context HttpServletRequest request) {
        QueryBuilderApplication.checkOwnerOrGroupOrAdmin(queryTemplate.getOwner(), request);
        HttpSession session = request.getSession(false);
        return Executor._instance.saveQuery(queryTemplate, 
                QueryBuilderApplication.getSessionAttr(session, QueryBuilderApplication.AUTH)
                );
    }

    @POST
    @Path("/deleteQuery")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_HTML)
    public String deleteQuery(QueryTemplate queryTemplate,
            @Context HttpServletRequest request) {
        QueryBuilderApplication.checkOwnerOrGroupOrAdmin(queryTemplate.getOwner(), request);
        HttpSession session = request.getSession(false);
        return Executor._instance.deleteQuery(queryTemplate, 
                QueryBuilderApplication.getSessionAttr(session, QueryBuilderApplication.AUTH)
                );
    }

    @POST
    @Path("/saveQueryTemplates")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<String> saveQueryTemplates(List<QueryTemplate> queryTempList,
            @Context HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        List<String> result = new ArrayList<String>(2);

        int failed = 0;
        int success = 0;
        StringBuilder failedNames = new StringBuilder();
        for (QueryTemplate qTemp : queryTempList) {
            try {
                QueryBuilderApplication.checkOwnerOrGroupOrAdmin(qTemp.getOwner(), request);
                Executor._instance.saveQuery(qTemp, 
                        QueryBuilderApplication.getSessionAttr(session, QueryBuilderApplication.AUTH)
                        );
            } catch (WebApplicationException e) {
                LOGGER.debug(e);
                failed++;
                failedNames.append("(");
                failedNames.append(qTemp.getTemplateName());
                failedNames.append(",");
                failedNames.append(qTemp.getOwner());
                failedNames.append(")");
                failedNames.append(" : Error - ");
                failedNames.append((e.getResponse() != null) ? e.getResponse().getEntity().toString() : e.toString());
                failedNames.append(br);
                continue;
            }
            success++;
        }
        buildImportMessage(success, failed, failedNames);

        return result;
    }
    
    public static List<String> buildImportMessage (int success, int failed, StringBuilder failedNames) {
        List<String> result = new ArrayList<String>(2);
        result.add(strong + success + strongEnd
                + " row(s) were saved successfully");
        StringBuilder failedMsg = new StringBuilder();
        failedMsg.append(strong);
        failedMsg.append(failed);
        failedMsg.append(strongEnd);
        failedMsg.append(" row(s) had errors");
        if (failed > 0) {
            failedMsg.append(br);
            failedMsg.append(failedNames);
        }
        result.add(failedMsg.toString());
        return result;
    }
}
