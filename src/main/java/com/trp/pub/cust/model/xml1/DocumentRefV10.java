//
// This file was generated by the JavaTM Architecture for XML Binding(JAXB) Reference Implementation, vJAXB 2.1.10 in JDK 6 
// See <a href="http://java.sun.com/xml/jaxb">http://java.sun.com/xml/jaxb</a> 
// Any modifications to this file will be lost upon recompilation of the source schema. 
// Generated on: 2016.06.14 at 11:54:57 AM EDT 
//

package com.trp.pub.cust.model.xml1;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;
import javax.xml.namespace.QName;

/**
 * <p>
 * Java class for DocumentRef-v1.0 complex type.
 * 
 * <p>
 * The following schema fragment specifies the expected content contained within
 * this class.
 * 
 * <pre>
 * &lt;complexType name="DocumentRef-v1.0">
 *   &lt;complexContent>
 *     &lt;extension base="{http://trp/inv/cmm/1.0}MessageBody">
 *       &lt;sequence>
 *         &lt;element name="Property">
 *           &lt;complexType>
 *             &lt;complexContent>
 *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                 &lt;sequence>
 *                   &lt;element ref="{http://trp/inv/cmm/1.0}Feed" minOccurs="0"/>
 *                   &lt;element ref="{http://trp/inv/cmm/1.0}FeedFile" maxOccurs="unbounded" minOccurs="0"/>
 *                 &lt;/sequence>
 *               &lt;/restriction>
 *             &lt;/complexContent>
 *           &lt;/complexType>
 *         &lt;/element>
 *         &lt;element name="Part" maxOccurs="unbounded">
 *           &lt;complexType>
 *             &lt;complexContent>
 *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                 &lt;sequence>
 *                   &lt;element name="Type" type="{http://www.w3.org/2001/XMLSchema}QName"/>
 *                   &lt;element name="DataFile" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *                 &lt;/sequence>
 *               &lt;/restriction>
 *             &lt;/complexContent>
 *           &lt;/complexType>
 *         &lt;/element>
 *       &lt;/sequence>
 *     &lt;/extension>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "DocumentRef-v1.0", propOrder = { "property", "part" })
public class DocumentRefV10 extends MessageBody {

    @XmlElement(name = "Property", required = true)
    protected DocumentRefV10.Property property;
    @XmlElement(name = "Part", required = true)
    protected List<DocumentRefV10.Part> part;

    /**
     * Gets the value of the property property.
     * 
     * @return possible object is {@link DocumentRefV10 .Property }
     * 
     */
    public DocumentRefV10.Property getProperty() {
        return property;
    }

    /**
     * Sets the value of the property property.
     * 
     * @param value
     *            allowed object is {@link DocumentRefV10 .Property }
     * 
     */
    public void setProperty(DocumentRefV10.Property value) {
        this.property = value;
    }

    /**
     * Gets the value of the part property.
     * 
     * <p>
     * This accessor method returns a reference to the live list, not a
     * snapshot. Therefore any modification you make to the returned list will
     * be present inside the JAXB object. This is why there is not a
     * <CODE>set</CODE> method for the part property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * 
     * <pre>
     * getPart().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link DocumentRefV10 .Part }
     * 
     * 
     */
    public List<DocumentRefV10.Part> getPart() {
        if (part == null) {
            part = new ArrayList<DocumentRefV10.Part>();
        }
        return this.part;
    }

    /**
     * <p>
     * Java class for anonymous complex type.
     * 
     * <p>
     * The following schema fragment specifies the expected content contained
     * within this class.
     * 
     * <pre>
     * &lt;complexType>
     *   &lt;complexContent>
     *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
     *       &lt;sequence>
     *         &lt;element name="Type" type="{http://www.w3.org/2001/XMLSchema}QName"/>
     *         &lt;element name="DataFile" type="{http://www.w3.org/2001/XMLSchema}string"/>
     *       &lt;/sequence>
     *     &lt;/restriction>
     *   &lt;/complexContent>
     * &lt;/complexType>
     * </pre>
     * 
     * 
     */
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "", propOrder = { "type", "dataFile" })
    public static class Part {

        @XmlElement(name = "Type", required = true)
        protected QName type;
        @XmlElement(name = "DataFile", required = true)
        protected String dataFile;

        /**
         * Gets the value of the type property.
         * 
         * @return possible object is {@link QName }
         * 
         */
        public QName getType() {
            return type;
        }

        /**
         * Sets the value of the type property.
         * 
         * @param value
         *            allowed object is {@link QName }
         * 
         */
        public void setType(QName value) {
            this.type = value;
        }

        /**
         * Gets the value of the dataFile property.
         * 
         * @return possible object is {@link String }
         * 
         */
        public String getDataFile() {
            return dataFile;
        }

        /**
         * Sets the value of the dataFile property.
         * 
         * @param value
         *            allowed object is {@link String }
         * 
         */
        public void setDataFile(String value) {
            this.dataFile = value;
        }

    }

    /**
     * <p>
     * Java class for anonymous complex type.
     * 
     * <p>
     * The following schema fragment specifies the expected content contained
     * within this class.
     * 
     * <pre>
     * &lt;complexType>
     *   &lt;complexContent>
     *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
     *       &lt;sequence>
     *         &lt;element ref="{http://trp/inv/cmm/1.0}Feed" minOccurs="0"/>
     *         &lt;element ref="{http://trp/inv/cmm/1.0}FeedFile" maxOccurs="unbounded" minOccurs="0"/>
     *       &lt;/sequence>
     *     &lt;/restriction>
     *   &lt;/complexContent>
     * &lt;/complexType>
     * </pre>
     * 
     * 
     */
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "", propOrder = { "feed", "feedFile" })
    public static class Property {

        @XmlElement(name = "Feed")
        protected String feed;
        @XmlElement(name = "FeedFile")
        protected List<String> feedFile;

        /**
         * Gets the value of the feed property.
         * 
         * @return possible object is {@link String }
         * 
         */
        public String getFeed() {
            return feed;
        }

        /**
         * Sets the value of the feed property.
         * 
         * @param value
         *            allowed object is {@link String }
         * 
         */
        public void setFeed(String value) {
            this.feed = value;
        }

        /**
         * Gets the value of the feedFile property.
         * 
         * <p>
         * This accessor method returns a reference to the live list, not a
         * snapshot. Therefore any modification you make to the returned list
         * will be present inside the JAXB object. This is why there is not a
         * <CODE>set</CODE> method for the feedFile property.
         * 
         * <p>
         * For example, to add a new item, do as follows:
         * 
         * <pre>
         * getFeedFile().add(newItem);
         * </pre>
         * 
         * 
         * <p>
         * Objects of the following type(s) are allowed in the list
         * {@link String }
         * 
         * 
         */
        public List<String> getFeedFile() {
            if (feedFile == null) {
                feedFile = new ArrayList<String>();
            }
            return this.feedFile;
        }

    }

}
