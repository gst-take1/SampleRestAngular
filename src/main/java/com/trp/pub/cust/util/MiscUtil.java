package com.trp.pub.cust.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.math.BigDecimal;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.naming.Context;
import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.DirContext;
import javax.naming.directory.InitialDirContext;
import javax.naming.directory.SearchControls;
import javax.naming.directory.SearchResult;
import javax.net.ssl.HttpsURLConnection;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.log4j.Logger;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

import com.trp.pub.cust.model.Param;
import com.trp.pub.cust.model.PubTemplate;
import com.trp.pub.cust.model.QueryTemplate;
import com.trp.pub.cust.model.SortBy;
import com.trp.pub.cust.model.Symbol;
import com.trp.pub.cust.model.xml1.DataQueryV10;
import com.trp.pub.cust.model.xml1.DataQueryV10.Argument;
import com.trp.pub.cust.model.xml1.DataQueryV10.Sort;
import com.trp.pub.cust.model.xml1.Publication;
import com.trp.pub.cust.model.xml1.Template;

public class MiscUtil {
    public static final MiscUtil _instance = new MiscUtil();

    private static final Logger LOGGER = Logger.getLogger(MiscUtil.class
            .getName());

    private Pattern entityPtrn = Pattern.compile("(\\w*)/(\\d+)/(\\d+)");

    private static final String ACCEPT = "Accept";
    private static final String AUTH = "Authorization";
    private static final String FAILED = " failed : ";
    private static final String BR = "<br>";
    private static final String SLASH = "/";
    
    private MiscUtil() {

    }

    public String createBasicAuth(String id, String passwd) {
        StringBuilder buffer = new StringBuilder();
        buffer.append(id);
        buffer.append(':');
        buffer.append(passwd);
        return "Basic "
                + javax.xml.bind.DatatypeConverter.printBase64Binary(String
                        .valueOf(buffer).getBytes());
    }

    public List<String> executeURLForList(String urlStr, String basicAuth) {

        List<String> result = new ArrayList<String>();
        HttpsURLConnection conn = getbuildDataServiceURLConn(urlStr, basicAuth, MediaType.TEXT_PLAIN);
        try {
            BufferedReader br = new BufferedReader(new InputStreamReader(
                    conn.getInputStream()));
            String line;

            while ((line = br.readLine()) != null) {
                result.add(line);
            }

            conn.disconnect();
        } catch (IOException e) {
            LOGGER.error(e);
            throw new WebApplicationException(e, Response
                    .status(Status.INTERNAL_SERVER_ERROR)
                    .entity(urlStr + FAILED + BR+ e.toString())
                    .type(MediaType.TEXT_PLAIN).build());
        }
        return result;
    }

    private HttpsURLConnection getbuildDataServiceURLConn(String urlStr,
            String basicAuth, String accept) {
        HttpsURLConnection conn;

        try {
            URL url = new URL(urlStr);
            URI uri = new URI(url.getProtocol(), url.getUserInfo(),
                    url.getHost(), url.getPort(), url.getPath(),
                    url.getQuery(), url.getRef());
            url = uri.toURL();
            conn = (HttpsURLConnection) url.openConnection();

            conn.setRequestMethod("GET");
            if(accept != null) {
                conn.setRequestProperty(ACCEPT, accept);
            }            
            conn.setRequestProperty(AUTH, basicAuth);

            if (conn.getResponseCode() >= 400) {
                handleDataServiceError(conn);
            }
        } catch (IOException e) {
            LOGGER.error("Exception in getbuildDataServiceURLConn" , e);
            throw new WebApplicationException(e, Response
                    .status(Status.INTERNAL_SERVER_ERROR)
                    .entity(urlStr + FAILED + BR+ e.toString())
                    .type(MediaType.TEXT_PLAIN).build());
        } catch (URISyntaxException e) {
            LOGGER.error(e);
            throw new WebApplicationException(e, Response
                    .status(Status.INTERNAL_SERVER_ERROR)
                    .entity(urlStr + FAILED + BR+ e.toString())
                    .type(MediaType.TEXT_PLAIN).build());
        }
        return conn;
    }

