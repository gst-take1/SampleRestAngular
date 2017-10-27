package com.trp.pub.cust.model;

public class SymbolType {
    private String symType;
    private String dataType;
    private Boolean multiValued;
    private Boolean definedPerEnv;
    private Boolean userDefined;
    private String description;

    public String getSymType() {
        return symType;
    }

    public void setSymType(String symType) {
        this.symType = symType;
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public Boolean getMultiValued() {
        return multiValued;
    }

    public void setMultiValued(Boolean multiValued) {
        this.multiValued = multiValued;
    }

    public Boolean getDefinedPerEnv() {
        return definedPerEnv;
    }

    public void setDefinedPerEnv(Boolean definedPerEnv) {
        this.definedPerEnv = definedPerEnv;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getUserDefined() {
        return userDefined;
    }

    public void setUserDefined(Boolean userDefined) {
        this.userDefined = userDefined;
    }
}
