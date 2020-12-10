# Multi-Model Data Management and Querying with MarkLogic

## Prerequisites
* MarkLogic Server 10.0-5
* MarkLogic Data Hub Quick Start 5.2.5 (Optional)
* Java 11
* Gradle 5.2.1 (Optional, gradle wrapper can be leveraged) 
* R Studio (Optional)
* Python 3 (Optional)

## Overview
Task identify articles that may not have been visible to the end-user due to narrow classification.

* Identify article data from PubMed
* Load article data from PubMed
* Create a canonical entity view for Articles
* Integrate the source data defined by the entity
* Identify data that could be graphed for Concepts
* Load graph data from PubMed for MeSH
* Classify the data with semantic information using a TDE
* Provide Multi-Model search capability for data insights
    * Full-Text Search
    * Field Range Querying
    * Query Expansion using Semantic Data
* Provide a unified development API for searching data

## Ingest Semantic Data

MarkLogic can store Semantic data natively in Managed Form. This is helpful for ingesting already known semantic data sets. For this example, we will be using the PubMed Medical Subject Headings (MeSH)

Download for the Mesh Headings: <https://www.nlm.nih.gov/databases/download/mesh.html>.

The file should be placed under `data/mesh/mesh.nt` to be loaded by the pre-configured MLCP task.

The gradle task `./gradlew loadMeSH` can be run to load the graph into the Final Database.

## Creating Entity Models

Within your Quick Start application click entities and define your canonical Entity Model. The entity model can be enhanced iteratively. Since data is stored as an enveloped document you can track the original with the canonical.

We will be running queries from views derived from this model. Indexes are created automatically based on the entity definition. The entity will have a few additional indexes configured to help with aggregation and faceting. This is illustrated by the lightning bolt check box.

## Creating Data Flows

In Quick Start create a flow for the PubMed Articles. The image below includes a flow for PubMed. This includes two steps.

* An Ingestion step the raw XML
* A Mapping step for field mapping to pull pertinent fields for the queries

The flow will load and harmonize the records.

`./gradlew loadArticles`
`./gradlew harmonizeArticles`

The loading of the data will utilize MLCP to load an aggregate file of XML that can be retrieved form the PubMed samples found here <https://www.nlm.nih.gov/databases/download/pubmed_medline.html>. Download an aggregate file, for this these queries `pubmed20n0004.xml` is used. Place gzip files in `data/articles` to be picked up by MLCP.

## Template Driven Extraction (TDE)

A TDE is used to extract values from the Article content to form two additional triples each. The Article ID to the Document URI and the Article ID to the MeSH Subject Heading present in the categorization of the Article. This will attach the article content to the ontological graph. See `src/main/ml-schemas/tde/pubmed.tdex` for the extraction rules.

## Creating a Multi-Model Query

The MarkLogic API includes a query library, Optic, that will allow for multi-model searching. Our example here uses view data from the Entity Definition and Semantic Data from the Managed Triples.

We can execute a SPARQL query to determine the graph of relationships and join the query to view based data. This all occurs within the MarkLogic server and does not federate searches to other systems. This query utilizes the MarkLogic indexes to be efficient, transactional, and flexible. As data becomes available all indexes are updated in real-time with the commit of the transaction.

See `examples` for full example of SPARQL, SJS, and XQuery.

## Egressing Data

The typical way to egress data from MarkLogic is create your own APIs via Data Services <https://docs.marklogic.com/guide/java/DataServices>. This will allow you to proxy MarkLogic with a Java Middle Tier. The examples that we illustrated in this search can be easily converted to a Data Service.  See `src/main/ml-modules/root/ds/search` for the Data Service configuration and main module. The Java source code can be found under `src/main/java/com/marklogic/example`

In other cases, you may just want to call an out of the box REST API with a client that does not have a native client SDK. You can easily serialize your optic query plan by calling `.export()` this will create a JSON document that can be passed to the `/v1/rows` API. See examples `examples/egress.r` to pull the data into R Data Frames or `examples/egress.py` to pull the data into Python Pandas.
