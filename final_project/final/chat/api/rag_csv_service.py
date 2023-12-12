from langchain.document_loaders.csv_loader import CSVLoader
import os
from langchain.embeddings.openai import OpenAIEmbeddings
from django.conf import settings
from langchain.vectorstores import FAISS
from langchain.chains import ConversationalRetrievalChain
from langchain.chat_models import ChatOpenAI


os.environ['OPENAI_API_KEY'] = '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'
file_path = os.path.join(settings.BASE_DIR, 'book_dataset.csv')

def rag_csv(query, chat_history):

    loader = CSVLoader(file_path)
    docs = loader.load()

    embeddings = OpenAIEmbeddings()

    vectorstore = FAISS.from_documents(docs, embeddings)

    vectorstore.save_local("faiss_index_constitution")

    persisted_vectorstore = FAISS.load_local("faiss_index_constitution", embeddings)

    chain = ConversationalRetrievalChain.from_llm(llm = ChatOpenAI(temperature=0.5,model_name='gpt-3.5-turbo'),retriever=persisted_vectorstore.as_retriever())

    inputs = {"question": query, "chat_history": chat_history}

    result = chain(inputs)

    # if is_satisfactory(result["answer"]):
    #     return result["answer"]
    # else:
    #     llm = ChatOpenAI(temperature=0.5, model_name='gpt-3.5-turbo')
    #     return llm({"question": query, "chat_history": ""})["answer"]

    return result["answer"]


# def is_satisfactory(answer):
#     pass