    public String executeURLForString(String urlStr, String basicAuth, String accept) {
        StringBuilder result = new StringBuilder();
        try {

            HttpsURLConnection conn = getbuildDataServiceURLConn(urlStr,
                    basicAuth, accept);

            BufferedReader br = new BufferedReader(new InputStreamReader(
                    conn.getInputStream()));

            char[] cbuf = new char[1024];

            int count;
            while ((count = br.read(cbuf)) != -1) {
                result.append(cbuf, 0, count);
            }

            conn.disconnect();
        } catch (IOException e) {
            LOGGER.error(e);
            throw new WebApplicationException(e, Response
                    .status(Status.INTERNAL_SERVER_ERROR)
                    .entity(urlStr + FAILED + BR+ e.toString())
                    .type(MediaType.TEXT_PLAIN).build());
        }
        return result.toString();
    }

    public Document executeURLForXML(String urlStr, String basicAuth) {
        Document doc = null;
        try {
            HttpsURLConnection conn = getbuildDataServiceURLConn(urlStr,
                    basicAuth, MediaType.TEXT_XML);
            
            DocumentBuilderFactory factory = DocumentBuilderFactory
                    .newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();

            doc = builder.parse(conn.getInputStream());
            conn.disconnect();
        } catch (ParserConfigurationException e) {
            LOGGER.error(e);
            throw new WebApplicationException(e, Response
                    .status(Status.INTERNAL_SERVER_ERROR)
                    .entity(urlStr + FAILED + BR+ e.toString())
                    .type(MediaType.TEXT_PLAIN).build());
        } catch (SAXException e) {
            LOGGER.error(e);
            throw new WebApplicationException(e, Response
                    .status(Status.INTERNAL_SERVER_ERROR)
                    .entity(urlStr + FAILED + BR+ e.toString())
                    .type(MediaType.TEXT_PLAIN).build());
        } catch (IOException e) {
            LOGGER.error(e);
            throw new WebApplicationException(e, Response
                    .status(Status.INTERNAL_SERVER_ERROR)
                    .entity(urlStr + FAILED + BR+ e.toString())
                    .type(MediaType.TEXT_PLAIN).build());
        }

        return doc;
    }

    public Object executeURLForJAXBObj(String urlStr, String basicAuth,
            Class objClass) {
        Object retObj = null;

        try {
            LOGGER.debug("executeURLForJAXBObj URL " + urlStr);
            HttpsURLConnection conn = getbuildDataServiceURLConn(urlStr,
                    basicAuth, MediaType.TEXT_XML);

            JAXBContext jaxbContext = JAXBContext.newInstance(objClass);
            Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();

            retObj = jaxbUnmarshaller.unmarshal(conn.getInputStream());
            conn.disconnect();
        } catch (IOException e) {
            LOGGER.error(e);
            throw new WebApplicationException(e, Response
                    .status(Status.INTERNAL_SERVER_ERROR)
                    .entity(urlStr + FAILED + BR+ e.toString())
                    .type(MediaType.TEXT_PLAIN).build());
        } catch (JAXBException e) {
            LOGGER.error(e);
            throw new WebApplicationException(e, Response
                    .status(Status.INTERNAL_SERVER_ERROR)
                    .entity(urlStr + FAILED + BR+ e.toString())
                    .type(MediaType.TEXT_PLAIN).build());
        }

        return retObj;
    }

