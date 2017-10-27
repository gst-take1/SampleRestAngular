package com.trp.pub.cust.rest.func;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.trp.pub.cust.model.QueryTemplate;
import com.trp.pub.cust.rest.QueryBuilderApplication;
import com.trp.pub.cust.util.Executor;

@Path("/execute")
public class QueryBuilderExecuteService {

    @POST
    @Path("/testExecuteDSQuery")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_HTML)
    public String testExecuteDSQuery(QueryTemplate queryTemplate,
            @Context HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        return Executor._instance.executeDSQuery(queryTemplate, true,
                QueryBuilderApplication.getSessionAttr(session, QueryBuilderApplication.AUTH)
                );
    }

    @POST
    @Path("/executeQueryTemplate")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_HTML)
    public String executeQueryTemplate(QueryTemplate queryTemplate,
            @Context HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        return Executor._instance.executeQueryTemplate(
                queryTemplate.getOwner(), queryTemplate.getTemplateName(),
                queryTemplate.getParamsList(), 
                "text/" + queryTemplate.getResultFormat(),
                QueryBuilderApplication.getSessionAttr(session, QueryBuilderApplication.AUTH)
                );
    }
    
    @POST
    @Path("/validateSelector")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_HTML)
    public String validateSelector(QueryTemplate queryTemplate,
            @Context HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        return Executor._instance.validateSelector(queryTemplate, 
                QueryBuilderApplication.getSessionAttr(session, QueryBuilderApplication.AUTH)               
                );
    }

}
