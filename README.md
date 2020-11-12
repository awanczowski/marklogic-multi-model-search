# Multi-Model Data Managment and Querying with MarkLogic

Task idenfiy articles that may not have been visable to the end-user due to narrow classfication.

* Identify semi-structured review data from Glassdoor and Indeed
* Load semi-structured review data from Glassdoor and Indeed
* Create a canonical entity view for Job Reviews
* Integrate the source data defined by the entity
* Identify data that could be graphed for Concepts
* Load graph data from PubMed for MeSH
* Classify the data with semantic information using a TDE
* Provide Multi-Model search capability for data insights
** Full-Text Search
** Field Range Querying
** Query Expansion using Semantic Data
* Provide a unified development API for searching data

## Ingest Semantic Data

MarkLogic can store Semantic data natively in Managed Form. This is helpful for ingesting already known semantic data sets. For this example, we will be using the PubMed Medical Subject Headings (MeSH)

Download for the Mesh Headings: <https://www.nlm.nih.gov/databases/download/mesh.html>.

The file should be palced under `data/mesh/mesh.nt` to be loaded by the pre-configured MLCP task.

The gradle task ./gradlew loadMeSH can be run to load the graph into the Final Database.

## Creating Entity Models

Within your Quick Start application click entities and define your canonical Entity Model. The entity model can be enhanced intervalley. Since data is stored as an enveloped document you can track the original with the canonical.

We will be running queries from views derived from this model. Indexes are created automatically based on the entity definition. The entity will have a few additional indexes configured to help with aggregation and faceting. This is illustrated by the lightning bolt check box.

## Creating Data Flows

In Quick Start create a flow for the PubMed Articles. The image below includes a flow for PubMed. This includes two steps.

* An Ingestion step the raw XML
* A Mapping step for field mapping to pull pertinent fields for the queries

The flow will load and harmonize the records.

`./gradlew loadArticles`
`./gradlew harmonizeArticles`

The loading of the data will utilize MLCP to load an aggregage file of XML that can be retirived form the pubmed samples found here <https://www.nlm.nih.gov/databases/download/pubmed_medline.html>. Download an aggregate file, for this example `pubmed20n0004.xml` and place it in `data/articles` to be picked up.

## Creating a Multi-Model Query

The MarkLogic API includes a query library, Optic, that will allow for multi-model searching. Our example here uses view data from the Entity Definition and Semantic Data from the Managed Triples.

We can execute a SPARQL query to determine the graph of relationships and join the query to view based data. This all occurs within the MarkLogic server and does not federate searches to other systems. This query utilizes the MarkLogic indexes to be efficient, transactional, and flexible. As data becomes available all indexes are updated in real-time with the commit of the transaction.

See Workspaces for full example.
