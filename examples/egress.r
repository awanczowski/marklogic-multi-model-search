library(jsonlite)
library(httr)
library(readr)

opticquery <- readr::read_file("plan.json")
req <-
httr::POST("http://localhost:8011/v1/rows?column-types=header&bind:meshDesc=http://id.nlm.nih.gov/mesh/D003920",
           httr::add_headers(
             "Content-Type" = "application/json"
           ),
           body = opticquery,
           authenticate('demo-user', 'demo123', type = "digest")
)


stop_for_status(req)
rows <- jsonlite::fromJSON(response)$rows
View(flatten(rows))
