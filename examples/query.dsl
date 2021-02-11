op.fromSearch(cts.andQuery([
  cts.elementRangeQuery('publicationYear', '>=', 1970),
  cts.wordQuery('research')
]))
  .joinDocUri('uri', op.fragmentIdCol('fragmentId'))
  .joinInner(op.fromView('HubArticle', 'HubArticle', null, op.fragmentIdCol('viewDocId')), op.on('fragmentId', 'viewDocId'))
  .joinInner(
    op.fromSPARQL(`
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX meshv: <http://id.nlm.nih.gov/mesh/vocab#>
      PREFIX mesh: <http://id.nlm.nih.gov/mesh/>
      PREFIX dct: <http://purl.org/dc/terms/>

      SELECT ?label ?descriptor ?articleId
      WHERE {
        ?descriptor meshv:broaderDescriptor* <http://id.nlm.nih.gov/mesh/D003920> .
        ?descriptor rdfs:label ?label .
        ?articleId dct:references ?descriptor
      }
      `, 'MeSH'), op.on('id', 'articleId'))
  .orderBy(op.desc('score'))
  .limit(100)
