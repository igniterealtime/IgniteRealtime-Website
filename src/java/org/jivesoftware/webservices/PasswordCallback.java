package org.jivesoftware.webservices;


import org.apache.ws.security.message.WSSecUsernameToken;
import org.apache.ws.security.message.WSSecHeader;
import org.apache.ws.security.WSConstants;
import org.w3c.dom.Document;


import javax.xml.ws.handler.soap.SOAPMessageContext;
import javax.xml.ws.handler.soap.SOAPHandler;

import javax.xml.namespace.QName;
import javax.xml.soap.*;
import javax.xml.ws.handler.MessageContext;
import javax.xml.rpc.JAXRPCException;
import java.util.Set;

public class PasswordCallback extends BaseHandler<SOAPMessageContext> implements SOAPHandler<SOAPMessageContext> {

	private final String HANDLER_NAME = "PasswordCallback";
	private String wsseUsername= "";
	private String wssePassword = "";

	public PasswordCallback(String wsseUsername, String wssePassword) {
		super();
		super.setHandlerName(HANDLER_NAME);
		this.wssePassword = wssePassword;
		this.wsseUsername = wsseUsername;
	}

	public boolean handleMessage(SOAPMessageContext context) {
		SOAPMessage msg = context.getMessage();

		try {
			SOAPPart soapPart = msg.getSOAPPart();
			SOAPEnvelope env = (SOAPEnvelope) soapPart.getEnvelope();

			Document doc = env.getOwnerDocument();
			WSSecUsernameToken usernameToken = new WSSecUsernameToken();
			usernameToken.setPasswordType(WSConstants.PASSWORD_TEXT);
			usernameToken.setUserInfo(wsseUsername,wssePassword);
			usernameToken.prepare(doc);

			WSSecHeader securityHeader = new WSSecHeader();
			securityHeader.insertSecurityHeader(doc);
			usernameToken.prependToHeader(securityHeader);

		} catch (SOAPException ex) {
			throw new JAXRPCException(ex);
		}

		return true;
	}

	public void close(MessageContext mc) {
	}

	public Set<QName> getHeaders() {
		return null;
	}
}




