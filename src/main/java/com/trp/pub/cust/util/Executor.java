package com.trp.pub.cust.util;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.math.BigDecimal;
import java.net.UnknownHostException;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Enumeration;
import java.util.GregorianCalendar;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;

import org.apache.log4j.Logger;

import com.trp.pub.cust.model.EntityAttr;
import com.trp.pub.cust.model.Param;
import com.trp.pub.cust.model.PubTemplate;
import com.trp.pub.cust.model.QueryTemplate;
import com.trp.pub.cust.model.Symbol;
import com.trp.pub.cust.model.xml1.DataQueryV10;
import com.trp.pub.cust.model.xml1.Dataset;
import com.trp.pub.cust.model.xml1.DatasetKeys;
import com.trp.pub.cust.model.xml1.DatasetKeys.DatasetKey;
import com.trp.pub.cust.model.xml1.Publication;
import com.trp.pub.cust.model.xml1.Template;
import com.trp.pub.cust.model.xml1.TemplateKeys;
import com.trp.pub.cust.model.xml1.TemplateKeys.TemplateKey;

public class Executor {
    private static final String LINE_SEP = "line.separator";
    private static final Logger LOGGER = Logger.getLogger(Executor.class
            .getName());
    public static final Executor _instance = new Executor();

    private String pubEntityURL = "https://{0}:{1}/atlas/datasets";
    private String entityAttrURL = "https://{0}:{1}/atlas/datasets/{2}";
    private String dataServiceURLGET = "https://{0}:{1}/atlas/query/{2}/data?{3}";
    // Need this for later -private String dataServiceURLPOST =
    // Need this for later - https://{0}:{1}/atlas/query/{2}/data"

    private String qTemplKeysListURL = "https://{0}:{1}/atlas/templates/{2}";
    private String saveQTemplURL = "https://{0}:{1}/atlas/templates/{2}/{3}";
    private String qTemplFromKey = "https://{0}:{1}/atlas/templates/{2}/{3}";
    private String execQTemplURL = "https://{0}:{1}/atlas/templates/{2}/{3}/query/data?{4}";
    private String parseSelector = "https://{0}:{1}/atlas/selector/{2}/object?{3}";

    private List<String> envs = new ArrayList<String>();
    private Properties props;
    private Properties values;

    private static String propsNotLoaded = " - properties could not be loaded";

    private static final String DS_HOST_PROP = "ds.url.host";
    private static final String DS_PORT_PROP = "ds.url.port";

    private DataSource ds;

    private Executor() {
        populateProperties();
        populateValueProperties();
    }

    public final String populateProperties() {
        StringBuilder sb = new StringBuilder();
        String msg = "Populating Properties start...";
        LOGGER.debug(msg);
        sb.append(msg);
        sb.append(System.getProperty(LINE_SEP));
        Properties sysProps = new Properties();
        InputStream is = getClass().getClassLoader().getResourceAsStream(
                "sys.properties");
        if (is != null) {
            try {
                sysProps.load(is);
            } catch (IOException e) {
                msg = "sys.properties   could not be loaded";
                LOGGER.error(msg, e);
                sb.append(msg);
                sb.append(e.getMessage());
                return sb.toString();
            }
        }

        String propFile = null;
        try {
            propFile = MessageFormat.format(sysProps.getProperty("propFile"),
                    java.net.InetAddress.getLocalHost().getHostName(),
                    System.getProperty("port"));
            is = new FileInputStream(propFile);
            props = new Properties();
            props.load(is);
        } catch (UnknownHostException e3) {
            msg = "HostName not resolved";
            LOGGER.error(msg, e3);
            sb.append(msg);
            sb.append(System.getProperty(LINE_SEP));
            sb.append(e3.getMessage());
        } catch (FileNotFoundException e2) {
            msg = propFile + propsNotLoaded;
            LOGGER.error(msg, e2);
            sb.append(msg);
            sb.append(System.getProperty(LINE_SEP));
            sb.append(e2.getMessage());
        } catch (IOException e1) {
            msg = propFile + propsNotLoaded;
            LOGGER.error(msg, e1);
            sb.append(msg);
            sb.append(System.getProperty(LINE_SEP));
            sb.append(e1.getMessage());
        }
        if (props.size() == 0) {
            return sb.toString();
        }
        Context ctx;
        for (Enumeration<?> e = props.propertyNames(); e.hasMoreElements();) {
            String name = (String) e.nextElement();
            String value = props.getProperty(name);
            msg = name + "=" + value;
            LOGGER.debug(msg);
            sb.append(msg);
            sb.append(System.getProperty(LINE_SEP));
            if (name.startsWith("db.src")) {
                try {
                    ctx = new InitialContext();
                    ds = (DataSource) ctx.lookup("java:comp/env/" + value);
                } catch (Exception e1) {
                    msg = "Exception initializing " + value;
                    LOGGER.error(msg, e1);
                    sb.append(msg);
                    sb.append(e1.getMessage());
                    sb.append(System.getProperty(LINE_SEP));
                }
            }
        }
        msg = "Populating Properties end...";
        LOGGER.debug(msg);
        sb.append(msg);
        return sb.toString();
    }

