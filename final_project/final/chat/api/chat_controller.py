
from rest_framework import viewsets
from rest_framework.decorators import action
from .rag_csv_service import rag_csv
from rest_framework.response import Response
import json

class ChatResponseSet(viewsets.ViewSet):


    @action(methods=["GET"],detail=False)
    def answer_question(self, request):
        print(request.query_params.get("user_input"))
        print("Query Params:", request.query_params)
        user_question = request.query_params.get("user_input")
        chat_history = []
        for key, value in request.query_params.lists():
            if key.startswith("chat_history"):
                # Extracting the index and field (e.g., sender, text) from the key
                _, index, field = key.split("[")
                index = int(index[:-1])  # Removing the closing bracket and converting to int
                field = field[:-1]  # Removing the closing bracket

                # Ensuring the list is large enough
                while len(chat_history) <= index:
                    chat_history.append({})

                chat_history[index][field] = value[0]

        chat_history = [(item.get("sender"), item.get("text")) for item in chat_history]

        # Adding the user's current input as the latest entry in chat history
        chat_history.append(("User", user_question))


        print("below is chat history")
        print(type(chat_history))
        print(chat_history)
        print("above is chat history")

        json_prompt = (
            "Based on the user's question, provide a detailed answer. Format the response as a JSON object. Include the following keys:\n"
            "- 'answer': Contain a concise yet informative response to the user's question.\n"
            "- 'related_book_name': If the question is about a book or can be associated with a specific book, mention its title here.\n"
            "- 'price': Include the book's approximate price. If the exact price is not known, provide an estimated range.\n"
            "- 'rating': Give an estimated rating of the book out of 5, based on general reviews or popularity.\n"
            "- 'image_link': Provide a URL to an image of the book's cover or a related image. If an exact image is not available, mention 'N/A'.\n\n"
            "Ensure that the information is accurate and relevant to the user's question. The response should be concise and directly address the query without restating it. Provide only the requested information. If there are multiple books, only return information about one"
        )

        prompt = "User's question: "
        prompt += user_question + " "
        prompt += json_prompt
        response = rag_csv(prompt, chat_history)
        print(response)

        response = json.loads(response)


        if response:
            message = response.get("answer")
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
