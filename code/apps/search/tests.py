from django.test import TestCase
from elasticmock import elasticmock
from apps.search.services_es import ESSearchProcessor

class AutocompleteSearchTestCase(TestCase):
    # test case for correct case, typed the length of the word is 2
    @elasticmock
    def test_autocomplete_search_1(self):
        res = ESSearchProcessor.autocomplete_search("be")
        self.assertEqual(res["hits"]["total"]["value"], 9)

    # test case for correct case, typed the length of the word more than 2
    @elasticmock
    def test_autocomplete_search_2(self):
        res = ESSearchProcessor.autocomplete_search("beef")
        self.assertEqual(res["hits"]["total"]["value"], 3)
        
    # test case for bad case, typed the length of the word is 1
    @elasticmock
    def test_autocomplete_search_3(self): 
        res = ESSearchProcessor.autocomplete_search("b")
        self.assertEqual(res["hits"]["total"]["value"], 0)
    
    # test case for bad case, typed the length of the word is 0
    @elasticmock
    def test_autocomplete_search_4(self): 
        res = ESSearchProcessor.autocomplete_search("")
        self.assertEqual(res["hits"]["total"]["value"], 0)