    private void populateValueProperties() {
        String propFile = null;
        try {
            propFile = props.getProperty("ldap.svc.valuesPath");
            FileInputStream is = new FileInputStream(propFile);
            values = new Properties();
            values.load(is);
        } catch (Exception e2) {
            String msg = propFile + propsNotLoaded;
            LOGGER.error(msg, e2);
        }
    }

    public List<String> getPubEntities(String basicAuth) {
        String urlStr = MessageFormat.format(pubEntityURL,
                props.get(DS_HOST_PROP), props.get(DS_PORT_PROP));
        DatasetKeys dataSetKeys = (DatasetKeys) MiscUtil._instance
                .executeURLForJAXBObj(urlStr, basicAuth, DatasetKeys.class);
        List<String> entities = new ArrayList<String>();
        for (DatasetKey dsKey : dataSetKeys.getDatasetKey()) {
            entities.add(dsKey.getType() + "/"
                    + String.valueOf(dsKey.getVersion()).replace('.', '/'));
        }
        return entities;
    }

    public List<String> getEnvs() {
        return envs;
    }

    public List<EntityAttr> getEntityAtts(String entity, String basicAuth) {
        List<EntityAttr> attrs = new ArrayList<EntityAttr>();
        String urlStr = MessageFormat.format(entityAttrURL,
                props.get(DS_HOST_PROP), props.get(DS_PORT_PROP), entity);
        Dataset dataSet = (Dataset) MiscUtil._instance.executeURLForJAXBObj(
                urlStr, basicAuth,
                Dataset.class);
        for (Dataset.Attr attr : dataSet.getAttr()) {
            EntityAttr eAttr = new EntityAttr();
            eAttr.setAttrName(attr.getName());
            eAttr.setAttrType(attr.getType().toLowerCase());

            attrs.add(eAttr);
        }
        Collections.sort(attrs, new EntityAttr.AttrNameComparator());
        return attrs;
    }

    public String executeDSQuery(QueryTemplate queryTemplate, boolean isTest,
            String basicAuth) {
        String urlArgs = MiscUtil._instance.buildDataServiceArgStr(
                (String) props.get("ds.url.datasrc"), queryTemplate, isTest);
        String urlStr = MessageFormat.format(dataServiceURLGET,
                props.get(DS_HOST_PROP), props.get(DS_PORT_PROP),
                queryTemplate.getEntity(), urlArgs);
        LOGGER.debug("DataService URL Constructed " + urlStr);
        String res = MiscUtil._instance.executeURLForString(urlStr, basicAuth,
                "text/" + queryTemplate.getResultFormat());
        LOGGER.debug(res);
        return res;
    }

