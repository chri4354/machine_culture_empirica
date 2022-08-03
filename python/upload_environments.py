"""Usage: upload_environments.py ENVIRONMENTS_JSON

....

Arguments:
    ENVIRONMENTS_JSON     A json file with networks.
"""

from docopt import docopt
import sys
import pymongo
import json
import os

MONGO_URL = os.environ.get('MC_MONGO_URL', "mongodb://localhost:3001/")


def load_json(filename):
    with open(filename) as f:
        return json.load(f)


def get_database(db_name='meteor'):
    client = pymongo.MongoClient(MONGO_URL)
    db = client[db_name]
    return db



def insert_environments(environments, db_name='meteor', collection_name='networks'):
    db = get_database(db_name)
    col = db[collection_name]

    # environments = [{**e, '_id': create_mongo_env_id(e)} for e in environments]
    inserted_ids = col.insert_many(environments).inserted_ids

    print(f'Inserted a total of {len(inserted_ids)} environments.')


def main(environments_json):
    environments_parsed = load_json(environments_json)
    insert_environments(environments_parsed)


if __name__ == "__main__":
    arguments = docopt(__doc__)
    arguments_low = {k.lower(): v for k, v in arguments.items()}
    main(**arguments_low)
