
# chat_Fork_CUI_heinz-95729-project
most of the chnages were made in the Domains/src/chat folder

Instrucctions to install the Front- end

```

## For Mac users, you might need to execute this instructions before installing the dependencies


/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node

# Install pnpm (this is necessary as long as this is a mono-repo)
npm install -g pnpm

If the operative system throws an error related  to permission issues, use this command

Sudo npm install -g pnpm

# Install axios framework
npm install axios

# Install the app's dependencies
pnpm install
cd api
pnpm install
cd ../

# Initialize your .env and data_volumes
pnpm init:env
# Review .env

# Start the app in _watch_ mode
pnpm run dev

```

Back End

## go to the Final project folder
cd final_project
cd final
## activate a virtual environment
python -m venv venv
source venv/bin/activate
## Install dependencies
pip install -r requirements.txt

## Modify Key to run OpenAPi service
open the file rag_csv_service.py
located at  final_project/final/chat/api

Modify this line with the key that will be sent by slack,
os.environ['OPENAI_API_KEY'] = ''

## run the service

python manage.py runserver