    private void handleDataServiceError(HttpsURLConnection conn)
            throws IOException {
        StringBuilder sb = new StringBuilder();
        BufferedReader br = new BufferedReader(new InputStreamReader(
                conn.getErrorStream()));
        String read;

        while ((read = br.readLine()) != null) {
            sb.append(read);
        }

        br.close();

        LOGGER.error("Failed : HTTP error code : " + conn.getResponseCode()
                + " for URL: " + conn.getURL().toString() + " method "
                + conn.getRequestMethod() + " Error: " + sb.toString());
        throw new WebApplicationException(Response
                .status(conn.getResponseCode())
                .entity(URLDecoder.decode(conn.getURL().toString(), "UTF-8") + FAILED + sb.toString())
                .type(MediaType.TEXT_PLAIN).build());

    }

    public String buildDataServiceArgStr(String datasrc,
            QueryTemplate queryTemplate, boolean isTest) {
        StringBuilder sb = new StringBuilder();
        sb.append("datasrc=");
        sb.append(datasrc);
        sb.append("&");
        
        sb.append(buildSelector(queryTemplate, isTest));
        
        sb.append("&nullval=");
        if (queryTemplate.getExclList() != null) {
            if (queryTemplate.getExclList().size() <= queryTemplate
                    .getInclList().size()) {
                for (String exclAttr : queryTemplate.getExclList()) {
                    sb.append("&excl=");
                    sb.append(exclAttr);
                }
            } else {
                for (String inclAttr : queryTemplate.getInclList()) {
                    sb.append("&incl=");
                    sb.append(inclAttr);
                }
            }
        }
        for (Param param : queryTemplate.getParamsList()) {
            sb.append("&");
            sb.append(param.getParamName());
            sb.append("=");
            sb.append(param.getArgValue());
        }
        for (SortBy sortBy : queryTemplate.getSortByList()) {
            sb.append("&sort=");
            if ("ascending".equals(sortBy.getOrder())) {
                sb.append("/");
            } else {
                sb.append("\\");
            }
            sb.append(sortBy.getAttrName());
        }
        return sb.toString();
    }

    public String buildSelector(QueryTemplate queryTemplate, boolean isTest) {
        StringBuilder sb = new StringBuilder();
        sb.append("selector={");
        for (Param param : queryTemplate.getParamsList()) {
            sb.append(param.getDataType());
            sb.append(" ");
            sb.append(param.getParamName());
            sb.append(",");
        }
        if (sb.charAt(sb.length() - 1) == ',') {
            sb.deleteCharAt(sb.length() - 1);
        }
        sb.append(" : ");
        if (isTest) {
            sb.append("rownum < 10");
            if(queryTemplate.getSelector() != null && queryTemplate.getSelector().length() > 0 ) {
                sb.append(" and ( ");
                sb.append(queryTemplate.getSelector());
                sb.append(" )");
            }
        }
        
        else {
            sb.append(queryTemplate.getSelector());
        }
        sb.append("}");
        return sb.toString();
    }
    
    public List<String> getGroupsForUser(String userAcctId, String ldapUserId,
            String ldapPasswd, String ldapAdServer,
            String ldapSearchGroups) {
        try {
            SearchResult searchResult = lookupAccount(userAcctId, ldapUserId,
                    ldapPasswd, ldapAdServer);
            return getGroups(searchResult, ldapSearchGroups);
        } catch (NamingException e) {
            LOGGER.error(e);
            throw new WebApplicationException(e, Response
                    .status(Status.INTERNAL_SERVER_ERROR).entity(e.toString())
                    .type(MediaType.TEXT_PLAIN).build());
        }
    }

