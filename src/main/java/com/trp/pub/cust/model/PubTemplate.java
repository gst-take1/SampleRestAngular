package com.trp.pub.cust.model;

public class PubTemplate {
    private String event;
    private QueryTemplate queryTemplate;
    private String pubOwner;
    private String pubName;
    private String emptyResult;
    private String dlvLoc;
    private String fileNm;

    public String getEvent() {
        return event;
    }

    public void setEvent(String event) {
        this.event = event;
    }

    public QueryTemplate getQueryTemplate() {
        return queryTemplate;
    }

    public void setQuerytemplate(QueryTemplate queryTemplate) {
        this.queryTemplate = queryTemplate;
    }

    public String getPubOwner() {
        return pubOwner;
    }

    public void setPubOwner(String pubOwner) {
        this.pubOwner = pubOwner;
    }

    public String getPubName() {
        return pubName;
    }

    public void setPubName(String pubName) {
        this.pubName = pubName;
    }

    public String getEmptyResult() {
        return emptyResult;
    }

    public void setEmptyResult(String emptyResult) {
        this.emptyResult = emptyResult;
    }

    public String getFileNm() {
        return fileNm;
    }

    public void setFileNm(String fileNm) {
        this.fileNm = fileNm;
    }

    public String getDlvLoc() {
        return dlvLoc;
    }

    public void setDlvLoc(String dlvLoc) {
        this.dlvLoc = dlvLoc;
    }
}
