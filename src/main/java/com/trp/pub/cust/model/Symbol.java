package com.trp.pub.cust.model;

import java.util.Date;

public class Symbol {
    private String symbolName;
    private String dataType;
    private String symbolValue;
    private String desc;
    private String symbolType;

    private String updatedBy;
    private Date updatedAt;

    private String symbolOwner;

    public String getSymbolName() {
        return symbolName;
    }

    public void setSymbolName(String symbolName) {
        this.symbolName = symbolName;
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public String getSymbolValue() {
        return symbolValue;
    }

    public void setSymbolValue(String symbolValue) {
        this.symbolValue = symbolValue;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public void setSymbolType(String symbolType) {
        this.symbolType = symbolType;
    }

    public String getSymbolType() {
        return symbolType;
    }

    public String getSymbolOwner() {
        return symbolOwner;
    }

    public void setSymbolOwner(String symbolOwner) {
        this.symbolOwner = symbolOwner;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

}
