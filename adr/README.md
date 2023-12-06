# Architecture Decision Records

## P1
- **Python for Backend**
  We switched to Python for the backend system for two reasons. First, our retrieval augmented generation (RAG) model is written in Python. Integrating Python programs with javascript may cause unexpected problems. Secondly, there is a time constraint for the project and our team lacks the knowledge to handle back end in javascript. Considering the functionality and time constraint, we decided to write the back end in Python.

- **CSV as Data Source**
  We chose a CSV file online as our data source instead of using a third-party API. A CSV file can give us a clear idea about the data, such as the number of records and variables of books, giving us more control over the input and output of the RAG model. Moreover, the chat service is integrated within the bookstore website to effectively fulfill the bookstore's objectives and enhance its functionality. A third-party API may provide more book information than the bookstore has. Lastly, with a third-party API that knows everything, it may increase the difficulty of testing whether the information comes from API or the language model. Therefore, we believe a CSV file with limited records can better serve our learning objective.

- **OpenAI + langchain**
  We combined OpenAI and langchain for the RAG model. Langchain serves as the middleware to pass our data source, chat history, and users' questions to OpenAI. OpenAI will response based on our prompt and the information provided. OpenAI is easy to use and have better performance in terms of speed. Our team has previous experience working with OpenAI, and therefore, decide to use OpenAI as the language model for this project.

- **Build Chat Page from Scratch**
  We decided to build the chat interface from scratch using Typescript and Tailwind CSS. We did research on the open-source projects on Github to see if we can adopt any components from them. However, we realized that many of the chat services are integrated with other services, making it hard to understand and extract the service from the projects.



## P2
- Convert CSV to Database
