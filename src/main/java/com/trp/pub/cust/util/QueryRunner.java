package com.trp.pub.cust.util;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.GregorianCalendar;
import java.util.List;

import javax.sql.DataSource;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;

import org.apache.log4j.Logger;

import com.trp.pub.cust.model.PubTemplate;
import com.trp.pub.cust.model.QueryTemplate;
import com.trp.pub.cust.model.Symbol;
import com.trp.pub.cust.model.xml1.TemplateKeys.TemplateKey;
import com.trp.pub.cust.rest.ThrowableExceptionMapper;

public class QueryRunner {
    private static final Logger LOGGER = Logger.getLogger(QueryRunner.class
            .getName());
    public static final QueryRunner _instance = new QueryRunner();

    private static final String GET_DA_EVENTS = "select evt_nm from appdz28.pbl_evt";

    private static final String GET_SYMBOLS = "select sym_nm, dsc, dat_typ, sym_typ, val from appdz28.pbl_sys_sym sys_sym";

    private static final String GET_USER_DEF_SYMBOLS = "select sym_nm, dsc, dat_typ, sym_typ, val from appdz28.pbl_usr_def_sym sys_sym where sym_onr = ?";

    private static final String MERGE_PBL_TPL = "merge into appdz28.pbl_tpl tpl using  "
            + "(select ? as pbl_tpl_nm , ? as pbl_tpl_onr_nm from dual) exist_tpl "
            + "on (exist_tpl.pbl_tpl_nm = tpl.pbl_tpl_nm and exist_tpl.pbl_tpl_onr_nm = tpl.pbl_tpl_onr_nm) "
            + "when not MATCHED then "
            + " INSERT (tpl.pbl_tpl_id, tpl.pbl_tpl_nm, tpl.pbl_tpl_onr_nm, tpl.dsvc_tpl_nm, tpl.dsvc_tpl_onr_nm, tpl.pbl_evt_nm, tpl.dlv_loc, tpl.fle_nm, tpl.emp_res, tpl.crtd_by_usr_id, tpl.lst_upd_by_usr_id)  "
            + " VALUES (appdz28.pbl_tpl_seq.nextval, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) "
            + "when matched then "
            + " update set tpl.pbl_evt_nm = ?, tpl.dlv_loc = ?, tpl.fle_nm = ?, tpl.emp_res = ?, tpl.lst_upd_by_ts = systimestamp, tpl.lst_upd_by_usr_id = ?";

    private static final String GET_PUB_TPL_KEYS = "select pbl_tpl_nm, pbl_tpl_onr_nm, crtd_by_ts, lst_upd_by_ts from appdz28.pbl_tpl where pbl_tpl_onr_nm = ? ";

    private static final String GET_PUB_TPL_FROM_KEY = "select pbl_tpl_nm, pbl_tpl_onr_nm, pbl_evt_nm, emp_res, dlv_loc, fle_nm, dsvc_tpl_nm, pbl_tpl_onr_nm  from appdz28.pbl_tpl "
            + "where pbl_tpl_nm = ? and pbl_tpl_onr_nm = ?";

    private static final String DELETE_PBL_TPL = "delete from appdz28.pbl_tpl where pbl_tpl_nm = ? and pbl_tpl_onr_nm = ?";
    
    private static final String INSERT_PBL_TPL = "insert into appdz28.pbl_tpl (pbl_tpl_id, pbl_tpl_nm, pbl_tpl_onr_nm, dsvc_tpl_nm, dsvc_tpl_onr_nm, pbl_evt_nm, dlv_loc, fle_nm, emp_res, crtd_by_usr_id, lst_upd_by_usr_id) " +
    " values (appdz28.pbl_tpl_seq.nextval, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    public List<String> getDAEvents(DataSource ds) {
        Connection conn = null;
        PreparedStatement stmt1 = null;

