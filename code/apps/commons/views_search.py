
from apps.search.services_es import ESSearchProcessor
from django.shortcuts import render

class SearchPageViews:
    def autocomplete_search_ajax(request):
        if request.method == "GET":
            query = request.GET.get("query", None)
            
            res = ESSearchProcessor.autocomplete_search(query)
            
            return render(request, "online-store/segment/search-result-list-seg.html", {"searchResultList": res})
    
        