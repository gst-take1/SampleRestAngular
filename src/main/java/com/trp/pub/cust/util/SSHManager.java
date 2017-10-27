package com.trp.pub.cust.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.ws.rs.WebApplicationException;

import org.apache.log4j.Logger;

import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelExec;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.SftpException;
import com.trp.pub.cust.rest.ThrowableExceptionMapper;

public class SSHManager {
    private static final Logger LOGGER = Logger.getLogger(SSHManager.class
            .getName());
    private JSch jschSSHChannel;
    private String strUserName;
    private String strConnectionIP;
    private int intConnectionPort;
    private String strPassword;
    private Session sesConnection;
    private int intTimeOut;

    public SSHManager(String userName, String password, String connectionIP,
            String knownHostsFileName) {
        doCommonConstructorActions(userName, password, connectionIP,
                knownHostsFileName);
        intConnectionPort = 22;
        intTimeOut = 120000;
    }

    public SSHManager(String userName, String password, String connectionIP,
            String knownHostsFileName, int connectionPort) {
        doCommonConstructorActions(userName, password, connectionIP,
                knownHostsFileName);
        intConnectionPort = connectionPort;
        intTimeOut = 120000;
    }

    public SSHManager(String userName, String password, String connectionIP,
            String knownHostsFileName, int connectionPort,
            int timeOutMilliseconds) {
        doCommonConstructorActions(userName, password, connectionIP,
                knownHostsFileName);
        intConnectionPort = connectionPort;
        intTimeOut = timeOutMilliseconds;
    }
    
    private void doCommonConstructorActions(String userName, String password,
            String connectionIP, String knownHostsFileName) {
        jschSSHChannel = new JSch();

        try {
            jschSSHChannel.setKnownHosts(knownHostsFileName);
        } catch (JSchException jschX) {
            LOGGER.debug("could not read knownHostsFileName", jschX);
        }

        strUserName = userName;
        strPassword = password;
        strConnectionIP = connectionIP;
    }

    public void connect() {
        try {
            sesConnection = jschSSHChannel.getSession(strUserName,
                    strConnectionIP, intConnectionPort);
            sesConnection.setPassword(strPassword);
            sesConnection.setConfig("StrictHostKeyChecking", "no");
            sesConnection.setConfig("PreferredAuthentications",
                    "publickey,keyboard-interactive,password");
            sesConnection.connect(intTimeOut);
            LOGGER.debug("SSH Manager Session " + sesConnection.toString() + " opened");
        } catch (JSchException e) {
            throw new WebApplicationException(e,
                    ThrowableExceptionMapper.buildResponse(e));
        }
    }

    public String sendCommand(String command) {
        StringBuilder outputBuffer = new StringBuilder();
        try {
            Channel channel = sesConnection.openChannel("exec");
            ((ChannelExec) channel).setCommand(command);
            InputStream commandOutput = channel.getInputStream();
            channel.connect();
            int readByte = commandOutput.read();

            while (readByte != 0xffffffff) {
                outputBuffer.append((char) readByte);
                readByte = commandOutput.read();
            }

            channel.disconnect();
        } catch (JSchException e) {
            throw new WebApplicationException(e,
                    ThrowableExceptionMapper.buildResponse(e));
        } catch (IOException e) {
            throw new WebApplicationException(e,
                    ThrowableExceptionMapper.buildResponse(e));
        }

        return outputBuffer.toString();
    }

    public void sftpPut(String lDir, String remoteDir, String fileName) {
        try {
            Channel channel = sesConnection.openChannel("sftp");
            channel.connect();
            ChannelSftp sftpChannel = (ChannelSftp) channel;
            sftpChannel.cd(remoteDir);
            sftpChannel.lcd(lDir);
            FileInputStream fis = new FileInputStream(new File(lDir, fileName));
            sftpChannel.put(fis, fileName);
        } catch (JSchException e) {
            throw new WebApplicationException(e,
                    ThrowableExceptionMapper.buildResponse(e));
        } catch (IOException e) {
            throw new WebApplicationException(e,
                    ThrowableExceptionMapper.buildResponse(e));
        } catch (SftpException e) {
            throw new WebApplicationException(e,
                    ThrowableExceptionMapper.buildResponse(e));
        }
    }

    public void close() {
        sesConnection.disconnect();
        LOGGER.debug("SSH Manager Session " + sesConnection.toString() + " closed");
    }

    public static void main(String[] args) {
        // Code for testing String command =
        // Code for testing
        // " find /idw_dataexchange/non-prod/Qual/SourcePub/ -name archive -prune -o -type f -name \"EagleSecurityReferenceMaster_*_Update.dat\" -newermt \"2016-06-28 13:31:00\" ! -newermt \"2016-06-28 13:36:00\" -print"
        // Code for testing
        // "ls -lt --time-style=\"+%Y-%m-%d %H:%M:%S\"  /idw_dataexchange/non-prod/Dev2/SourcePub/Hinet/HiNetPositionNet_*_Full_AMER.md5|head -n 1|awk '{print $6\" \"$7}'"
        String userName = "appdz28";
        String pa = "changeme";
        String connectionIP = "diidwdex11";

        String result = "ABC";
        SSHManager instance = new SSHManager(userName, pa, connectionIP, "");
        try {
            instance.connect();
            instance.sftpPut("O:\\Garima\\work",
                    "/idw_dataexchange/non-prod/Dev2/SourcePub/depl",
                    "model_red.xml");
        } catch (Exception e) {
            LOGGER.error("Exception in sendCommand " + e);
        } finally {
            instance.close();
        }
        LOGGER.debug(result);
    }

}