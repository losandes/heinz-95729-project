
from config.settings.config_es import ES_URL
from elasticsearch.client import Elasticsearch
from apps.search.models_es import ESSearchModel

import logging
logger = logging.getLogger(__name__)

es = Elasticsearch(hosts=[ES_URL])

class ESSearchProcessor:
    def create_autocomplete_analyzer():
        try:
            # create an analyzer
            es.indices.delete(index='autocomplete_analyzer', ignore=[400, 404])
        except Exception:
            pass

        try:
            res = es.indices.create(index='autocomplete_analyzer',
                                    ignore=400, body=ESSearchModel.autocomplete_analyzer)
            return res
        except Exception:
            return "complete"
        
    