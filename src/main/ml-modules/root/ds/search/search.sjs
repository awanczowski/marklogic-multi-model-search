'use strict';

const op = require('/MarkLogic/optic');

// These values can come in from a users request.
var meshId;
var year;
var wordQuery;
var limit;
var meshDesc = sem.iri('http://id.nlm.nih.gov/mesh/' + meshId);


// Search across the corpus of content given the particular MarkLogic Search Criteria
const search =
    op.fromSearch(cts.andQuery([
        cts.elementRangeQuery('publicationYear', '>=', year),
        cts.wordQuery(wordQuery)
    ]))
    .joinDocUri('uri', op.fragmentIdCol('fragmentId'))

// Pull pertinent metadata from the projected views housed in the row index. 
const article = op.fromView('HubArticle', 'HubArticle', null, op.fragmentIdCol('viewDocId'));

// Set-up a SPARQL query for query expansion
let sparqlQuery = `
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX meshv: <http://id.nlm.nih.gov/mesh/vocab#>
PREFIX mesh: <http://id.nlm.nih.gov/mesh/>
PREFIX dct: <http://purl.org/dc/terms/>

SELECT ?label ?descriptor ?articleId
WHERE {
  ?descriptor meshv:broaderDescriptor* @meshDesc .
  ?descriptor rdfs:label ?label .
  ?articleId dct:references ?descriptor
}
`
const sparql = op.fromSPARQL(sparqlQuery, 'MeSH');

// Join the three plans so the results can be further refined. 
let results = search
    .joinInner(article, op.on('fragmentId', 'viewDocId'))
    .joinInner(sparql, op.on('id', 'articleId'))
    .orderBy(op.desc('score'))
    .limit(limit)
    .result('object', {'meshDesc': meshDesc});

let output = {
    'params': {
        'mesh': meshDesc,
        'year': year,
        'wordQuery': wordQuery,
        'limit': limit
    },
    'results': results
}

output