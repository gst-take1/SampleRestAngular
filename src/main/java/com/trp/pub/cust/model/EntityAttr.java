package com.trp.pub.cust.model;

import java.io.Serializable;
import java.util.Comparator;

public class EntityAttr {
    private String attrName;
    private String attrType;

    public String getAttrName() {
        return attrName;
    }

    public void setAttrName(String attrName) {
        this.attrName = attrName;
    }

    public String getAttrType() {
        return attrType;
    }

    public void setAttrType(String attrType) {
        this.attrType = attrType;
    }

    public static class AttrNameComparator implements Comparator<EntityAttr>, Serializable {
        private static final long serialVersionUID = 1;
        @Override
        public int compare(EntityAttr o1, EntityAttr o2) {
            return o1.getAttrName().compareTo(o2.getAttrName());
        }

    }
}
