package com.trp.pub.cust.rest.func;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.Unmarshaller;

import org.apache.log4j.Logger;

import com.trp.pub.cust.model.PubTemplate;
import com.trp.pub.cust.model.Symbol;
import com.trp.pub.cust.model.xml1.Publication;
import com.trp.pub.cust.rest.ThrowableExceptionMapper;
import com.trp.pub.cust.util.Executor;
import com.trp.pub.cust.util.MiscUtil;

@Path("/admin")
public class AdminService {
    
    private static final Logger LOGGER = Logger
            .getLogger(AdminService.class.getName());
    
    @GET
    @Path("/reloadProperties")
    @Produces(MediaType.TEXT_PLAIN)
    public String reloadProperties(@Context HttpServletRequest request) {
        return Executor._instance.populateProperties();
    }
    
    @GET
    @Path("/convertPubXMLtoJSON")
    @Produces(MediaType.APPLICATION_JSON)
    public List<PubTemplate> convertPubXMLtoJSON(@QueryParam("srcDir") String srcDir) {
        List<PubTemplate> result = new ArrayList<PubTemplate>();
        File xmlFolder = new File(srcDir);
        List<Symbol> symList = Executor._instance.getSymbols();        
        Map<String, List<Symbol>> userDefSymCache = new HashMap<String, List<Symbol>>();
        
        for(File thisFile: xmlFolder.listFiles()) {
            if (!thisFile.getName().endsWith("xml") ||
                    "list.xml".equals(thisFile.getName()) ||
                    "listUpdated.xml".equals(thisFile.getName())) {
                continue;
            }
            LOGGER.debug(thisFile.getName());
            try {
                JAXBContext jaxbContext = JAXBContext.newInstance(Publication.class);
                Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
    
                Publication p = (Publication) jaxbUnmarshaller.unmarshal(thisFile);
                List<Symbol> userDefSymList = userDefSymCache.get(p.getOwner());
                if(userDefSymList == null) {
                    userDefSymList = Executor._instance.getUserDefinedSymbols(p.getOwner());
                    userDefSymCache.put(p.getOwner(), userDefSymList);
                }
                
                result.add(MiscUtil._instance.convertPublicationToPubTemplate(p, symList, userDefSymList));
                
            } catch (Exception e) {
                LOGGER.debug(e);
                throw new WebApplicationException(e, ThrowableExceptionMapper.buildResponse(e));
            }
           
            
        }
        return result;
        
    }
}
