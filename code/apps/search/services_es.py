
from config.settings.config_es import ES_URL, ES_INDEX_PRODUCTS
from elasticsearch.client import Elasticsearch

import logging
logger = logging.getLogger(__name__)

es = Elasticsearch(hosts=[ES_URL])

class ESSearchProcessor:
    def autocomplete_search(query):
        try:
            res = es.search(index=ES_INDEX_PRODUCTS, body={
                "query": {
                    "multi_match": {
                        "query": query,
                        "fields": ["name", "chinese_name"]
                    }
                }
            })
            for hit in res["hits"]["hits"]:
                hit["source"] = hit["_source"]
                del hit["_source"]
            return res
        except Exception as e:
            logger.error("Error while searching for autocomplete: " + str(e))
            return None
