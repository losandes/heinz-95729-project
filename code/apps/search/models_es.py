class ESSearchModel:
    autocomplete_analyzer = {
        "settings": {
            "analysis": {
                "analyzer": {
                    "autocomplete_analyzer": {
                        "tokenizer": "autocomplete_tokenizer"
                    }
                },
                "tokenizer": {
                    "autocomplete_tokenizer": {
                        "type": "edge_ngram",
                        "min_gram": 2,
                        "max_gram": 10,
                        "token_chars": [
                            "letter",
                            "digit"
                        ]
                    }
                }
            }
        }
    }