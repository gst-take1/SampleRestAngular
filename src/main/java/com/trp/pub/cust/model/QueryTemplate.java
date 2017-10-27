package com.trp.pub.cust.model;

import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class QueryTemplate {
    private String templateName;
    private String owner;
    private String entity;
    private String selector;
    private String resultFormat;
    private List<String> exclList;
    private List<String> inclList;
    private List<Param> paramsList;
    private List<SortBy> sortByList;
    private String reply;

    public String getEntity() {
        return entity;
    }

    public void setEntity(String entity) {
        this.entity = entity;
    }

    public String getSelector() {
        return selector;
    }

    public void setSelector(String selector) {
        this.selector = selector;
    }

    public List<String> getExclList() {
        return exclList;
    }

    public void setExclList(List<String> exclList) {
        this.exclList = exclList;
    }

    public List<String> getInclList() {
        return inclList;
    }

    public void setInclList(List<String> inclList) {
        this.inclList = inclList;
    }

    public List<Param> getParamsList() {
        return paramsList;
    }

    public void setParamsList(List<Param> paramsList) {
        this.paramsList = paramsList;
    }

    public String getResultFormat() {
        return resultFormat;
    }

    public void setResultFormat(String resultFormat) {
        this.resultFormat = resultFormat;
    }

    public List<SortBy> getSortByList() {
        return sortByList;
    }

    public void setSortByList(List<SortBy> sortByList) {
        this.sortByList = sortByList;
    }

    public String getTemplateName() {
        return templateName;
    }

    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }
}