    public SearchResult lookupAccount(String userAcctId, String ldapUserId,
            String ldapPasswd, String ldapAdServer)
            throws NamingException {
        SearchControls searchControls = new SearchControls();
        searchControls.setSearchScope(SearchControls.SUBTREE_SCOPE);

        final String searchFilter = String.format(
                "(&(objectClass=user)(sAMAccountName=%s))", userAcctId);

        Hashtable<String, Object> env = new Hashtable<String, Object>();
        env.put(Context.INITIAL_CONTEXT_FACTORY,
                "com.sun.jndi.ldap.LdapCtxFactory");
        env.put(Context.PROVIDER_URL, ldapAdServer);
        env.put(Context.SECURITY_AUTHENTICATION, "simple");
        env.put(Context.SECURITY_PRINCIPAL, ldapUserId);
        env.put(Context.SECURITY_CREDENTIALS, ldapPasswd);

        DirContext ctx = new InitialDirContext(env);
        LOGGER.debug("-----ldap conn. status-->" + ctx.getEnvironment());
        
        String ldapSearchB = "OU=USERS,OU=ASSOCIATES,DC=corp,DC=trowepricedev,DC=net";
        LOGGER.debug("ldap lookup : " + userAcctId + " " + ldapUserId + " "
                + ldapPasswd + " " + ldapAdServer + " " + ldapSearchB);
        NamingEnumeration<SearchResult> results = ctx.search(
                ldapSearchB, searchFilter, searchControls);
        LOGGER.debug("-----------ldapSearchBase----------->"
                + ldapSearchB);

        SearchResult searchResult = null;
        if (results.hasMoreElements()) {
            LOGGER.debug("-----------ldapAccountToLookup----------->"
                    + userAcctId);
            searchResult = results.nextElement();

            if (results.hasMoreElements()) { // make sure no duplicates
                LOGGER.error("duplicate users for the acctId: " + userAcctId);
                return null;
            }
        }
        return searchResult;
    }

    ArrayList<String> getGroups(SearchResult sr, String regex) {
        String tmp = sr.toString();
        String[] lst = tmp.split("CN=");
        ArrayList<String> opt = new ArrayList<String>();
        Pattern pattern = Pattern.compile(regex);

        for (String i : lst) {
            if (i.contains("GROUPS")) {
                String[] grp = i.split(",", 2);
                Matcher match = pattern.matcher(i);
                LOGGER.debug("-------group------>" + grp[0]);
                if (match.find()) {
                    opt.add(grp[0]);
                }
            }
        }
        return opt;
    }

    public Template convertQueryTemplateToTemplate(QueryTemplate qt) {
        Template t = new Template();
        t.setName(qt.getTemplateName());
        t.setOwner(qt.getOwner());
        t.setQuery(buildDataQueryFromQueryTemplate(qt));
        return t;
    }
    
    public DataQueryV10 buildDataQueryFromQueryTemplate (QueryTemplate qt) {
        DataQueryV10 dq = new DataQueryV10();

        Matcher entityMtchr = entityPtrn.matcher(qt.getEntity());
        boolean matches = entityMtchr.matches();
        if (matches) {
            dq.setType(entityMtchr.group(1));
            dq.setVersion(new BigDecimal(entityMtchr.group(2) + "."
                    + entityMtchr.group(3)));
        }
        dq.setResultFormat("text/" + qt.getResultFormat());
        dq.setReply(qt.getReply());

        StringBuilder sbu = new StringBuilder();
        sbu.append("{");
        for (Param param : qt.getParamsList()) {
            sbu.append(param.getDataType());
            sbu.append(" ");
            sbu.append(param.getParamName());
            sbu.append(",");
        }
        if (sbu.charAt(sbu.length() - 1) == ',') {
            sbu.deleteCharAt(sbu.length() - 1);
        }
        sbu.append(" : ");

        sbu.append(qt.getSelector());

        sbu.append("}");

        dq.setSelector(sbu.toString());

        if (qt.getExclList().size() <= qt.getInclList().size()) {
            dq.getExclude().addAll(qt.getExclList());
        } else {
            qt.getInclList().addAll(qt.getInclList());
        }

        for (Param param : qt.getParamsList()) {
            Argument arg = new Argument();
            arg.setParam(param.getParamName());
            arg.setValue(param.getArgValue());
            dq.getArgument().add(arg);
        }
        for (SortBy sb : qt.getSortByList()) {
            Sort s = new Sort();
            s.setOrder(sb.getOrder());
            s.setValue(sb.getAttrName());
            dq.getSort().add(s);
        }
        return dq;
    }
    
