
from rest_framework import viewsets
from rest_framework.decorators import action
from .services import RAG_response_db
from .services import rag_csv
from rest_framework.response import Response

class ChatResponseSet(viewsets.ViewSet):

    @action(methods=["GET"],detail=False)
    def answer_question(self, request):
        print(request.query_params.get("user_input"))
        print("Query Params:", request.query_params)
        user_question = request.query_params.get("user_input")
        response = rag_csv(user_question)
        print(response)
        return Response({"message": response})
