library(jsonlite)
library(httr)
library(readr)

opticquery <- readr::read_file("/Users/dwanczow/Documents/workspace/mesh/examples/query.dsl")
req <-
  httr::POST("http://localhost:8011/v1/rows?column-types=header",
             httr::add_headers(
               "Content-Type" = "application/vnd.marklogic.querydsl+javascript"
             ),
             body = opticquery,
             authenticate('demo-user', 'demo123', type = "digest")
  )


stop_for_status(req)

resp <- content(req, "text")
rows <- jsonlite::fromJSON(resp)$rows
View(rows)