    public QueryTemplate buildQueryTemplateFromDataQuery (DataQueryV10 dq) {
        QueryTemplate qt = new QueryTemplate();

        qt.setEntity(dq.getType() + "/"
                + String.valueOf(dq.getVersion()).replace(".", "/"));

        qt.setResultFormat(dq.getResultFormat().replace("text/", ""));
        qt.setReply(dq.getReply());

        String dqSelStr = dq.getSelector();

        qt.setSelector(dqSelStr.substring(dqSelStr.indexOf(":") + 1,
                dqSelStr.indexOf("}")));

        if (dq.getExclude() != null) {
            qt.setExclList(dq.getExclude());
        } else {
            qt.setExclList(new ArrayList<String>());
        }
        if (dq.getInclude() != null) {
            qt.setInclList(dq.getInclude());
        } else {
            qt.setInclList(new ArrayList<String>());
        }
        qt.setParamsList(new ArrayList<Param>());
        //populate the DataTypes for Params (Arguments)
        String[] tokens = dqSelStr.substring(dqSelStr.indexOf("{") + 1, dqSelStr.indexOf(":")).split(",");
        for (Argument arg : dq.getArgument()) {
            Param param = new Param();
            param.setParamName(arg.getParam());
            param.setArgValue(arg.getValue());
            //get Data Type
            for(String token: tokens) {
                String[] words = token.trim().split(" ");
                if(words[1].equals(param.getParamName())) {
                    param.setDataType(words[0]);
                }    
            }
            qt.getParamsList().add(param);
        }
        

        qt.setSortByList(new ArrayList<SortBy>());
        for (Sort s : dq.getSort()) {
            SortBy sb = new SortBy();
            sb.setAttrName(s.getValue());
            sb.setOrder(s.getOrder());
            qt.getSortByList().add(sb);
        }
        
        return qt;
    }
    
    public QueryTemplate convertTemplateToQueryTemplate(Template t) {
        QueryTemplate qt = buildQueryTemplateFromDataQuery((DataQueryV10) t.getQuery());
        qt.setTemplateName(t.getName());
        qt.setOwner(t.getOwner());
        return qt;
    }

