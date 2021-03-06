//
// This file was generated by the JavaTM Architecture for XML Binding(JAXB) Reference Implementation, vJAXB 2.1.10 in JDK 6 
// See <a href="http://java.sun.com/xml/jaxb">http://java.sun.com/xml/jaxb</a> 
// Any modifications to this file will be lost upon recompilation of the source schema. 
// Generated on: 2016.06.14 at 11:54:57 AM EDT 
//

package com.trp.pub.cust.model.xml1;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;

/**
 * <p>
 * Java class for IssuePublication-v1.0 complex type.
 * 
 * <p>
 * The following schema fragment specifies the expected content contained within
 * this class.
 * 
 * <pre>
 * &lt;complexType name="IssuePublication-v1.0">
 *   &lt;complexContent>
 *     &lt;extension base="{http://trp/inv/cmm/1.0}Command">
 *       &lt;sequence>
 *         &lt;element name="Name" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="Owner" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="TargetURL" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="EmptyResult">
 *           &lt;simpleType>
 *             &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *               &lt;enumeration value="FAIL"/>
 *               &lt;enumeration value="SKIP"/>
 *             &lt;/restriction>
 *           &lt;/simpleType>
 *         &lt;/element>
 *         &lt;element name="DataQuery" type="{http://trp/inv/cmm/1.0}DataQuery"/>
 *       &lt;/sequence>
 *     &lt;/extension>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "IssuePublication-v1.0", propOrder = { "name", "owner",
        "targetURL", "emptyResult", "dataQuery" })
public class IssuePublicationV10 extends Command {

    @XmlElement(name = "Name", required = true)
    protected String name;
    @XmlElement(name = "Owner", required = true)
    protected String owner;
    @XmlElement(name = "TargetURL", required = true)
    protected String targetURL;
    @XmlElement(name = "EmptyResult", required = true)
    protected String emptyResult;
    @XmlElement(name = "DataQuery", required = true)
    protected DataQuery dataQuery;

    /**
     * Gets the value of the name property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getName() {
        return name;
    }

    /**
     * Sets the value of the name property.
     * 
     * @param value
     *            allowed object is {@link String }
     * 
     */
    public void setName(String value) {
        this.name = value;
    }

    /**
     * Gets the value of the owner property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getOwner() {
        return owner;
    }

    /**
     * Sets the value of the owner property.
     * 
     * @param value
     *            allowed object is {@link String }
     * 
     */
    public void setOwner(String value) {
        this.owner = value;
    }

    /**
     * Gets the value of the targetURL property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getTargetURL() {
        return targetURL;
    }

    /**
     * Sets the value of the targetURL property.
     * 
     * @param value
     *            allowed object is {@link String }
     * 
     */
    public void setTargetURL(String value) {
        this.targetURL = value;
    }

    /**
     * Gets the value of the emptyResult property.
     * 
     * @return possible object is {@link String }
     * 
     */
    public String getEmptyResult() {
        return emptyResult;
    }

    /**
     * Sets the value of the emptyResult property.
     * 
     * @param value
     *            allowed object is {@link String }
     * 
     */
    public void setEmptyResult(String value) {
        this.emptyResult = value;
    }

    /**
     * Gets the value of the dataQuery property.
     * 
     * @return possible object is {@link DataQuery }
     * 
     */
    public DataQuery getDataQuery() {
        return dataQuery;
    }

    /**
     * Sets the value of the dataQuery property.
     * 
     * @param value
     *            allowed object is {@link DataQuery }
     * 
     */
    public void setDataQuery(DataQuery value) {
        this.dataQuery = value;
    }

}
