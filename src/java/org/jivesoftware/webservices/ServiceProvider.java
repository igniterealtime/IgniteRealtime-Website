/**
 * $Revision$
 * $Date$
 *
 * Copyright (C) 2006 Jive Software. All rights reserved.
 *
 * This software is published under the terms of the GNU Public License (GPL),
 * a copy of which is included in this distribution.
 */
package org.jivesoftware.webservices;

import com.jivesoftware.community.webservices.ForumService;
import com.jivesoftware.community.webservices.BlogService;
import com.jivesoftware.community.webservices.UserService;

import javax.xml.ws.Binding;
import javax.xml.ws.Service;
import javax.xml.ws.BindingProvider;
import javax.xml.namespace.QName;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.xml.ws.handler.Handler;
import java.net.URL;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Daniel Henninger
 */
public class ServiceProvider {

    final static String WS_NAMESPACE = "http://jivesoftware.com/clearspace/webservices";

    String url;
    String soapBaseUrl;
    String username;
    String password;
    Service forumServiceProvider;
    Service blogServiceProvider;
    Service userServiceProvider;

    public ServiceProvider(ServletConfig config) {
        ServletContext ctx = config.getServletContext();
        url = ctx.getInitParameter("csc_baseurl");
        soapBaseUrl = url + "/rpc/soap";
        username = ctx.getInitParameter("csc_username");
        password = ctx.getInitParameter("csc_password");

        try {
            // Set up forum service
            String forumServiceURL = soapBaseUrl+"/ForumService";
            URL wsdlURL = new URL(forumServiceURL+"?wsdl");
            QName SERVICE_NAME = new QName(WS_NAMESPACE, "ForumService");
            forumServiceProvider = Service.create(wsdlURL, SERVICE_NAME);
        }
        catch (MalformedURLException e) {
            System.out.println("Illegal url: "+e);
        }

        try {
            // Set up blog service
            String blogServiceURL = soapBaseUrl+"/BlogService";
            URL wsdlURL = new URL(blogServiceURL+"?wsdl");
            QName SERVICE_NAME = new QName(WS_NAMESPACE, "BlogService");
            blogServiceProvider = Service.create(wsdlURL, SERVICE_NAME);
        }
        catch (MalformedURLException e) {
            System.out.println("Illegal url: "+e);
        }

        try {
            // Set up blog service
            String userServiceURL = soapBaseUrl+"/UserService";
            URL wsdlURL = new URL(userServiceURL+"?wsdl");
            QName SERVICE_NAME = new QName(WS_NAMESPACE, "UserService");
            userServiceProvider = Service.create(wsdlURL, SERVICE_NAME);
        }
        catch (MalformedURLException e) {
            System.out.println("Illegal url: "+e);
        }
    }

    private void bindCallbackService(BindingProvider bp) {
        bp.getRequestContext().put(BindingProvider.USERNAME_PROPERTY, username);
        bp.getRequestContext().put(BindingProvider.PASSWORD_PROPERTY, password);

        Binding serviceBinding = bp.getBinding();
        PasswordCallback authnHandler = new PasswordCallback(username, password);
        List<Handler> handlerChain = new ArrayList<Handler>();
        handlerChain.add(authnHandler);
        serviceBinding.setHandlerChain(handlerChain);
    }

    public ForumService getForumService() {
        ForumService service = forumServiceProvider.getPort(ForumService.class);
        bindCallbackService((BindingProvider) service);
        return service;
    }

    public BlogService getBlogService() {
        BlogService service = blogServiceProvider.getPort(BlogService.class);
        bindCallbackService((BindingProvider) service);
        return service;
    }

    public UserService getUserService() {
        UserService service = userServiceProvider.getPort(UserService.class);
        bindCallbackService((BindingProvider) service);
        return service;
    }
}
