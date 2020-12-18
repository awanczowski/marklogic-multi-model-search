xquery version "1.0-ml";

import module namespace op="http://marklogic.com/optic" at "/MarkLogic/optic.xqy";

declare option xdmp:mapping "false";
 
(: These values can come in from a users request. We will statically set them for this example. :)
let $meshDesc := sem:iri("http://id.nlm.nih.gov/mesh/D003920")

(: Set-up a SPARQL query for query expanions :)
(: Configure the SPARQL plan and set a view name. :)
let $mesh := 
  <sparql><![CDATA[
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
  ]]>
  </sparql>/text() 
  => op:from-sparql("MeSH")


(: Configure a Schema (Table) plan that utilzies the generated view from the entity model. :)
(: You can further refine the results using ML search library. :)
(: Join the two plans on the Article ID so the results can be further refined. :)
return 
   op:from-view("HubArticle", "HubArticle") 
    => op:join-inner($mesh, op:on(op:view-col("HubArticle", "id"), op:view-col("MeSH", "id")))
    => op:group-by("label", (op:count("labelCount", "label")))
    => op:order-by(op:desc("labelCount"))
    => op:result("object", map:new((map:entry("meshDesc", $meshDesc))) )
