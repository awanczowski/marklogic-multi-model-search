-- query

SELECT * FROM HubArticle
where HubArticle.HubArticle.abstract like '%research%' AND 
      HubArticle.HubArticle.abstract  like '%diabetes%' AND
      HubArticle.HubArticle.publicationYear	>= 1970
LIMIT 100