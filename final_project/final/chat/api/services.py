from langchain.agents import create_sql_agent
from langchain.agents.agent_toolkits import SQLDatabaseToolkit
from langchain.agents.agent_types import AgentType
#from langchain.llms.openai import OpenAI
from langchain.sql_database import SQLDatabase

from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
from langchain.document_loaders.csv_loader import CSVLoader
from django.conf import settings
import os

os.environ['OPENAI_API_KEY'] = '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'
file_path = os.path.join(settings.BASE_DIR, 'book_dataset.csv')



def RAG_response_db(user_question):
    db = SQLDatabase.from_uri("sqlite:////Users/erichu/Desktop/final_project/final/db.sqlite3")
    toolkit = SQLDatabaseToolkit(db=db, llm=OpenAI(temperature=0))

    agent_executor = create_sql_agent(
        llm=OpenAI(temperature=0),
        toolkit=toolkit,
        verbose=True,
        agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    )

    output = agent_executor.run(user_question)
    return output

def rag_csv(query):

    loader = CSVLoader(file_path)
    docs = loader.load()

    embeddings = OpenAIEmbeddings()

    vectorstore = FAISS.from_documents(docs, embeddings)

    vectorstore.save_local("faiss_index_constitution")

    persisted_vectorstore = FAISS.load_local("faiss_index_constitution", embeddings)

    qa = RetrievalQA.from_chain_type(llm=OpenAI(), chain_type="stuff", retriever=persisted_vectorstore.as_retriever())
    result = qa.run(query)
    print(result)
    return result
