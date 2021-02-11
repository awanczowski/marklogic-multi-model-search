import requests
from requests.auth import HTTPDigestAuth

import pandas
import json

query = open('query.dsl', 'r').read()

resp = requests.post(
    "http://localhost:8011/v1/rows?column-types=header",
    data=query,
    headers={"Content-Type": "application/vnd.marklogic.querydsl+javascript"},
    auth=HTTPDigestAuth('demo-user', 'demo123'))

data = json.loads(resp.text)
frame = pandas.DataFrame.from_dict(data['rows'])

frame
