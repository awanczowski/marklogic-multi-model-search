package com.marklogic.example;

import java.io.Reader;

import com.fasterxml.jackson.databind.JsonNode;
import com.marklogic.client.DatabaseClient;
import com.marklogic.client.DatabaseClientFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Application {

    private static final Logger logger = LoggerFactory.getLogger(Application.class);
    public static final String ARTICLE_ID = "15298351";

    public static void main(String[] args) {
        try {
            DatabaseClient client = getClient("localhost", 8011, "demo-user", "demo123", AuthScheme.DIGEST);
            searchArticles(client);
            writeComments(client);
            listComments(client);
           } catch (IllegalAccessException e) {
            logger.error("Can not create MarkLogic Client: ", e);
        }
    }

    public static void searchArticles(DatabaseClient client) {
        JsonNode result = Search.on(client).search("D003920", 1970, "research", 10);
        logger.info(result.toPrettyString());
    }

    public static void writeComments(DatabaseClient client) {
        Comments.on(client).insert("John", "This is a great article!", ARTICLE_ID);
        Comments.on(client).insert("Jane", "Interesting research.", ARTICLE_ID);
    }

    public static void listComments(DatabaseClient client) {
        JsonNode list = Comments.on(client).list(ARTICLE_ID, 10);
        logger.info(list.toPrettyString());
    }

    /**
     * @param host       - The MarkLogic Host
     * @param port       - The MarkLogic app server port
     * @param user       - The MarkLogic Security User
     * @param password   -  The MarkLogic Security User Password
     * @param authScheme -  The MarkLogic app server authentication scheme
     * @return a {@link DatabaseClient}
     */
    public static DatabaseClient getClient(String host, int port, String user, String password, AuthScheme authScheme) throws IllegalAccessException {
        DatabaseClientFactory.SecurityContext securityContext;
        if (AuthScheme.DIGEST.equals(authScheme)) {
            securityContext = new DatabaseClientFactory.DigestAuthContext(user, password);
        } else if (AuthScheme.BASIC.equals(authScheme)) {
            securityContext = new DatabaseClientFactory.BasicAuthContext(user, password);
        } else {
            throw new IllegalAccessException("Auth Scheme is not supported");
        }

        return DatabaseClientFactory.newClient(host, port, securityContext, DatabaseClient.ConnectionType.GATEWAY);
    }


    public enum AuthScheme {
        BASIC, DIGEST;
    }
}
