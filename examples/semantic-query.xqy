xquery version "1.0-ml";

import module namespace op="http://marklogic.com/optic" at "/MarkLogic/optic.xqy";

declare option xdmp:mapping "false";
 
(: These values can come in from a users request. We will statically set them for this example. :)
let $meshDesc := sem:iri("http://id.nlm.nih.gov/mesh/D003920")
let $year := 1970
let $wordQuery := "research"
let $limit := 100

(: Search across the corpus of content given the particular MarkLogic Search Criteria :)
let $search := 
      op:from-search(cts:and-query((
        cts:element-range-query(xs:QName("publicationYear"), ">=", $year),
        cts:word-query($wordQuery)
      )))
      
(: Pull pertinent metadata from the projected views housed in the row index. :)      
let $article := op:from-view("HubArticle", "HubArticle", (), op:fragment-id-col("viewDocId"))

(: Set-up a SPARQL query for query expanions :)
(: Configure the SPARQL plan and set a view name. :)
let $mesh := 
  <sparql><![CDATA[
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
  ]]>
  </sparql>
  => op:from-sparql("MeSH")

(: Join the three plans so the results can be further refined. :)
return 
    $search
    => op:join-inner($article, op:on("fragmentId", "viewDocId"))
    => op:join-inner($mesh, op:on("id", "articleId"))
    => op:order-by(op:desc("score"))
    => op:limit($limit)
    => op:result("object", map:new((map:entry("meshDesc", $meshDesc))) )
