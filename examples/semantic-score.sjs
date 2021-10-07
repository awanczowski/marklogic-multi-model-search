'use strict';

const op = require('/MarkLogic/optic');

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

/**
 * A mapping function to convert the row result from optic to the desired format
 * @param row - Optic Result Row
 * @param query - The initial query used in the search.
 * @returns an Optic Row
 */
function prepareRow(row, query) {
    let matches = [];
    function callback(text, node, queries, start) {
        if (fn.localName(node.xpath('./..')) == "DescriptorName") {
            matches.push(text);
        }
        return "continue";
    }
    cts.walk(row.doc, query, callback)
    row.matches = matches;
    delete row.doc;
    return row;
}

var qtext = "diabetes AND blindness AND year GE 1970";
//var qtext = "subject:D003920 AND blindness AND year GE 1970";

//var qtext = "neoplasm AND filament";
//var qtext = "subject:D009369 AND filament"

//var qtext = '"single-arm" AND Heart Attack'
//var qtext = '"single-arm" AND subject:D006331'

let query = expandQuery(qtext);
var page = 0;
var limit = 250;

// Search across the corpus of content given the particular MarkLogic Search Criteria
const docSearch = op.fromSearchDocs(query);

// Pull pertinent metadata from the projected views housed in the row index. 
const article = op.fromView('HubArticle', 'HubArticle', null, op.fragmentIdCol('viewDocId'));

let results =
    docSearch
        .joinInner(article, op.on('fragmentId', 'viewDocId'))
        .orderBy(op.desc('score'))
        .offset(page * limit)
        .limit(limit)
        .map(row => prepareRow(row, query))
        .result();

/** Output the results **/
Array.from(results)
