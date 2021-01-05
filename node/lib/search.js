// GENERATED - DO NOT EDIT!
"use strict";
/**
* Provides a set of operations on the database server
*/
class Search {
  /**
  * A convenience factory that calls the constructor to create the Search object for executing operations
  * on the database server.
  * @param {DatabaseClient} client - the client for accessing the database server as the user
  * @param {object} [serviceDeclaration] - an optional declaration for a custom implementation of the service
  * @returns {Search} the object for the database operations
  */
  static on(client, serviceDeclaration) {
    return new Search(client, serviceDeclaration);
  }
  /**
  * The constructor for creating a Search object for executing operations on the database server.
  * @param {DatabaseClient} client - the client for accessing the database server as the user
  * @param {object} [serviceDeclaration] - an optional declaration for a custom implementation of the service
  */
  constructor(client, serviceDeclaration) {
    if (client === undefined || client === null) {
      throw new Error("missing required client");
    }
    if (serviceDeclaration === undefined || serviceDeclaration === null) {
      serviceDeclaration = {
        "endpointDirectory": "/ds/search",
        "$javaClass": "com.marklogic.example.Search"
      };
    }
    this.$mlProxy = client.createProxy(serviceDeclaration).withFunction({
      "functionName": "search",
      "params": [{
        "name": "meshId",
        "datatype": "string",
        "dataKind": "atomic",
        "mimeType": "text/plain",
        "multiple": false,
        "nullable": false
      }, {
        "name": "year",
        "datatype": "int",
        "dataKind": "atomic",
        "mimeType": "text/plain",
        "multiple": false,
        "nullable": false
      }, {
        "name": "wordQuery",
        "datatype": "string",
        "dataKind": "atomic",
        "mimeType": "text/plain",
        "multiple": false,
        "nullable": false
      }, {
        "name": "limit",
        "datatype": "int",
        "dataKind": "atomic",
        "mimeType": "text/plain",
        "multiple": false,
        "nullable": false
      }],
      "return": {
        "datatype": "jsonDocument",
        "$javaClass": "com.fasterxml.jackson.databind.JsonNode",
        "dataKind": "node",
        "mimeType": "application/json",
        "multiple": false,
        "nullable": false
      },
      "maxArgs": 4,
      "paramsKind": "multiAtomic",
      "sessionParam": null,
      "returnKind": "single",
      "$jsOutputMode": "promise"
    }, ".sjs");
  }
  /**
  * Invokes the search operation on the database server.
  * @param {string} meshId - provides an input value of the string datatype,
  * @param {number|string} year - provides an input value of the int datatype,
  * @param {string} wordQuery - provides an input value of the string datatype,
  * @param {number|string} limit - provides an input value of the int datatype
  * @returns {Promise} object value of the jsonDocument data type
  */
  search(meshId, year, wordQuery, limit) {
    return this.$mlProxy.execute("search", {
      "meshId": meshId,
      "year": year,
      "wordQuery": wordQuery,
      "limit": limit
    }, arguments.length);
  }
}
module.exports = Search;
