
from config.settings.config_es import ES_URL
from elasticsearch.client import Elasticsearch

import logging
logger = logging.getLogger(__name__)

es = Elasticsearch(hosts=[ES_URL])

class ESSearchProcessor:
    pass