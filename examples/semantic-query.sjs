'use strict';

const op = require('/MarkLogic/optic');

// These values can come in from a users request. We will statically set them for this example.
const meshDesc = sem.iri('http://id.nlm.nih.gov/mesh/D003920');
const year = 1970;
const wordQuery = 'research';
const limit = 100;


// Set-up a SPARQL query for query expanions
let sparqlQuery = `
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX meshv: <http://id.nlm.nih.gov/mesh/vocab#>
PREFIX mesh: <http://id.nlm.nih.gov/mesh/>
PREFIX dct: <http://purl.org/dc/terms/>

SELECT ?label ?descriptor ?id
WHERE {
  ?descriptor meshv:broaderDescriptor* @meshDesc .
  ?descriptor rdfs:label ?label .
  ?id dct:references ?descriptor
}
`

// Join the two plans on the URI/IRI so the results can be further refined. 
// Configure a Schema (Table) plan that utilzies the generated view from the entity model.
// You can further refine the results using ML search library. 
op.fromView('HubArticle', 'HubArticle')
    .where(
        cts.andQuery([
            cts.elementRangeQuery('publicationYear', '>=', year),
            cts.wordQuery(wordQuery)
        ])
    )
    .joinInner(
        op.fromSPARQL(sparqlQuery, 'MeSH'),
        op.on(op.viewCol('HubArticle', 'id'),
            op.viewCol('MeSH', 'id')))
    .limit(limit)
    .result('object', { 'meshDesc': meshDesc })

