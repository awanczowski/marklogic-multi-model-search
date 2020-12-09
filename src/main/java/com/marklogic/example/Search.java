package com.marklogic.example;

// IMPORTANT: Do not edit. This file is generated.

import com.marklogic.client.io.Format;
import com.marklogic.client.io.marker.AbstractWriteHandle;


import com.marklogic.client.DatabaseClient;

import com.marklogic.client.impl.BaseProxy;

/**
 * Provides a set of operations on the database server
 */
public interface Search {
    /**
     * Creates a Search object for executing operations on the database server.
     *
     * The DatabaseClientFactory class can create the DatabaseClient parameter. A single
     * client object can be used for any number of requests and in multiple threads.
     *
     * @param db	provides a client for communicating with the database server
     * @return	an object for session state
     */
    static Search on(DatabaseClient db) {
        final class SearchImpl implements Search {
            private BaseProxy baseProxy;

            private SearchImpl(DatabaseClient dbClient) {
                baseProxy = new BaseProxy(dbClient, "/ds/search/");
            }

            @Override
            public com.fasterxml.jackson.databind.JsonNode search(String meshId, Integer year, String wordQuery, Integer limit) {
              return BaseProxy.JsonDocumentType.toJsonNode(
                baseProxy
                .request("search.sjs", BaseProxy.ParameterValuesKind.MULTIPLE_ATOMICS)
                .withSession()
                .withParams(
                    BaseProxy.atomicParam("meshId", false, BaseProxy.StringType.fromString(meshId)),
                    BaseProxy.atomicParam("year", false, BaseProxy.IntegerType.fromInteger(year)),
                    BaseProxy.atomicParam("wordQuery", false, BaseProxy.StringType.fromString(wordQuery)),
                    BaseProxy.atomicParam("limit", false, BaseProxy.IntegerType.fromInteger(limit)))
                .withMethod("POST")
                .responseSingle(false, Format.JSON)
                );
            }

        }

        return new SearchImpl(db);
    }

  /**
   * Invokes the search operation on the database server
   *
   * @param meshId	provides input
   * @param year	provides input
   * @param wordQuery	provides input
   * @param limit	provides input
   * @return	as output
   */
    com.fasterxml.jackson.databind.JsonNode search(String meshId, Integer year, String wordQuery, Integer limit);

}
