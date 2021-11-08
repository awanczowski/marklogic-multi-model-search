'use strict';

const op = require('/MarkLogic/optic');

/** User Inputs **/
var qtext = "subject:D003920 AND year GE 1970";
let query = expandQuery(qtext);
var page = 0;
var limit = 10;

/**
 * Build a search query to be used in the optic plan. 
 * @param qtext - User Search Text using MarkLogic Search Grammar.
 * @returns a cts.query that can be used in optic search.
 */
function expandQuery(qtext) {
    var sparql = `
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX meshv: <http://id.nlm.nih.gov/mesh/vocab#>
    SELECT ?label
    WHERE {
      ?descriptor meshv:broaderDescriptor* @meshId .
      ?descriptor rdfs:label ?label 
    }`;

    var options = {
        year: cts.elementReference('publicationYear'),
        subject: (operator, values, options) => {
            let terms =
                op.fromSPARQL(sparql)
                    .map(row => cts.elementValueQuery("DescriptorName", row.label, ['exact']))
                    .result(null, { meshId: sem.iri('http://id.nlm.nih.gov/mesh/' + fn.subsequence(values, 1, 1)) })
                return cts.orQuery(Array.from(terms), "synonym")
        }
    };

    /** Parse the natural language query **/
    var query = cts.andQuery([
        cts.parse(qtext, options),
        cts.collectionQuery("HubArticle")
    ]);

    return query;
}

function prepFacet(row) {
  let result = [];
  for (let facet in row) {
    result.push(row);
  }
  return result
}

// Search across the corpus of content given the particular MarkLogic Search Criteria
const docSearch = op.fromSearch(query);

// Pull pertinent metadata from the projected views housed in the row index. 
const article = op.fromView('HubArticle', 'HubArticle', null, op.fragmentIdCol('viewDocId'));

// Base Query
let opticQuery = docSearch.joinInner(article, op.on('fragmentId', 'viewDocId'));   

// Fetch and Process Facets
let facets = {};
let facetResults = fn.head(opticQuery.facetBy([op.namedGroup('publication', 'publication'), op.namedGroup('publicationYear', 'publicationYear')]).result());
for (let key of Object.keys(facetResults)) {
     // Order the facets by count descending and take the top 10. 
     facets[key] = Array.from(facetResults[key]).sort((a, b) => b.count - a.count ).splice(0, 10) 
}

let result = {
  "estimation": cts.estimate(query),
  "facets": facets,
  "result": Array.from(opticQuery
                 .offset(page * limit)
                 .limit(limit)
                 .orderBy(op.desc('score'))
                 .result())
}

/** Output the results **/
result