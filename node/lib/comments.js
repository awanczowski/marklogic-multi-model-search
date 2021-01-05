// GENERATED - DO NOT EDIT!
"use strict";
/**
* Provides a set of operations on the database server
*/
class Comments {
  /**
  * A convenience factory that calls the constructor to create the Comments object for executing operations
  * on the database server.
  * @param {DatabaseClient} client - the client for accessing the database server as the user
  * @param {object} [serviceDeclaration] - an optional declaration for a custom implementation of the service
  * @returns {Comments} the object for the database operations
  */
  static on(client, serviceDeclaration) {
    return new Comments(client, serviceDeclaration);
  }
  /**
  * The constructor for creating a Comments object for executing operations on the database server.
  * @param {DatabaseClient} client - the client for accessing the database server as the user
  * @param {object} [serviceDeclaration] - an optional declaration for a custom implementation of the service
  */
  constructor(client, serviceDeclaration) {
    if (client === undefined || client === null) {
      throw new Error("missing required client");
    }
    if (serviceDeclaration === undefined || serviceDeclaration === null) {
      serviceDeclaration = {
        "endpointDirectory": "/ds/comments",
        "$javaClass": "com.marklogic.example.Comments"
      };
    }
    this.$mlProxy = client.createProxy(serviceDeclaration).withFunction({
      "functionName": "insert",
      "params": [{
        "name": "user",
        "datatype": "string",
        "dataKind": "atomic",
        "mimeType": "text/plain",
        "multiple": false,
        "nullable": false
      }, {
        "name": "comment",
        "datatype": "string",
        "dataKind": "atomic",
        "mimeType": "text/plain",
        "multiple": false,
        "nullable": false
      }, {
        "name": "articleId",
        "datatype": "string",
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
      "maxArgs": 3,
      "paramsKind": "multiAtomic",
      "sessionParam": null,
      "returnKind": "single",
      "$jsOutputMode": "promise"
    }, ".sjs").withFunction({
      "functionName": "list",
      "params": [{
        "name": "articleId",
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
      "maxArgs": 2,
      "paramsKind": "multiAtomic",
      "sessionParam": null,
      "returnKind": "single",
      "$jsOutputMode": "promise"
    }, ".sjs");
  }
  /**
  * Invokes the insert operation on the database server.
  * @param {string} user - provides an input value of the string datatype,
  * @param {string} comment - provides an input value of the string datatype,
  * @param {string} articleId - provides an input value of the string datatype
  * @returns {Promise} object value of the jsonDocument data type
  */
  insert(user, comment, articleId) {
    return this.$mlProxy.execute("insert", {
      "user": user,
      "comment": comment,
      "articleId": articleId
    }, arguments.length);
  }
  /**
  * Invokes the list operation on the database server.
  * @param {string} articleId - provides an input value of the string datatype,
  * @param {number|string} limit - provides an input value of the int datatype
  * @returns {Promise} object value of the jsonDocument data type
  */
  list(articleId, limit) {
    return this.$mlProxy.execute("list", {
      "articleId": articleId,
      "limit": limit
    }, arguments.length);
  }
}
module.exports = Comments;
