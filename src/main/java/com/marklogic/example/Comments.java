package com.marklogic.example;

// IMPORTANT: Do not edit. This file is generated.

import com.marklogic.client.io.Format;
import com.marklogic.client.io.marker.AbstractWriteHandle;


import com.marklogic.client.DatabaseClient;

import com.marklogic.client.impl.BaseProxy;

/**
 * Provides a set of operations on the database server
 */
public interface Comments {
    /**
     * Creates a Comments object for executing operations on the database server.
     *
     * The DatabaseClientFactory class can create the DatabaseClient parameter. A single
     * client object can be used for any number of requests and in multiple threads.
     *
     * @param db	provides a client for communicating with the database server
     * @return	an object for session state
     */
    static Comments on(DatabaseClient db) {
        final class CommentsImpl implements Comments {
            private BaseProxy baseProxy;

            private CommentsImpl(DatabaseClient dbClient) {
                baseProxy = new BaseProxy(dbClient, "/ds/comments/");
            }

            @Override
            public com.fasterxml.jackson.databind.JsonNode list(String articleId, Integer limit) {
              return BaseProxy.JsonDocumentType.toJsonNode(
                baseProxy
                .request("list.sjs", BaseProxy.ParameterValuesKind.MULTIPLE_ATOMICS)
                .withSession()
                .withParams(
                    BaseProxy.atomicParam("articleId", false, BaseProxy.StringType.fromString(articleId)),
                    BaseProxy.atomicParam("limit", false, BaseProxy.IntegerType.fromInteger(limit)))
                .withMethod("POST")
                .responseSingle(false, Format.JSON)
                );
            }


            @Override
            public com.fasterxml.jackson.databind.JsonNode insert(String user, String comment, String articleId) {
              return BaseProxy.JsonDocumentType.toJsonNode(
                baseProxy
                .request("insert.sjs", BaseProxy.ParameterValuesKind.MULTIPLE_ATOMICS)
                .withSession()
                .withParams(
                    BaseProxy.atomicParam("user", false, BaseProxy.StringType.fromString(user)),
                    BaseProxy.atomicParam("comment", false, BaseProxy.StringType.fromString(comment)),
                    BaseProxy.atomicParam("articleId", false, BaseProxy.StringType.fromString(articleId)))
                .withMethod("POST")
                .responseSingle(false, Format.JSON)
                );
            }

        }

        return new CommentsImpl(db);
    }

  /**
   * Invokes the list operation on the database server
   *
   * @param articleId	provides input
   * @param limit	provides input
   * @return	as output
   */
    com.fasterxml.jackson.databind.JsonNode list(String articleId, Integer limit);

  /**
   * Invokes the insert operation on the database server
   *
   * @param user	provides input
   * @param comment	provides input
   * @param articleId	provides input
   * @return	as output
   */
    com.fasterxml.jackson.databind.JsonNode insert(String user, String comment, String articleId);

}
