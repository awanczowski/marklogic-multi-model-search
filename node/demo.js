// Import the MarkLogic utilities
const marklogic = require('marklogic');

// import the generated class
const SEARCH = require("./lib/search.js");
const COMMENTS = require("./lib/comments.js");

// Constants for function calls
const ARTICLE_ID = "15298351";

// create a client for the host and port as the user
const client =
    marklogic.createDatabaseClient({
        host: 'localhost',
        port: '8011',
        user: 'demo-user',
        password: 'demo123'
    });

// construct an instance of the class
const comments = COMMENTS.on(client);
const search = SEARCH.on(client);

// Search the article contents. 
search.search("D003920", 1970, "research", 10).then(data => console.log(data));

// Write a comment and list the item after the request is completed. 
comments.insert("John", "This is a great article!", ARTICLE_ID).finally(
    comments.list(ARTICLE_ID, 10).then(data => console.log(data))
);