    public void postJAXBXML(String urlStr, String basicAuth, Object jaxBObj,
            String method) {

        try {
            URL url = new URL(urlStr);
            URI uri = new URI(url.getProtocol(), url.getUserInfo(),
                    url.getHost(), url.getPort(), url.getPath(),
                    url.getQuery(), url.getRef());
            url = uri.toURL();
            HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();

            conn.setRequestMethod(method);
            conn.setRequestProperty("Content-Type", MediaType.TEXT_XML);
            conn.setRequestProperty(AUTH, basicAuth);
            conn.setDoOutput(true);
            OutputStreamWriter osw = new OutputStreamWriter(
                    conn.getOutputStream());

            JAXBContext jaxbContext = JAXBContext.newInstance(jaxBObj
                    .getClass());
            Marshaller jaxbMarshaller = jaxbContext.createMarshaller();
            jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);

            jaxbMarshaller.marshal(jaxBObj, osw);

            osw.flush();

            if (conn.getResponseCode() >= 400) {
                StringBuilder sb = new StringBuilder();
                BufferedReader br = new BufferedReader(new InputStreamReader(
                        conn.getErrorStream()));
                String read;

                while ((read = br.readLine()) != null) {
                    sb.append(read);
                }

                br.close();

                LOGGER.error("Failed : HTTP error code : "
                        + conn.getResponseCode() + " for URL: " + urlStr
                        + " method " + method + " Error: " + sb.toString());
                throw new WebApplicationException(Response
                        .status(conn.getResponseCode())
                        .entity(urlStr + FAILED + BR+ sb.toString())
                        .type(MediaType.TEXT_PLAIN).build());
            }
            osw.close();

        } catch (IOException e) {
            LOGGER.error(e);
            throw new WebApplicationException(e, Response
                    .status(Status.INTERNAL_SERVER_ERROR).entity(urlStr + FAILED + BR+ e.toString())
                    .type(MediaType.TEXT_PLAIN).build());
        } catch (JAXBException e) {
            LOGGER.error(e);
            throw new WebApplicationException(e, Response
                    .status(Status.INTERNAL_SERVER_ERROR).entity(urlStr + FAILED + BR+ e.toString())
                    .type(MediaType.TEXT_PLAIN).build());
        } catch (URISyntaxException e) {
            LOGGER.error(e);
            throw new WebApplicationException(e, Response
                    .status(Status.INTERNAL_SERVER_ERROR).entity(urlStr + FAILED + BR+ e.toString())
                    .type(MediaType.TEXT_PLAIN).build());
        }
    }
    
    public Publication convertPubTemplateToPublication (PubTemplate pt, List<Symbol> symList, List<Symbol> userDefSymList) {
        Publication p = new Publication();
        p.setName(pt.getPubName());
        p.setOwner(pt.getPubOwner());
        p.setDataQuery(buildDataQueryFromQueryTemplate(pt.getQueryTemplate()));
        
        //build Issue When
        String substitutedEventStr = pt.getEvent();
        for(Symbol sym : symList) {
            if("data_available_field".equals(sym.getSymbolType())) {
                substitutedEventStr = replaceWord(substitutedEventStr, sym.getSymbolName(), sym.getSymbolValue());
            }
        }
        p.setIssueWhen(/*"starts-with(@xsi:type, 'DataAvailable-v1') and " +*/ substitutedEventStr);
        //build target URL
        StringBuilder url = new StringBuilder();
        String substitutedDlvLocStr = pt.getDlvLoc();
        for(Symbol sym : userDefSymList) {
            if("delivery_location".equals(sym.getSymbolType())) {
                substitutedDlvLocStr = replaceWord(substitutedDlvLocStr, sym.getSymbolName(), sym.getSymbolValue()); 
            }         
        }
        url.append(substitutedDlvLocStr);
        url.append(SLASH);
        String substitutedFileName = pt.getFileNm();
        for(Symbol sym : symList) {
            if("file_name_substr".equals(sym.getSymbolType())) {
                substitutedFileName = replaceWord(substitutedFileName, sym.getSymbolName(), sym.getSymbolValue()); 
            }         
        }
        url.append(substitutedFileName);
        p.setTargetURL(url.toString());
        //substitute bind arg symbols
        List<Param> paramsList = pt.getQueryTemplate().getParamsList();
        for(Param param : paramsList) {
            for(Symbol sym : symList) {
                if("arg".equals(sym.getSymbolType()) && sym.getSymbolName().equals(param.getArgValue())) {                   
                    param.setArgValue(sym.getSymbolValue());
                    break;                    
                }
            }
        }
        //set on Empty Result
        p.setEmptyResult(pt.getEmptyResult());
        return p;
    }
    
    public PubTemplate convertPublicationToPubTemplate (Publication p, List<Symbol> symList, List<Symbol> userDefSymList) {
        PubTemplate pt = new PubTemplate();
        pt.setPubName((p.getName().replace("/trp/idw/", "").replace('/', ' ').replace('.', ' ')).trim());
        pt.setPubOwner(p.getOwner());
        pt.setQuerytemplate(buildQueryTemplateFromDataQuery((DataQueryV10) p.getDataQuery()));
        
        pt.getQueryTemplate().setTemplateName((p.getName().replace("/trp/idw/", "").replace('/', ' ').replace('.', ' ')).trim());
        pt.getQueryTemplate().setOwner(p.getOwner());
        //build Event
        String substitutedIssueWhenStr = p.getIssueWhen();
        substitutedIssueWhenStr = substitutedIssueWhenStr.replace("starts-with(@xsi:type, 'DataAvailable-v1') and cmm:Source = 'IDW' and ",""); 
        substitutedIssueWhenStr = substitutedIssueWhenStr.replace(" and contains(cmm:Context/@xsi:type, 'DataAvailable-v1')", "");
        substitutedIssueWhenStr = substitutedIssueWhenStr.replace(" and string-length(cmm:Context/idw:EffectiveDate) > 0", "");
        substitutedIssueWhenStr = substitutedIssueWhenStr.replace(" and string-length(cmm:Context/idw:BatchId) > 0","");
        substitutedIssueWhenStr = substitutedIssueWhenStr.replace("'", "");
        for(Symbol sym : symList) {
            if("data_available_field".equals(sym.getSymbolType())) {
                substitutedIssueWhenStr = replaceWord(substitutedIssueWhenStr, sym.getSymbolValue(), sym.getSymbolName());
            }
        }
        pt.setEvent(substitutedIssueWhenStr);
        //build Dlv Loc and File Name
        String targetURL = p.getTargetURL();
        String fileNm = targetURL.substring(targetURL.lastIndexOf(SLASH) + 1);
        String substitutedDirInTargetURL = targetURL.substring(0,targetURL.lastIndexOf(SLASH));
        substitutedDirInTargetURL = substitutedDirInTargetURL.replace("file:", "${STD_PUB}/");
        for(Symbol sym : userDefSymList) {
            if("delivery_location".equals(sym.getSymbolType())) {
                substitutedDirInTargetURL = replaceWord(substitutedDirInTargetURL, sym.getSymbolValue(), sym.getSymbolName());
            }
        }
        pt.setDlvLoc(substitutedDirInTargetURL);
        pt.setFileNm(fileNm);
        //un-substitute bind arg symbols      
        List<Param> paramsList = pt.getQueryTemplate().getParamsList();
        for(Param param : paramsList) {
            for(Symbol sym : symList) {
                if("arg".equals(sym.getSymbolType()) && sym.getSymbolValue().equals(param.getArgValue())) {                   
                    param.setArgValue(sym.getSymbolName());
                    break;                    
                }
            }
        }
        //set on Empty Result
        pt.setEmptyResult(p.getEmptyResult());
        return pt;
    }
    
    public void generatePublicationFile (Publication pub, String fileName, String dirPath, String remotePath, SSHManager sSHManager) { 
        File f = new File(dirPath, fileName);
        try {
            JAXBContext jaxbContext = JAXBContext.newInstance(pub
                    .getClass());
            Marshaller jaxbMarshaller = jaxbContext.createMarshaller();
            jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
            jaxbMarshaller.marshal(pub, f);
            LOGGER.debug("Publication File Successfully Generated locally at: " + f.getAbsolutePath());
            //copy to location
            sSHManager.sftpPut(dirPath, remotePath, fileName);
        } catch (JAXBException e) {
            LOGGER.error(e);
            throw new WebApplicationException(e, Response
                    .status(Status.INTERNAL_SERVER_ERROR).entity(e.toString())
                    .type(MediaType.TEXT_PLAIN).build());
        }
        LOGGER.debug("Publication File Successfully sftp'd at : " + remotePath + " from " + f.getAbsolutePath()); 
    }

    public void deletePublicationFile(String pubFileName, String dirPath, SSHManager sSHManager) {
        String rm = "rm -f " + dirPath + "/"+ pubFileName;
        LOGGER.debug("Remove File.. Exec " + rm);
        sSHManager.sendCommand(rm);
    }
    
    public static String replaceWord(String input, String before, String after) { 
        Pattern pattern = Pattern.compile(before, Pattern.LITERAL);
        Matcher m = pattern.matcher(input);
        String afterStrParsed = after.replace("$", "\\$");
        return  m.replaceAll(afterStrParsed);        
    }
    
}