    public List<String> getOwnerOptions(String user) {
        List<String> ownerList = new ArrayList<String>();
        ownerList.add(user);
        List<String> groups = MiscUtil._instance.getGroupsForUser(user,
                (String) props.get("ldap.svc.user"),
                (String) values.get(props.get("ldap.svc.user.valuesLookup")),
                (String) props.get("ldap.ad.server"),
                (String) props.get("ldap.search.group"));
        ownerList.addAll(groups);
        return ownerList;
    }

    public String saveQuery(QueryTemplate queryTemplate, String basicAuth) {
        try {
            Template t = MiscUtil._instance
                    .convertQueryTemplateToTemplate(queryTemplate);
            GregorianCalendar gCal = new GregorianCalendar();
            t.setCreatedTime(DatatypeFactory.newInstance()
                    .newXMLGregorianCalendar(gCal));
            t.setModifiedTime(DatatypeFactory.newInstance()
                    .newXMLGregorianCalendar(gCal));
            LOGGER.debug(t);

            JAXBContext jaxbContext = JAXBContext.newInstance(Template.class);
            Marshaller jaxbMarshaller = jaxbContext.createMarshaller();
            jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);

            StringWriter sw = new StringWriter();
            jaxbMarshaller.marshal(t, sw);
            LOGGER.debug("Query Template xml to save ");
            LOGGER.debug(sw.toString());

            // call the URL to save
            String urlStr = MessageFormat.format(saveQTemplURL,
                    props.get(DS_HOST_PROP), props.get(DS_PORT_PROP),
                    t.getOwner(), t.getName());
            MiscUtil._instance.postJAXBXML(urlStr, basicAuth, t, "PUT");

        } catch (JAXBException e) {
            LOGGER.error(e);
            throw new WebApplicationException(e, Response
                    .status(Status.INTERNAL_SERVER_ERROR).entity(e.toString())
                    .type(MediaType.TEXT_PLAIN).build());
        } catch (DatatypeConfigurationException e) {
            LOGGER.error(e);
            throw new WebApplicationException(e, Response
                    .status(Status.INTERNAL_SERVER_ERROR).entity(e.toString())
                    .type(MediaType.TEXT_PLAIN).build());
        }

