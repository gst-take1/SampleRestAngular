package com.trp.pub.cust.model;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Param {
    //@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)

    private String dataType;
    private String paramName;
    private String argValue;
    
    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public String getParamName() {
        return paramName;
    }

    public void setParamName(String paramName) {
        this.paramName = paramName;
    }

    public String getArgValue() {
        return argValue;
    }

    public void setArgValue(String argValue) {
        this.argValue = argValue;
    }
}
