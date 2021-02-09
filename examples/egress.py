import requests
from requests.auth import HTTPDigestAuth

import pandas
import json

plan = open('plan.json', 'r').read()

resp = requests.post(
    "http://localhost:8011/v1/rows?column-types=header&bind:meshDesc=http://id.nlm.nih.gov/mesh/D003920",
    data=plan,
    headers={"Content-Type": "application/json"},
    auth=HTTPDigestAuth('demo-user', 'demo123'))

data = json.loads(resp.text)
frame = pandas.DataFrame.from_dict(data['rows'])

frame