        return "Saved Successfully";
    }

    public static void main(String args[]) {
        try {
            Template qt = new Template();

            qt.setName("tName");
            qt.setOwner("Owner1");
            GregorianCalendar gCal = new GregorianCalendar();
            qt.setCreatedTime(DatatypeFactory.newInstance()
                    .newXMLGregorianCalendar(gCal));

            DataQueryV10 dq = new DataQueryV10();
            dq.setType("EntityType");
            dq.setVersion(new BigDecimal("2.0"));
            dq.setSelector("Attr 1= \"a\" ");
            dq.getExclude().add("ExclAttr1");

            qt.setQuery(dq);

            JAXBContext jaxbContext = JAXBContext.newInstance(Template.class);
            Marshaller jaxbMarshaller = jaxbContext.createMarshaller();

            // output pretty printed
            jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);

            // For later jaxbMarshaller.marshal(qt, System.out)

        } catch (JAXBException e) {
            LOGGER.error(e);
            throw new WebApplicationException(e, Response
                    .status(Status.INTERNAL_SERVER_ERROR).entity(e.toString())
                    .type(MediaType.TEXT_PLAIN).build());
        } catch (DatatypeConfigurationException e) {
            LOGGER.error(e);
            throw new WebApplicationException(e, Response
                    .status(Status.INTERNAL_SERVER_ERROR).entity(e.toString())
                    .type(MediaType.TEXT_PLAIN).build());
        }
    }

    public List<TemplateKey> getQueryTemplateKeys(String owner, String basicAuth) {
        String urlStr = MessageFormat.format(qTemplKeysListURL,
                props.get(DS_HOST_PROP), props.get(DS_PORT_PROP), owner);

        TemplateKeys tKeys = (TemplateKeys) MiscUtil._instance
                .executeURLForJAXBObj(urlStr, basicAuth, TemplateKeys.class);
        return tKeys.getTemplateKey();
    }

    public QueryTemplate getQueryTemplateFromKey(String owner, String name,
            String basicAuth) {
        String urlStr = MessageFormat.format(qTemplFromKey,
                props.get(DS_HOST_PROP), props.get(DS_PORT_PROP), owner, name);
        Template qTempl = (Template) MiscUtil._instance.executeURLForJAXBObj(
                urlStr, basicAuth, Template.class);
        return MiscUtil._instance.convertTemplateToQueryTemplate(qTempl);
    }

    public String deleteQuery(QueryTemplate queryTemplate, String basicAuth) {
        Template t = MiscUtil._instance
                .convertQueryTemplateToTemplate(queryTemplate);

        try {

            JAXBContext jaxbContext = JAXBContext
                    .newInstance(/* QueryTemplate.class */Template.class);
            Marshaller jaxbMarshaller = jaxbContext.createMarshaller();
            jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);

            jaxbMarshaller.marshal(t, System.out);

        } catch (JAXBException e) {
            LOGGER.error(e);
            throw new WebApplicationException(e, Response
                    .status(Status.INTERNAL_SERVER_ERROR).entity(e.toString())
                    .type(MediaType.TEXT_PLAIN).build());
        }
        // call the URL to save
        String urlStr = MessageFormat.format(saveQTemplURL,
                props.get(DS_HOST_PROP), props.get(DS_PORT_PROP), t.getOwner(),
                t.getName());
        MiscUtil._instance.postJAXBXML(urlStr, basicAuth, t, "DELETE");
        LOGGER.debug("deleteQueryTemplate URL " + urlStr);
        return "Deleted Successfully";
    }

    public List<String> getGroupOptions(String user) {
        List<String> groups = MiscUtil._instance.getGroupsForUser(user,
                (String) props.get("ldap.svc.user"),
                (String) values.get(props.get("ldap.svc.user.valuesLookup")),
                (String) props.get("ldap.ad.server"),
                (String) props.get("ldap.search.group"));
        //Remove groups that are not registered
        String registeredGroups = (String) props.get("owner.ADGroups");
        for(Iterator<String> itr = groups.iterator(); itr.hasNext();) {
            String thisGroup = itr.next();
            if(!registeredGroups.contains(thisGroup)) {
                itr.remove();
            }
        }
        
        return groups;
    }

    public Properties getProps() {
        return props;
    }

    public Properties getValues() {
        return values;
    }

    public String executeQueryTemplate(String owner, String name,
            List<Param> paramsList, String resultFormat, String basicAuth) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < paramsList.size(); i++) {
            if (i > 0) {
                sb.append("&");
            }
            sb.append(paramsList.get(i).getParamName());
            sb.append("=");
            sb.append(paramsList.get(i).getArgValue());
        }
        String urlStr = MessageFormat.format(execQTemplURL,
                props.get(DS_HOST_PROP), props.get(DS_PORT_PROP), owner, name,
                sb.toString());
        return MiscUtil._instance.executeURLForString(urlStr, basicAuth,
                resultFormat);
    }

    public String validateSelector(QueryTemplate queryTemplate, String basicAuth) {
        String selector = MiscUtil._instance
                .buildSelector(queryTemplate, false);
        String urlStr = MessageFormat.format(parseSelector,
                props.get(DS_HOST_PROP), props.get(DS_PORT_PROP),
                queryTemplate.getEntity(), selector);
        try {
            MiscUtil._instance.executeURLForString(urlStr, basicAuth, null);
        } catch (WebApplicationException e) {
            // upgrade later
            throw e;
        }
        return "Valid Selector";
    }

    /******************************************************************************* Pub Templates *******************************************************/

    public List<Symbol> getSymbols() {
        return QueryRunner._instance.getSymbols(ds);
    }

    public void savePubTemplate(PubTemplate pubTemplate, String loggedInUser,
            String basicAuth, List<Symbol> symList, List<Symbol> userDefSymList, SSHManager sSHManager) {
        saveQuery(pubTemplate.getQueryTemplate(), basicAuth);
        QueryRunner._instance.savePubTemplate(ds, pubTemplate, loggedInUser);
        deployPubTemplate(pubTemplate, symList, userDefSymList, sSHManager);
    }
    
    public void insertPubTemplate(PubTemplate pubTemplate, String loggedInUser,
            String basicAuth, List<Symbol> symList, List<Symbol> userDefSymList, SSHManager sSHManager) {
        saveQuery(pubTemplate.getQueryTemplate(), basicAuth);
        QueryRunner._instance.insertPubTemplate(ds, pubTemplate, loggedInUser);
        deployPubTemplate(pubTemplate, symList, userDefSymList, sSHManager);
    }

    public List<TemplateKey> getPubTemplateKeys(String owner) {
        return QueryRunner._instance.getPubTemplateKeys(ds, owner);
    }

    public PubTemplate getPubTemplateFromKey(String owner, String name,
            String basicAuth) {
        PubTemplate pubTemplate = QueryRunner._instance.getPubTemplateFromKey(ds, owner, name);
        pubTemplate.setQuerytemplate(getQueryTemplateFromKey(pubTemplate.getQueryTemplate().getOwner(), 
                    pubTemplate.getQueryTemplate().getTemplateName(), 
                    basicAuth));
        return pubTemplate;
    }

    public List<Symbol> getUserDefinedSymbols(String owner) {
        return QueryRunner._instance.getUserDefinedSymbols(ds, owner);
    }

    public List<String> getDAFieldValues(String field) {
        return QueryRunner._instance.getDAFieldValues(ds, field);
    }

    public void deletePubTemplate(PubTemplate pubTemplate,
            String basicAuth, SSHManager sSHManager) {
        deleteQuery(pubTemplate.getQueryTemplate(), basicAuth);
        QueryRunner._instance.deletePubTemplate(ds, pubTemplate);
        undeployPubTemplate(pubTemplate, sSHManager);
    }
    
    public void deployPubTemplate(PubTemplate pubTemplate, List<Symbol> symList, List<Symbol> userDefSymList, SSHManager sSHManager) {
        Publication pub = MiscUtil._instance.convertPubTemplateToPublication(pubTemplate,
                symList, userDefSymList);
        LOGGER.debug("Temp Dir Location" + System.getProperty("java.io.tmpdir"));
        MiscUtil._instance.generatePublicationFile(pub, getPubFileName(pub.getName()), /*"O://Garima//work//QueryBuilder//xmls"*/ System.getProperty("java.io.tmpdir"), props.getProperty("pub.deploy.path") ,sSHManager);
    }
    
    public void undeployPubTemplate(PubTemplate pubTemplate, SSHManager sSHManager) {
        MiscUtil._instance.deletePublicationFile(getPubFileName(pubTemplate.getPubName()), /*"O://Garima//work//QueryBuilder//xmls"*/ props.getProperty("pub.deploy.path") ,sSHManager);
    }
    
    public SSHManager getSSHManagerInstance() {
        String userName = 
            props.getProperty("pub.deploy.user");
       String password = 
               (String) values.get(props.get("pub.deploy.valuesLookup"));
       String connectionIP = 
               props.getProperty("pub.deploy.host");
       
       SSHManager instance = new SSHManager(userName, password, connectionIP, "");
    
       instance.connect();
       
       return instance;
    }
    
    public String getPubFileName (String pubName) {
        StringBuilder fileName = new StringBuilder();
        //fileName.append(pubName.replace(' ', '_').replace('*', '_').replace('.', '_'));
        fileName.append(pubName.replaceAll("\\W", "_"));
        fileName.append(".xml");
        LOGGER.debug("File Name Generated from pubName" + pubName + fileName.toString());
        return fileName.toString();
    }

}