        ResultSet rs = null;
        LOGGER.debug(GET_DA_EVENTS);
        List<String> result = new ArrayList<String>();
        try {
            conn = ds.getConnection();
            stmt1 = conn.prepareStatement(GET_DA_EVENTS);

            rs = stmt1.executeQuery();
            while (rs.next()) {
                result.add(rs.getString(1));
            }
        } catch (SQLException e) {
            LOGGER.error("Exception in ",  e);
            throw new WebApplicationException(e, Response
                    .status(Status.INTERNAL_SERVER_ERROR).entity(e.toString())
                    .type(MediaType.TEXT_PLAIN).build());
        } finally {
            closeConnection(rs, stmt1, conn);
        }
        return result;
    }

    private void closeConnection(ResultSet rs, Statement stmt, Connection conn) {
        if (rs != null) {
            try {
                rs.close();
            } catch (SQLException e) {
                LOGGER.error("Exception in ",  e);
            }
        }
        if (stmt != null) {
            try {
                stmt.close();
            } catch (SQLException e) {
                LOGGER.error("Exception in ",  e);
            }
        }
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException e) {
                LOGGER.error("Exception in ",  e);
            }
        }
    }

    public List<Symbol> getSymbols(DataSource ds) {
        Connection conn = null;
        PreparedStatement stmt1 = null;

        ResultSet rs = null;
        LOGGER.debug(GET_SYMBOLS);
        List<Symbol> result = new ArrayList<Symbol>();
        try {
            conn = ds.getConnection();
            stmt1 = conn.prepareStatement(GET_SYMBOLS);
            rs = stmt1.executeQuery();
            while (rs.next()) {
                Symbol sysSym = new Symbol();
                sysSym.setSymbolName(rs.getString("sym_nm"));
                sysSym.setDataType(rs.getString("dat_typ"));
                sysSym.setDesc(rs.getString("dsc"));
                sysSym.setSymbolType(rs.getString("sym_typ"));
                sysSym.setSymbolValue(rs.getString("val"));
                result.add(sysSym);
            }
        } catch (SQLException e) {
            LOGGER.error("Exception in ",  e);
            throw new WebApplicationException(e,
                    ThrowableExceptionMapper.buildResponse(e));
        } finally {
            closeConnection(rs, stmt1, conn);
        }
        return result;
    }

    public void savePubTemplate(DataSource ds, PubTemplate pubTemplate,
            String loggedInUser) {
        Connection conn = null;
        PreparedStatement stmt1 = null;

        try {
            conn = ds.getConnection();

            stmt1 = conn.prepareStatement(MERGE_PBL_TPL);

            stmt1.setString(1, pubTemplate.getPubName());
            stmt1.setString(2, pubTemplate.getPubOwner());

            stmt1.setString(3, pubTemplate.getPubName());
            stmt1.setString(4, pubTemplate.getPubOwner());
            stmt1.setString(5, pubTemplate.getQueryTemplate().getTemplateName());
            stmt1.setString(6, pubTemplate.getQueryTemplate().getOwner());
            stmt1.setString(7, pubTemplate.getEvent());
            stmt1.setString(8, pubTemplate.getDlvLoc());
            stmt1.setString(9, pubTemplate.getFileNm());
            stmt1.setString(10, pubTemplate.getEmptyResult());
            stmt1.setString(11, loggedInUser);
            stmt1.setString(12, loggedInUser);

            stmt1.setString(13, pubTemplate.getEvent());
            stmt1.setString(14, pubTemplate.getDlvLoc());
            stmt1.setString(15, pubTemplate.getFileNm());

            stmt1.setString(16, pubTemplate.getEmptyResult());
            stmt1.setString(17, loggedInUser);

            LOGGER.debug("Execute Merge PBL_TPL" + MERGE_PBL_TPL);
            stmt1.execute();
            LOGGER.debug("Merge PBL_TPL Executed" + MERGE_PBL_TPL);

            conn.commit();

        } catch (SQLException e) {
            LOGGER.debug(e);
            throw new WebApplicationException(e,
                    ThrowableExceptionMapper.buildResponse(e));
        } finally {
            closeConnection(null, stmt1, conn);
        }
    }
    
    public void insertPubTemplate(DataSource ds, PubTemplate pubTemplate,
            String loggedInUser) {
        Connection conn = null;
        PreparedStatement stmt1 = null;

        try {
            conn = ds.getConnection();

            stmt1 = conn.prepareStatement(INSERT_PBL_TPL);

            stmt1.setString(1, pubTemplate.getPubName());
            stmt1.setString(2, pubTemplate.getPubOwner());
            stmt1.setString(3, pubTemplate.getQueryTemplate().getTemplateName());
            stmt1.setString(4, pubTemplate.getQueryTemplate().getOwner());
            stmt1.setString(5, pubTemplate.getEvent());
            stmt1.setString(6, pubTemplate.getDlvLoc());
            stmt1.setString(7, pubTemplate.getFileNm());
            stmt1.setString(8, pubTemplate.getEmptyResult());
            stmt1.setString(9, loggedInUser);
            stmt1.setString(10, loggedInUser);

            LOGGER.debug("Execute Insert PBL_TPL" + INSERT_PBL_TPL);
            stmt1.execute();
            LOGGER.debug("Insert PBL_TPL Executed" + INSERT_PBL_TPL);

            conn.commit();

        } catch (SQLException e) {
            LOGGER.debug(e);
            throw new WebApplicationException(e,
                    ThrowableExceptionMapper.buildResponse(e));
        } finally {
            closeConnection(null, stmt1, conn);
        }
    }

    public List<TemplateKey> getPubTemplateKeys(DataSource ds, String owner) {
        Connection conn = null;
        PreparedStatement stmt1 = null;

        ResultSet rs = null;
        LOGGER.debug(GET_PUB_TPL_KEYS);
        List<TemplateKey> result = new ArrayList<TemplateKey>();
        try {
            conn = ds.getConnection();
            stmt1 = conn.prepareStatement(GET_PUB_TPL_KEYS);
            stmt1.setString(1, owner);
            rs = stmt1.executeQuery();
            while (rs.next()) {
                TemplateKey key = new TemplateKey();
                key.setName(rs.getString(1));
                key.setOwner(rs.getString(2));
                GregorianCalendar c = new GregorianCalendar();
                c.setTime(rs.getTimestamp(3));
                key.setCreatedTime(DatatypeFactory.newInstance()
                        .newXMLGregorianCalendar(c));
                c.setTime(rs.getTimestamp(4));
                key.setModifiedTime(DatatypeFactory.newInstance()
                        .newXMLGregorianCalendar(c));

                result.add(key);
            }
        } catch (SQLException e) {
            LOGGER.debug(e);
            throw new WebApplicationException(e,
                    ThrowableExceptionMapper.buildResponse(e));
        } catch (DatatypeConfigurationException e) {
            LOGGER.debug(e);
            throw new WebApplicationException(e,
                    ThrowableExceptionMapper.buildResponse(e));
        } finally {
            closeConnection(rs, stmt1, conn);
        }
        return result;
    }

    public PubTemplate getPubTemplateFromKey(DataSource ds, String owner,
            String name) {
        Connection conn = null;
        PreparedStatement stmt1 = null;

        ResultSet rs = null;
        LOGGER.debug(GET_PUB_TPL_FROM_KEY);
        PubTemplate tpl = null;

        try {
            conn = ds.getConnection();
            stmt1 = conn.prepareStatement(GET_PUB_TPL_FROM_KEY);
            stmt1.setString(1, name);
            stmt1.setString(2, owner);
            rs = stmt1.executeQuery();
            if (rs.next()) {
                tpl = new PubTemplate();
                tpl.setPubName(rs.getString(1));
                tpl.setPubOwner(rs.getString(2));
                tpl.setEvent(rs.getString(3));
                tpl.setEmptyResult(rs.getString(4));
                tpl.setDlvLoc(rs.getString(5));
                tpl.setFileNm(rs.getString(6));

                QueryTemplate qt = new QueryTemplate();
                qt.setTemplateName(rs.getString(7));
                qt.setOwner(rs.getString(8));

                tpl.setQuerytemplate(qt);
            }
            rs.close();

        } catch (SQLException e) {
            
            LOGGER.error("Exception in ",  e);
            throw new WebApplicationException(e,
                    ThrowableExceptionMapper.buildResponse(e));
        } finally {
            closeConnection(rs, stmt1, conn);
        }
        return tpl;
    }

    public List<Symbol> getUserDefinedSymbols(DataSource ds, String owner) {
        Connection conn = null;
        PreparedStatement stmt1 = null;

        ResultSet rs = null;
        LOGGER.debug(GET_USER_DEF_SYMBOLS);
        List<Symbol> result = new ArrayList<Symbol>();

        try {
            conn = ds.getConnection();
            stmt1 = conn.prepareStatement(GET_USER_DEF_SYMBOLS);
            stmt1.setString(1, owner);
            rs = stmt1.executeQuery();
            while (rs.next()) {
                Symbol sysSym = new Symbol();
                sysSym.setSymbolName(rs.getString("sym_nm"));
                sysSym.setSymbolType(rs.getString("sym_typ"));
                sysSym.setDataType(rs.getString("dat_typ"));
                sysSym.setDesc(rs.getString("dsc"));
                sysSym.setSymbolValue(rs.getString("val"));
                result.add(sysSym);
            }

        } catch (SQLException e) {
            LOGGER.debug(e);
            throw new WebApplicationException(e,
                    ThrowableExceptionMapper.buildResponse(e));
        } finally {
            closeConnection(rs, stmt1, conn);
        }
        return result;
    }

    public List<String> getDAFieldValues(DataSource ds, String field) {
        Connection conn = null;
        PreparedStatement stmt1 = null;

        ResultSet rs = null;
        List<String> result = new ArrayList<String>();

        String query = Executor._instance.getProps().getProperty(
                "daFieldValue.query.select")
                + " "
                + Executor._instance.getProps().getProperty(
                        "daFieldValue.query.from");
        String fieldTag = Executor._instance.getProps().getProperty(
                "daFieldValue.query.tag." + field) == null ? field
                : Executor._instance.getProps().getProperty(
                        "daFieldValue.query.tag." + field);
        String queryFormatted = MessageFormat.format(query, fieldTag, fieldTag,
                fieldTag);
        LOGGER.debug("getDAFieldValues query: " + queryFormatted);

        try {
            conn = ds.getConnection();
            stmt1 = conn.prepareStatement(queryFormatted);
            rs = stmt1.executeQuery();
            while (rs.next()) {
                result.add(rs.getString(1));
            }

        } catch (SQLException e) {
            LOGGER.debug(e);
            throw new WebApplicationException(e,
                    ThrowableExceptionMapper.buildResponse(e));
        } finally {
            closeConnection(rs, stmt1, conn);
        }
        return result;
    }

    public void deletePubTemplate(DataSource ds, PubTemplate pubTemplate) {
        Connection conn = null;
        PreparedStatement stmt1 = null;

        try {
            conn = ds.getConnection();
            stmt1 = conn.prepareStatement(DELETE_PBL_TPL);

            stmt1.setString(1, pubTemplate.getPubName());
            stmt1.setString(2, pubTemplate.getPubOwner());

            LOGGER.debug("Execute Delete PBL_TPL" + DELETE_PBL_TPL);
            stmt1.execute();
            LOGGER.debug("Delete PBL_TPL Executed" + DELETE_PBL_TPL);

            conn.commit();

        } catch (SQLException e) {
            LOGGER.debug(e);
            throw new WebApplicationException(e,
                    ThrowableExceptionMapper.buildResponse(e));
        } finally {
            closeConnection(null, stmt1, conn);
        }
    }

}
