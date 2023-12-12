
from rest_framework import viewsets
from rest_framework.decorators import action
from .rag_csv_service import rag_csv
from rest_framework.response import Response

class ChatResponseSet(viewsets.ViewSet):

    @action(methods=["GET"],detail=False)
    def answer_question(self, request):
        print(request.query_params.get("user_input"))
        print("Query Params:", request.query_params)
        user_question = request.query_params.get("user_input")
        chat_history = request.query_params.get("chat_history")
        append_string = "Answer the user's question in the JSON key “answer”, and also Format the related book information output as JSON with the other following keys: answer, related_book_name, price, rating, image_link."
        # Appending the string to user_question
        user_question += " " + append_string
        response = rag_csv(user_question, chat_history)
        print(response)

        if response:
            message = response.get("message")
            details = {
                "related_book_name": response.get("related_book_name"),
                "image_link": response.get("image_link"),
                "book_description": response.get("book_description"),
                "price": response.get("price"),
                "rating": response.get("rating"),
                "checkout": "https://buy.stripe.com/4gw16B1lY1fj7kseUW"
            }
            return Response({"data": {"message": message, "details": details}})
        else:
            # Handle the case where response is None or empty
            return Response({"error": "No data found"}, status=400)
