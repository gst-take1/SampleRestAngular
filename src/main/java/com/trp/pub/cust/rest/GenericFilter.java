package com.trp.pub.cust.rest;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

public class GenericFilter implements Filter {
    

    @Override
    public void destroy() {
        /*
         * no-op
         */
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res,
            FilterChain chain) throws IOException, ServletException {
        if (System.getProperty("port") == null) {
            System.setProperty("port", String.valueOf(req.getLocalPort()));
        }
        HttpSession session = ((HttpServletRequest) req).getSession(true);
        if (((HttpServletRequest) req).getUserPrincipal() != null) {  
            session.setAttribute(QueryBuilderApplication.LOGGED_IN_USER, ((HttpServletRequest) req)
                    .getUserPrincipal().getName());
        
            String auth =  ((HttpServletRequest) req).getHeader(QueryBuilderApplication.AUTH);
            if(auth != null) {
                session.setAttribute(QueryBuilderApplication.AUTH, auth);
            }
        }
        chain.doFilter(req, res);
    }

    @Override
    public void init(FilterConfig arg0) throws ServletException {
        /*
         * no-op
         */
    }

}
