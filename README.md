<p align="center">
  <img src="./docs/assets/logo.png">
</p>

# CMU Heinz 95729 Course Project - Pandama Team

This repo is created based on [**Pandama**](https://github.com/liuninglin/pandama) which is a course project for "Web Development (17637)". For detailed info on Pandama, you can check out the wiki of Pandama to get to know more info like business architecture, tech architecture, data flows, and backlogs. [https://github.com/liuninglin/pandama/wiki](https://github.com/liuninglin/pandama/wiki)

## Team Members

| Name | Department  | GitHub | Features | Module |
|---|---|---|---|---|
| Ninglin Liu | Heinz - MISM | [liuninglin](https://github.com/liuninglin) | Autocomplete Search | Search |
| Shu Wu | Heinz - MISM | [sukeascat](https://github.com/sukeascat) | Strip Payment | Payment |
| Zhiben Chen | Heinz - MISM | [ims-kdks](https://github.com/ims-kdks) | OAuth Login | OAuth |
| Xinhao Cheng | INI - MSMITE | [xinhaoc](https://github.com/xinhaoc) | ChatBot Shopping | Bot |

## Purpose of This Project

Add more advanced features into Pandama, like ChatBot, Autocomplete Search, OAuth, and Payment.

## Meaning of Pandama

![meaning of pandama](docs/assets/pandama-name-meaning.png)
It's a combination word from a Chinese word and an English word.
**Panda**: English word, a sign of China.
**Dama**: It means grandma in Chinese. We're trying to give our audiences a feeling of coming back home and eating the delicious food made by their grandma. Convey a feeling of trust, warmth, and relaxation.

## Design of Each New Feature

You can check out our wiki to find detailed user stories, UI design, and tech design for each new feature.
[https://github.com/liuninglin/pandama-ext/wiki](https://github.com/liuninglin/pandama-ext/wiki)

## Management

[GitHub Project](https://github.com/users/liuninglin/projects/1) and [GitHub Wiki](https://github.com/liuninglin/pandama-ext/wiki)

## Demo

![demo](/docs/assets/demo.gif)

## How to Run

1. Copy log folder

   Copy the log folder to the root folder.

2. Copy env folder
  
   Copy the env folder to the root folder.

3. Copy data folder
  
3. Copy data folder
  
   Copy the data folder to the root folder.

4. Run all data service (PostgreSQL, Redis, MongoDB, Neo4j, Elasticsearch, and RabbitMQ)
4. Run all data service (PostgreSQL, Redis, MongoDB, Neo4j, Elasticsearch, and RabbitMQ)

   ```bash
   docker-compose -f docker-compose-dev.yml up
   ```

5. Install all python packages into a virtual env
5. Install all python packages into a virtual env

   ```bash
   cd pandama-ext/code
   pipenv install
   ```

6. Run Django web service
6. Run Django web service

   ```bash
   cd code
   pipenv shell
   python manage.py runserver
   ```

7. Access Pandama with the mobile mode in the browser ( Chrome )

   Access [http://localhost](http://localhost), then change the mode of your browser to mobile mode.
   **Warning: You'll face some 404 or 500 errors because some services aren't launched ready, you need to wait no more than 3 mins**

8. Stop and Close all Services
8. Stop and Close all Services
    1. Close all Data Services
      Just tap "Command" + "C" to exit "docker-compose up", then you can run the code below to make sure all services are down.

         ```bash
         docker-compose -f docker-compose-dev.yml down
         ```

    2. Stop Django Service
      Just tap "Command" + "C" to exit

## Run Unit Tests

**If you already ran all services from "How to Run", you can jump to step 6 directly.**

1. Copy log folder

   Copy the log folder to the root folder.

2. Copy env folder

   Copy the env folder to the root folder.

3. Copy data folder

   Copy the data folder to the root folder.

4. Run all data service (PostgreSQL, Redis, MongoDB, Neo4j, Elasticsearch, and RabbitMQ)
4. Run all data service (PostgreSQL, Redis, MongoDB, Neo4j, Elasticsearch, and RabbitMQ)

   ```bash
   docker-compose -f docker-compose-dev.yml up
   ```

5. Install all python packages into a virtual env
5. Install all python packages into a virtual env

   ```bash
   cd code
   pipenv install
   ```

6. Run all Django unit tests
6. Run all Django unit tests

   ```bash
   cd code
   pipenv shell
   python manage.py test apps
   ```

## URL and Username/Password for Services

- Pandama webiste
  - http://localhost:8000
- PostgreSQL
  - port: 5432
  - username: pandama
  - pass: pandama
  - db: pandama
- Redis:
  - port: 6379
  - auth: pandama
- MongoDB
  - port: 27017
  - username: pandama
  - pass: pandama
  - db: pandama
- Neo4j:
  - http://localhost:7474/browser
  - auth: neo4j/pandama
- Elasticsearch
  - port: 9200
  - pass: pandama
- RabbitMQ:
  - http://localhost:15672/

## Failed to Run "pipenv install"

You may fail to run this command because of the M1 chip. You can try to google and find a solution to resolve this issue. Or you can also try the solution below.

```bash
cd code
pipenv shell
pip install -r requirements.txt
```
